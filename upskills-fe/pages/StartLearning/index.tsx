import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCourseLearning } from '../../hooks/useCourseLearning';
import ProtectedRoute from '../../components/ProtectedRoute';
import { 
  ArrowLeftIcon, 
  ChevronDownIcon, 
  ChevronUpIcon,
  CheckCircleIcon 
} from '../../components/Icons';

const StartLearning: React.FC = () => {
  const { courseSlug, sectionId, contentId } = useParams<{ 
    courseSlug: string; 
    sectionId: string; 
    contentId: string;
  }>();
  const navigate = useNavigate();
  const { learningData, loading, error } = useCourseLearning(
    courseSlug || '',
    sectionId || '',
    contentId || ''
  );
  const [openSections, setOpenSections] = useState<Record<number, boolean>>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    // Open the current section by default
    if (learningData?.current_section) {
      setOpenSections(prev => ({ ...prev, [learningData.current_section!.id]: true }));
    }
  }, [learningData]);

  useEffect(() => {
    // Highlight code blocks if highlight.js is available
    if (typeof window !== 'undefined' && (window as any).hljs) {
      document.querySelectorAll('pre code').forEach((block) => {
        (window as any).hljs.highlightElement(block);
      });
    }
  }, [learningData?.current_content?.content]);

  if (loading) {
    return (
      <div className="flex h-screen bg-slate-900">
        <div className="flex-1 flex items-center justify-center">
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
            <p className="mt-4 text-slate-400">Loading lesson...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !learningData) {
    return (
      <div className="flex h-screen bg-slate-900">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Error Loading Lesson</h1>
            <p className="text-red-400 mb-6">{error || 'Failed to load lesson content'}</p>
            <Link
              to="/dashboard"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { course, current_section, current_content, next_content, is_finished } = learningData;
  const thumbnailUrl = course.thumbnail || '/placeholder-course.jpg';

  const handleNextLesson = () => {
    if (is_finished) {
      navigate(`/courses/${courseSlug}/completed`);
    } else if (next_content) {
      // Use course_section_id from API if available, otherwise find it
      let nextSectionId = next_content.course_section_id;
      
      if (!nextSectionId) {
        // Find the section ID for next content
        const nextSection = course.course_sections?.find(section =>
          section.section_contents?.some(content => content.id === next_content!.id)
        );
        nextSectionId = nextSection?.id;
      }
      
      if (nextSectionId) {
        navigate(`/courses/${courseSlug}/learn/${nextSectionId}/${next_content.id}`);
      } else {
        // If we can't find the section, navigate to completed
        navigate(`/courses/${courseSlug}/completed`);
      }
    }
  };

  const isActiveContent = (sectionId: number, contentId: number) => {
    return current_section?.id === sectionId && current_content?.id === contentId;
  };

  return (
    <div className="flex h-screen bg-slate-900 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? 'w-64' : 'w-0'
        } transition-all duration-300 flex flex-col border-r border-slate-800 bg-slate-800 overflow-hidden`}
      >
        {isSidebarOpen && (
          <>
            {/* Header */}
            <div className="p-5 border-b border-slate-700">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 py-2 px-3 rounded-full border border-slate-700 bg-slate-900 hover:border-blue-500 transition-all text-slate-300 hover:text-white"
              >
                <ArrowLeftIcon className="h-5 w-5" />
                <span>Back to Dashboard</span>
              </Link>
            </div>

            {/* Course Info */}
            <div className="p-5 border-b border-slate-700">
              <div className="flex justify-center items-center overflow-hidden w-full h-24 rounded-lg mb-3 bg-slate-900">
                <img src={thumbnailUrl} alt={course.name} className="w-full h-full object-cover" />
              </div>
              <h1 className="font-bold text-white text-sm line-clamp-2">{course.name}</h1>
            </div>

            {/* Lessons Navigation */}
            <div className="flex-1 overflow-y-auto">
              <nav className="p-5 space-y-4">
                {course.course_sections?.map((section) => (
                  <div key={section.id} className="space-y-2">
                    <button
                      onClick={() =>
                        setOpenSections(prev => ({ ...prev, [section.id]: !prev[section.id] }))
                      }
                      className="w-full flex items-center justify-between text-left hover:text-white transition-colors"
                    >
                      <h2 className="font-semibold text-slate-300 text-sm">{section.name}</h2>
                      {openSections[section.id] ? (
                        <ChevronUpIcon className="h-5 w-5 text-slate-400" />
                      ) : (
                        <ChevronDownIcon className="h-5 w-5 text-slate-400" />
                      )}
                    </button>
                    {openSections[section.id] && (
                      <ul className="space-y-2 pl-2">
                        {section.section_contents?.map((content) => {
                          const isActive = isActiveContent(section.id, content.id);
                          return (
                            <li key={content.id}>
                              <Link
                                to={`/courses/${courseSlug}/learn/${section.id}/${content.id}`}
                                className={`block px-3 py-2 rounded-full border transition-all text-sm ${
                                  isActive
                                    ? 'bg-blue-600 border-blue-600 text-white'
                                    : 'border-slate-700 text-slate-300 hover:border-blue-500 hover:bg-slate-700'
                                }`}
                              >
                                {content.name}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          </>
        )}
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toggle Sidebar Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute top-4 left-4 z-10 p-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors lg:hidden"
        >
          {isSidebarOpen ? '✕' : '☰'}
        </button>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-8 lg:p-12">
          <article className="max-w-4xl mx-auto">
            {current_content && (
              <div className="prose prose-invert max-w-none">
                <h1 className="text-4xl font-bold text-white mb-6">{current_content.name}</h1>
                <div
                  className="text-slate-300 leading-relaxed prose prose-invert max-w-none prose-headings:text-white prose-p:text-slate-300 prose-a:text-blue-400 prose-code:text-slate-200 prose-pre:bg-slate-800 prose-pre:border prose-pre:border-slate-700"
                  dangerouslySetInnerHTML={{ __html: current_content.content }}
                />
              </div>
            )}
          </article>
        </main>

        {/* Bottom Navigation */}
        <nav className="border-t border-slate-800 bg-slate-800/50 backdrop-blur-sm p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between gap-4">
              <p className="text-slate-400 text-sm">
                Study the material carefully. If you have questions, ask your mentor.
              </p>
              <div className="flex items-center gap-3">
                <button className="px-4 py-2 rounded-full border border-slate-700 text-slate-300 hover:border-blue-500 hover:text-white transition-all text-sm font-semibold">
                  Ask Mentor
                </button>
                {is_finished ? (
                  <Link
                    to={`/courses/${courseSlug}/completed`}
                    className="px-6 py-2 rounded-full bg-green-600 text-white hover:bg-green-700 transition-colors font-semibold"
                  >
                    Finish Learning
                  </Link>
                ) : (
                  <button
                    onClick={handleNextLesson}
                    disabled={!next_content}
                    className="px-6 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next Lesson
                  </button>
                )}
              </div>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

const StartLearningWithProtection: React.FC = () => (
  <ProtectedRoute>
    <StartLearning />
  </ProtectedRoute>
);

export default StartLearningWithProtection;
