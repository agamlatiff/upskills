import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMentorCourses } from "../../hooks/useMentorCourses";
import { useAuth } from "../../hooks/useAuth";
import useToastStore from "../../store/toastStore";
import apiClient from "../../utils/api";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XIcon,
  BookOpenIcon,
} from "../../components/Icons";
import { getCourseThumbnailUrl } from "../../utils/imageUrl";

interface Category {
  id: number;
  name: string;
}

const MentorCourses: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { courses, loading, error, createCourse, updateCourse, deleteCourse } =
    useMentorCourses();
  const toast = useToastStore();

  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    thumbnail: null as File | null,
    about: "",
    category_id: "",
    difficulty: "beginner",
    is_free: false,
    is_populer: false,
    benefits: [""] as string[],
  });
  const [formLoading, setFormLoading] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  // Check if user is mentor
  useEffect(() => {
    if (isAuthenticated && user) {
      // Check if user has mentor role - roles might be array or object
      const userRoles = Array.isArray(user.roles) ? user.roles : [];
      const roleNames = userRoles.map((r: any) =>
        typeof r === "string" ? r : r?.name || ""
      );
      const isMentor = roleNames.includes("mentor");

      if (!isMentor) {
        // Debug log to help troubleshoot
        if (process.env.NODE_ENV === "development") {
          console.log("User roles:", user.roles);
          console.log("Role names:", roleNames);
          console.log("Is mentor:", isMentor);
        }
        toast.error(
          "Only mentors can access this page. Your current role: " +
            (roleNames.length > 0 ? roleNames.join(", ") : "none")
        );
        navigate("/");
      }
    } else if (!isAuthenticated) {
      navigate("/signin");
    }
  }, [isAuthenticated, user, navigate, toast]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.get<Category[]>("/categories");
        setCategories(response.data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, thumbnail: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBenefitChange = (index: number, value: string) => {
    const newBenefits = [...formData.benefits];
    newBenefits[index] = value;
    setFormData((prev) => ({ ...prev, benefits: newBenefits }));
  };

  const addBenefit = () => {
    setFormData((prev) => ({ ...prev, benefits: [...prev.benefits, ""] }));
  };

  const removeBenefit = (index: number) => {
    const newBenefits = formData.benefits.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      benefits: newBenefits.length > 0 ? newBenefits : [""],
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      thumbnail: null,
      about: "",
      category_id: "",
      difficulty: "beginner",
      is_free: false,
      is_populer: false,
      benefits: [""],
    });
    setThumbnailPreview(null);
    setEditingCourse(null);
    setShowForm(false);
  };

  const handleEdit = (course: any) => {
    setEditingCourse(course);
    setFormData({
      name: course.name,
      thumbnail: null,
      about: course.about || "",
      category_id: course.category?.id?.toString() || "",
      difficulty: course.difficulty || "beginner",
      is_free: course.is_free || false,
      is_populer: course.is_populer || false,
      benefits: course.benefits?.map((b: any) => b.name || b.benefit || "") || [
        "",
      ],
    });
    if (course.thumbnail) {
      setThumbnailPreview(getCourseThumbnailUrl(course.thumbnail));
    }
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.about || !formData.category_id) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!editingCourse && !formData.thumbnail) {
      toast.error("Please upload a course thumbnail");
      return;
    }

    setFormLoading(true);
    try {
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("about", formData.about);
      submitData.append("category_id", formData.category_id);
      submitData.append("difficulty", formData.difficulty);
      submitData.append("is_free", formData.is_free ? "1" : "0");
      submitData.append("is_populer", formData.is_populer ? "1" : "0");

      if (formData.thumbnail) {
        submitData.append("thumbnail", formData.thumbnail);
      }

      // Add benefits
      const validBenefits = formData.benefits.filter((b) => b.trim() !== "");
      validBenefits.forEach((benefit, index) => {
        submitData.append(`benefits[${index}]`, benefit);
      });

      if (editingCourse) {
        await updateCourse(editingCourse.id, submitData);
        toast.success("Course updated successfully!");
      } else {
        await createCourse(submitData);
        toast.success("Course created successfully!");
      }

      resetForm();
    } catch (err: any) {
      toast.error(err.message || "Failed to save course");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (courseId: number, courseName: string) => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${courseName}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await deleteCourse(courseId);
      toast.success("Course deleted successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete course");
    }
  };

  if (loading && courses.length === 0) {
    return (
      <main className="py-16 sm:py-20 lg:py-24 bg-slate-900 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <svg
                className="animate-spin h-12 w-12 text-blue-500 mx-auto"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <p className="mt-4 text-slate-400">Loading courses...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="py-16 sm:py-20 lg:py-24 bg-slate-900 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-2">
              My Courses
            </h1>
            <p className="text-slate-400">Create and manage your courses</p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="h-5 w-5" />
              Create Course
            </button>
          )}
        </div>

        {/* Create/Edit Form */}
        {showForm && (
          <div className="mb-8 bg-brand-dark border border-slate-800 rounded-2xl shadow-lg p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {editingCourse ? "Edit Course" : "Create New Course"}
              </h2>
              <button
                onClick={resetForm}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <XIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Course Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Course Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter course name"
                  required
                />
              </div>

              {/* Thumbnail */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Course Thumbnail{" "}
                  {!editingCourse && <span className="text-red-400">*</span>}
                </label>
                <div className="flex items-start gap-4">
                  {thumbnailPreview && (
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      className="w-32 h-32 object-cover rounded-lg border border-slate-700"
                    />
                  )}
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                    />
                    <p className="mt-2 text-xs text-slate-400">
                      Max size: 2MB. Recommended: 1280x720px
                    </p>
                  </div>
                </div>
              </div>

              {/* About */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Course Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  name="about"
                  value={formData.about}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe what students will learn in this course"
                  required
                />
              </div>

              {/* Category and Difficulty */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Category <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleInputChange}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Difficulty Level <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_free"
                    checked={formData.is_free}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-blue-600 bg-slate-800 border-slate-700 rounded focus:ring-blue-500"
                  />
                  <span className="text-slate-300">Free Course</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_populer"
                    checked={formData.is_populer}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-blue-600 bg-slate-800 border-slate-700 rounded focus:ring-blue-500"
                  />
                  <span className="text-slate-300">Mark as Popular</span>
                </label>
              </div>

              {/* Benefits */}
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Course Benefits
                </label>
                <div className="space-y-3">
                  {formData.benefits.map((benefit, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={benefit}
                        onChange={(e) =>
                          handleBenefitChange(index, e.target.value)
                        }
                        className="flex-1 bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={`Benefit ${index + 1}`}
                      />
                      {formData.benefits.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeBenefit(index)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <XIcon className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addBenefit}
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                  >
                    + Add Benefit
                  </button>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formLoading
                    ? "Saving..."
                    : editingCourse
                    ? "Update Course"
                    : "Create Course"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 bg-slate-700 text-white font-semibold rounded-full hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {/* Courses List */}
        {courses.length === 0 && !showForm ? (
          <div className="text-center py-16 bg-brand-dark border border-slate-800 rounded-2xl">
            <p className="text-slate-400 mb-4">
              You haven't created any courses yet.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="h-5 w-5" />
              Create Your First Course
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-brand-dark border border-slate-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-blue-500/20 transition-shadow flex flex-col"
              >
                <Link
                  to={`/courses/${course.slug}`}
                  className="flex-1 flex flex-col cursor-pointer"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={getCourseThumbnailUrl(course.thumbnail)}
                      alt={course.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src =
                          "https://via.placeholder.com/400x225?text=No+Image";
                      }}
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      {course.is_free && (
                        <span className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-full">
                          Free
                        </span>
                      )}
                      {course.is_populer && (
                        <span className="px-3 py-1 bg-yellow-500 text-yellow-900 text-xs font-bold rounded-full">
                          Popular
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                      {course.name}
                    </h3>
                    <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                      {course.about}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          course.difficulty === "beginner"
                            ? "bg-green-600 text-white"
                            : course.difficulty === "intermediate"
                            ? "bg-yellow-500 text-yellow-900"
                            : "bg-red-600 text-white"
                        }`}
                      >
                        {course.difficulty?.charAt(0).toUpperCase() +
                          course.difficulty?.slice(1)}
                      </span>
                      <span className="text-slate-400 text-sm">
                        {course.category?.name}
                      </span>
                    </div>
                  </div>
                </Link>
                <div
                  className="px-6 pb-6 flex flex-col gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Link
                    to={`/mentor/courses/${course.id}/content`}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <BookOpenIcon className="h-4 w-4" />
                    Manage Content
                  </Link>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(course)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <PencilIcon className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(course.id, course.name)}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default MentorCourses;
