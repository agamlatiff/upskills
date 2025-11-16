import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import useToastStore from '../../store/toastStore';
import apiClient from '../../utils/api';
import { ArrowLeftIcon, PlusIcon, PencilIcon, TrashIcon, XIcon, ChevronDownIcon, ChevronUpIcon } from '../../components/Icons';

interface CourseSection {
  id: number;
  name: string;
  position: number;
  section_contents?: SectionContent[];
}

interface SectionContent {
  id: number;
  name: string;
  content: string;
  course_section_id: number;
}

const MentorCourseContent: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const toast = useToastStore();

  const [course, setCourse] = useState<any>(null);
  const [sections, setSections] = useState<CourseSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>({});
  
  // Section form state
  const [showSectionForm, setShowSectionForm] = useState(false);
  const [editingSection, setEditingSection] = useState<CourseSection | null>(null);
  const [sectionFormData, setSectionFormData] = useState({
    name: '',
    position: 1,
  });

  // Content form state
  const [showContentForm, setShowContentForm] = useState(false);
  const [editingContent, setEditingContent] = useState<SectionContent | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(null);
  const [contentFormData, setContentFormData] = useState({
    name: '',
    content: '',
  });

  // Check if user is mentor
  useEffect(() => {
    if (isAuthenticated && user) {
      const userRoles = Array.isArray(user.roles) ? user.roles : [];
      const roleNames = userRoles.map((r: any) => typeof r === 'string' ? r : r?.name || '');
      const isMentor = roleNames.includes('mentor');
      
      if (!isMentor) {
        toast.error('Only mentors can access this page');
        navigate('/mentor/courses');
      }
    } else if (!isAuthenticated) {
      navigate('/signin');
    }
  }, [isAuthenticated, user, navigate, toast]);

  // Fetch course and sections
  useEffect(() => {
    if (courseId) {
      fetchCourseAndSections();
    }
  }, [courseId]);

  const fetchCourseAndSections = async () => {
    setLoading(true);
    try {
      // Fetch course details
      const courseResponse = await apiClient.get(`/mentor/courses`);
      const courses = Array.isArray(courseResponse.data) ? courseResponse.data : (courseResponse.data as any)?.data || [];
      const foundCourse = courses.find((c: any) => c.id === parseInt(courseId || '0'));
      
      if (!foundCourse) {
        toast.error('Course not found');
        navigate('/mentor/courses');
        return;
      }

      setCourse(foundCourse);

      // Fetch sections
      const sectionsResponse = await apiClient.get(`/mentor/courses/${courseId}/sections`);
      const sectionsData = Array.isArray(sectionsResponse.data) ? sectionsResponse.data : [];
      setSections(sectionsData);

      // Expand all sections by default
      const expanded: Record<number, boolean> = {};
      sectionsData.forEach((section: CourseSection) => {
        expanded[section.id] = true;
      });
      setExpandedSections(expanded);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to load course content');
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (sectionId: number) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  // Section handlers
  const handleSectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId || !sectionFormData.name) {
      toast.error('Please fill in section name');
      return;
    }

    try {
      if (editingSection) {
        await apiClient.put(`/mentor/courses/${courseId}/sections/${editingSection.id}`, sectionFormData);
        toast.success('Section updated successfully!');
      } else {
        await apiClient.post(`/mentor/courses/${courseId}/sections`, sectionFormData);
        toast.success('Section created successfully!');
      }
      resetSectionForm();
      fetchCourseAndSections();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save section');
    }
  };

  const handleEditSection = (section: CourseSection) => {
    setEditingSection(section);
    setSectionFormData({
      name: section.name,
      position: section.position,
    });
    setShowSectionForm(true);
  };

  const handleDeleteSection = async (sectionId: number, sectionName: string) => {
    if (!window.confirm(`Are you sure you want to delete "${sectionName}"? This will also delete all contents in this section.`)) {
      return;
    }

    try {
      await apiClient.delete(`/mentor/courses/${courseId}/sections/${sectionId}`);
      toast.success('Section deleted successfully!');
      fetchCourseAndSections();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete section');
    }
  };

  const resetSectionForm = () => {
    setSectionFormData({ name: '', position: sections.length + 1 });
    setEditingSection(null);
    setShowSectionForm(false);
  };

  // Content handlers
  const handleContentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId || !selectedSectionId || !contentFormData.name || !contentFormData.content) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      if (editingContent) {
        await apiClient.put(`/mentor/courses/${courseId}/sections/${selectedSectionId}/contents/${editingContent.id}`, contentFormData);
        toast.success('Content updated successfully!');
      } else {
        await apiClient.post(`/mentor/courses/${courseId}/sections/${selectedSectionId}/contents`, contentFormData);
        toast.success('Content created successfully!');
      }
      resetContentForm();
      fetchCourseAndSections();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save content');
    }
  };

  const handleAddContent = (sectionId: number) => {
    setSelectedSectionId(sectionId);
    setContentFormData({ name: '', content: '' });
    setEditingContent(null);
    setShowContentForm(true);
  };

  const handleEditContent = (content: SectionContent, sectionId: number) => {
    setSelectedSectionId(sectionId);
    setEditingContent(content);
    setContentFormData({
      name: content.name,
      content: content.content,
    });
    setShowContentForm(true);
  };

  const handleDeleteContent = async (sectionId: number, contentId: number, contentName: string) => {
    if (!window.confirm(`Are you sure you want to delete "${contentName}"?`)) {
      return;
    }

    try {
      await apiClient.delete(`/mentor/courses/${courseId}/sections/${sectionId}/contents/${contentId}`);
      toast.success('Content deleted successfully!');
      fetchCourseAndSections();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete content');
    }
  };

  const resetContentForm = () => {
    setContentFormData({ name: '', content: '' });
    setEditingContent(null);
    setSelectedSectionId(null);
    setShowContentForm(false);
  };

  if (loading) {
    return (
      <main className="py-16 sm:py-20 lg:py-24 bg-slate-900 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <svg className="animate-spin h-12 w-12 text-blue-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-4 text-slate-400">Loading course content...</p>
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
        <div className="mb-8">
          <Link
            to="/mentor/courses"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-4"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Back to Courses
          </Link>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-2">
            Manage Course Content
          </h1>
          <p className="text-slate-400">{course?.name}</p>
        </div>

        {/* Section Form */}
        {showSectionForm && (
          <div className="mb-8 bg-brand-dark border border-slate-800 rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {editingSection ? 'Edit Section' : 'Create New Section'}
              </h2>
              <button
                onClick={resetSectionForm}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <XIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSectionSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Section Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={sectionFormData.name}
                  onChange={(e) => setSectionFormData({ ...sectionFormData, name: e.target.value })}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Introduction, Getting Started, Advanced Topics"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Position
                </label>
                <input
                  type="number"
                  value={sectionFormData.position}
                  onChange={(e) => setSectionFormData({ ...sectionFormData, position: parseInt(e.target.value) || 1 })}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                />
                <p className="mt-2 text-xs text-slate-400">Order in which this section appears (lower numbers appear first)</p>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors"
                >
                  {editingSection ? 'Update Section' : 'Create Section'}
                </button>
                <button
                  type="button"
                  onClick={resetSectionForm}
                  className="px-6 py-3 bg-slate-700 text-white font-semibold rounded-full hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Content Form */}
        {showContentForm && selectedSectionId && (
          <div className="mb-8 bg-brand-dark border border-slate-800 rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {editingContent ? 'Edit Content' : 'Add New Content'}
              </h2>
              <button
                onClick={resetContentForm}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <XIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleContentSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Content Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={contentFormData.name}
                  onChange={(e) => setContentFormData({ ...contentFormData, name: e.target.value })}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Lesson 1: Introduction to React"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Content <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={contentFormData.content}
                  onChange={(e) => setContentFormData({ ...contentFormData, content: e.target.value })}
                  rows={10}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  placeholder="Enter your lesson content here. You can use HTML or markdown."
                  required
                />
                <p className="mt-2 text-xs text-slate-400">Supports HTML and markdown formatting</p>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors"
                >
                  {editingContent ? 'Update Content' : 'Create Content'}
                </button>
                <button
                  type="button"
                  onClick={resetContentForm}
                  className="px-6 py-3 bg-slate-700 text-white font-semibold rounded-full hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Sections List */}
        <div className="space-y-4">
          {sections.length === 0 ? (
            <div className="text-center py-16 bg-brand-dark border border-slate-800 rounded-2xl">
              <p className="text-slate-400 mb-4">No sections yet. Create your first section to start adding content.</p>
              <button
                onClick={() => setShowSectionForm(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors"
              >
                <PlusIcon className="h-5 w-5" />
                Create First Section
              </button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">Course Sections</h2>
                <button
                  onClick={() => setShowSectionForm(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <PlusIcon className="h-5 w-5" />
                  Add Section
                </button>
              </div>

              {sections.map((section) => (
                <div key={section.id} className="bg-brand-dark border border-slate-800 rounded-2xl shadow-lg overflow-hidden">
                  {/* Section Header */}
                  <div className="p-6 border-b border-slate-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <button
                          onClick={() => toggleSection(section.id)}
                          className="text-slate-400 hover:text-white transition-colors"
                        >
                          {expandedSections[section.id] ? (
                            <ChevronUpIcon className="h-6 w-6" />
                          ) : (
                            <ChevronDownIcon className="h-6 w-6" />
                          )}
                        </button>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white">{section.name}</h3>
                          <p className="text-sm text-slate-400">
                            Position: {section.position} • {section.section_contents?.length || 0} content(s)
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditSection(section)}
                          className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSection(section.id, section.name)}
                          className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Section Contents */}
                  {expandedSections[section.id] && (
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-lg font-semibold text-white">Contents</h4>
                        <button
                          onClick={() => handleAddContent(section.id)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <PlusIcon className="h-4 w-4" />
                          Add Content
                        </button>
                      </div>

                      {section.section_contents && section.section_contents.length > 0 ? (
                        <div className="space-y-3">
                          {section.section_contents.map((content) => (
                            <div key={content.id} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <h5 className="font-semibold text-white mb-2">{content.name}</h5>
                                  <div 
                                    className="text-slate-300 text-sm prose prose-invert max-w-none"
                                    dangerouslySetInnerHTML={{ __html: content.content.substring(0, 200) + (content.content.length > 200 ? '...' : '') }}
                                  />
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleEditContent(content, section.id)}
                                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                  >
                                    <PencilIcon className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteContent(section.id, content.id, content.name)}
                                    className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                  >
                                    <TrashIcon className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-slate-400">
                          <p>No content yet. Click "Add Content" to add your first lesson.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default MentorCourseContent;


