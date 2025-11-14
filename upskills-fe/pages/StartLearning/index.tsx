
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { allCourses } from '../../data/courses';
import { BookOpenIcon, MenuIcon, XIcon, ArrowLeftIcon, ArrowRightIcon, DownloadIcon, CheckCircleIcon } from '../../components/Icons';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import hljs from 'highlight.js';
import { parseContent } from '../../utils/markdownParser';

const escapeHtml = (text: string) => {
    const p = document.createElement('p');
    p.innerText = text;
    return p.innerHTML;
};

const StartLearning: React.FC = () => {
    const { courseSlug } = useParams<{ courseSlug: string }>();
    const navigate = useNavigate();
    const course = allCourses.find(c => c.slug === courseSlug);

    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
    const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isDownloading, setIsDownloading] = useState(false);
    const [parsedContent, setParsedContent] = useState('');
    const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

    const progressKey = `upskill-progress-${course?.slug}`;

    useEffect(() => {
        try {
            const savedProgress = window.localStorage.getItem(progressKey);
            if (savedProgress) {
                setCompletedLessons(new Set(JSON.parse(savedProgress)));
            }
        } catch (error) {
            console.error("Failed to load progress from localStorage", error);
        }
    }, [course?.slug]);

    useEffect(() => {
        try {
            window.localStorage.setItem(progressKey, JSON.stringify(Array.from(completedLessons)));
        } catch (error) {
            console.error("Failed to save progress to localStorage", error);
        }
    }, [completedLessons, progressKey]);


    const currentLesson = course?.curriculum[currentSectionIndex]?.lessons[currentLessonIndex];
    
    useEffect(() => {
        if (currentLesson) {
            setParsedContent(parseContent(currentLesson.content));
        }
    }, [currentLesson]);

    useEffect(() => {
        if (parsedContent) {
            hljs.highlightAll();
        }
    }, [parsedContent]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [courseSlug, currentSectionIndex, currentLessonIndex]);

    if (!course || !currentLesson) {
        return (
            <div className="flex items-center justify-center h-screen bg-slate-900">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">Course Not Found</h1>
                    <p className="text-slate-400 mb-8">We couldn't find the course you were looking for.</p>
                    <Link to="/courses" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors">
                        Back to Courses
                    </Link>
                </div>
            </div>
        );
    }
    
    const totalLessons = course.curriculum.reduce((acc, section) => acc + section.lessons.length, 0);
    const progressPercentage = totalLessons > 0 ? (completedLessons.size / totalLessons) * 100 : 0;
    
    const getLessonId = (sectionIndex: number, lessonIndex: number) => `${sectionIndex}-${lessonIndex}`;

    const isLessonCompleted = (sectionIndex: number, lessonIndex: number) => {
        return completedLessons.has(getLessonId(sectionIndex, lessonIndex));
    };
    
    const isFirstLesson = currentSectionIndex === 0 && currentLessonIndex === 0;
    const isLastLesson = currentSectionIndex === course.curriculum.length - 1 && currentLessonIndex === course.curriculum[currentSectionIndex].lessons.length - 1;

    const toggleCurrentLessonCompletion = () => {
        const lessonId = getLessonId(currentSectionIndex, currentLessonIndex);
        const newCompletedLessons = new Set(completedLessons);
        if (newCompletedLessons.has(lessonId)) {
            newCompletedLessons.delete(lessonId);
        } else {
            newCompletedLessons.add(lessonId);
        }
        setCompletedLessons(newCompletedLessons);
    };

    const handleNextLesson = () => {
        const lessonId = getLessonId(currentSectionIndex, currentLessonIndex);
        if (!completedLessons.has(lessonId)) {
            const newCompletedLessons = new Set(completedLessons);
            newCompletedLessons.add(lessonId);
            setCompletedLessons(newCompletedLessons);
        }

        if (isLastLesson) {
            navigate(`/courses/${course.slug}/completed`);
            return;
        }

        if (currentLessonIndex < course.curriculum[currentSectionIndex].lessons.length - 1) {
            setCurrentLessonIndex(currentLessonIndex + 1);
        } else if (currentSectionIndex < course.curriculum.length - 1) {
            setCurrentSectionIndex(currentSectionIndex + 1);
            setCurrentLessonIndex(0);
        }
    };

    const handlePrevLesson = () => {
        if (currentLessonIndex > 0) {
            setCurrentLessonIndex(currentLessonIndex - 1);
        } else if (currentSectionIndex > 0) {
            const prevSectionIndex = currentSectionIndex - 1;
            const prevSectionLessonCount = course.curriculum[prevSectionIndex].lessons.length;
            setCurrentSectionIndex(prevSectionIndex);
            setCurrentLessonIndex(prevSectionLessonCount - 1);
        }
    };

    const handleDownloadPdf = async () => {
        const lessonContentElement = document.getElementById('lesson-content');
        if (!lessonContentElement || isDownloading) return;
    
        setIsDownloading(true);
    
        // Create a temporary, off-screen container for rendering
        const renderContainer = document.createElement('div');
        renderContainer.style.position = 'absolute';
        renderContainer.style.left = '-9999px';
        renderContainer.style.width = '800px'; // A fixed width for consistent PDF layout
        renderContainer.style.padding = '40px';
        renderContainer.style.background = '#0F172A'; // bg-brand-dark
        
        // Add titles and content to the container
        renderContainer.innerHTML = `
            <div class="prose prose-invert prose-lg max-w-none prose-h3:text-blue-400 prose-a:text-blue-400 prose-strong:text-slate-100">
                <h1 style="font-size: 24px; font-weight: bold; color: white; margin-bottom: 8px;">${escapeHtml(course.title)}</h1>
                <p style="font-size: 16px; color: #94a3b8; margin-bottom: 24px; border-bottom: 1px solid #334155; padding-bottom: 16px;">${escapeHtml(currentLesson.title)}</p>
            </div>
        `;
        renderContainer.appendChild(lessonContentElement.cloneNode(true));
        
        document.body.appendChild(renderContainer);
    
        try {
            // Find all code blocks and re-apply highlighting
            const codeBlocks = renderContainer.querySelectorAll('pre code');
            codeBlocks.forEach((block) => {
                hljs.highlightElement(block as HTMLElement);
            });
    
            const canvas = await html2canvas(renderContainer, {
                scale: 2,
                backgroundColor: '#0F172A',
                useCORS: true,
            });
    
            const imgData = canvas.toDataURL('image/png');
            
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: [canvas.width, canvas.height]
            });
    
            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            
            const fileName = `${course.title} - ${currentLesson.title}.pdf`.replace(/[^a-zA-Z0-9_-\s]/g, '');
    
            pdf.save(fileName);
        } catch (error) {
            console.error("Failed to generate PDF", error);
        } finally {
            document.body.removeChild(renderContainer);
            setIsDownloading(false);
        }
    };
    
    const currentLessonCompleted = isLessonCompleted(currentSectionIndex, currentLessonIndex);


    return (
        <div className="flex h-screen bg-slate-900 text-slate-300">
            {/* Sidebar */}
            <aside className={`bg-brand-dark border-r border-slate-800 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'w-80' : 'w-0 overflow-hidden'}`}>
                <div className="p-4 border-b border-slate-800">
                     <Link to={`/courses/${course.slug}`} className="text-lg font-bold text-white hover:text-blue-400">
                        &larr; Back to Course
                    </Link>
                </div>
                <div className="flex-grow overflow-y-auto">
                    {course.curriculum.map((section, sectionIndex) => (
                        <div key={sectionIndex} className="border-b border-slate-800">
                            <h3 className="p-4 font-semibold text-white bg-slate-800/50">{section.title}</h3>
                            <ul>
                                {section.lessons.map((lesson, lessonIndex) => (
                                    <li key={lessonIndex}>
                                        <button 
                                            onClick={() => {
                                                setCurrentSectionIndex(sectionIndex);
                                                setCurrentLessonIndex(lessonIndex);
                                            }}
                                            className={`w-full text-left p-4 text-sm flex items-center justify-between gap-3 transition-colors ${
                                                currentSectionIndex === sectionIndex && currentLessonIndex === lessonIndex
                                                    ? 'bg-blue-600/20 text-blue-300'
                                                    : 'hover:bg-slate-800'
                                            }`}
                                        >
                                             <div className="flex items-center gap-3">
                                                <BookOpenIcon className="h-5 w-5 flex-shrink-0 text-slate-500" />
                                                <span>{lesson.title}</span>
                                            </div>
                                            {isLessonCompleted(sectionIndex, lessonIndex) && (
                                                <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                                            )}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-y-auto">
                <header className="bg-brand-dark/80 backdrop-blur-sm sticky top-0 z-10 border-b border-slate-800 flex items-center justify-between p-4 gap-4">
                    <div className="flex-1 flex justify-start">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-md hover:bg-slate-800 transition-colors">
                            {isSidebarOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
                        </button>
                    </div>
                    <div className="flex-1 text-center">
                        <h1 className="text-lg font-semibold text-white truncate">{course.title}</h1>
                        <p className="text-sm text-slate-400">{currentLesson.title}</p>
                    </div>
                    <div className="flex-1 flex justify-end">
                        <button
                            onClick={handleDownloadPdf}
                            disabled={isDownloading}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm text-slate-300 border border-slate-700 rounded-full hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isDownloading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Generating...</span>
                                </>
                            ) : (
                                <>
                                    <DownloadIcon className="h-5 w-5" />
                                    <span>Download PDF</span>
                                </>
                            )}
                        </button>
                    </div>
                </header>

                <main className="flex-1 p-6 sm:p-8 lg:p-12">
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-8">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-slate-400 truncate">{course.title}</span>
                                <span className="text-sm font-medium text-blue-400">{completedLessons.size} / {totalLessons} Completed</span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-2.5">
                                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                            </div>
                        </div>

                        <article id="lesson-content" className="prose prose-invert prose-lg max-w-none prose-h3:text-blue-400 prose-a:text-blue-400 hover:prose-a:text-blue-300 prose-strong:text-slate-100 prose-ul:list-disc prose-li:marker:text-blue-400">
                            <h2 className="text-3xl font-bold text-white mb-6 !text-white">{currentLesson.title}</h2>
                            <div dangerouslySetInnerHTML={{ __html: parsedContent }} />
                        </article>

                         <div className="mt-12 pt-6 border-t border-slate-700 flex justify-between items-center">
                            <button
                                onClick={handlePrevLesson}
                                disabled={isFirstLesson}
                                className="inline-flex items-center gap-2 px-5 py-2.5 text-slate-300 border border-slate-700 rounded-full hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ArrowLeftIcon className="h-5 w-5" />
                                <span>Previous</span>
                            </button>
                            
                            <button
                                onClick={toggleCurrentLessonCompletion}
                                className={`inline-flex items-center gap-2 px-5 py-2.5 font-semibold border rounded-full transition-colors ${
                                    currentLessonCompleted
                                        ? 'bg-green-600/20 border-green-600/30 text-green-400'
                                        : 'text-slate-300 border-slate-700 hover:bg-slate-800'
                                }`}
                            >
                                {currentLessonCompleted ? (
                                    <>
                                        <CheckCircleIcon className="h-5 w-5" />
                                        <span>Completed</span>
                                    </>
                                ) : (
                                    <span>Mark as Complete</span>
                                )}
                            </button>

                             <button
                                onClick={handleNextLesson}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-sm disabled:bg-blue-800 disabled:cursor-not-allowed"
                            >
                                <span>{isLastLesson ? 'Finish Course' : 'Next Lesson'}</span>
                                <ArrowRightIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default StartLearning;
