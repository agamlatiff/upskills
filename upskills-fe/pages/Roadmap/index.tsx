import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { roadmapsData } from '../../data/roadmaps';
import { MapIcon } from '../../components/Icons';

const Roadmap: React.FC = () => {
    const { roadmapId } = useParams<{ roadmapId: string }>();
    const roadmap = roadmapsData.find(r => r.id === roadmapId);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [roadmapId]);

    if (!roadmap) {
        return (
            <main className="flex items-center justify-center h-screen bg-slate-900">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">Roadmap Not Found</h1>
                    <p className="text-slate-400 mb-8">We couldn't find the roadmap you were looking for.</p>
                    <Link to="/" className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors">
                        Back to Home
                    </Link>
                </div>
            </main>
        );
    }
    

    return (
        <main className="bg-slate-900">
            {/* Header */}
            <section className="py-16 sm:py-20 lg:py-24 bg-brand-dark border-b border-slate-800">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <MapIcon className="h-16 w-16 mx-auto text-blue-500 mb-6" />
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-white">{roadmap.title}</h1>
                        <p className="mt-4 max-w-3xl mx-auto text-lg text-slate-400">
                            {roadmap.description}
                        </p>
                        <div className="mt-8 flex justify-center items-center space-x-6 text-sm font-medium text-slate-300">
                            <span>{roadmap.phases.length} Phases</span>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Timeline */}
            <section className="py-16 sm:py-20 lg:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative max-w-5xl mx-auto">
                        {/* Vertical line */}
                        <div className="absolute left-6 sm:left-1/2 top-0 h-full w-0.5 bg-slate-700 -translate-x-1/2"></div>
                        
                        <div className="space-y-16">
                            {roadmap.phases.map((phase, index) => (
                                <div key={index} className="relative flex items-start sm:gap-12">
                                    {/* Icon */}
                                    <div className="flex-shrink-0 w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center absolute left-6 sm:left-1/2 -translate-x-1/2 border-4 border-slate-900 z-10 font-bold text-blue-400 text-lg">
                                        0{index + 1}
                                    </div>
                                    
                                    {/* Content Card */}
                                    <div className={`bg-brand-dark border border-slate-800 rounded-2xl shadow-lg p-6 sm:p-8 w-full ml-20 sm:w-[calc(50%-3rem)]
                                        ${index % 2 === 0 ? 'sm:ml-auto sm:mr-0' : 'sm:mr-auto sm:ml-0'}`}>
                                        
                                        <h2 className="text-sm font-semibold text-blue-400 tracking-wider uppercase mb-3">Phase {index + 1}</h2>
                                        <h3 className="text-2xl font-bold text-white mb-3">{phase.title}</h3>
                                        <p className="text-slate-400 mb-6">{phase.description}</p>
                                        
                                        <h4 className="text-lg font-semibold text-white mb-4">Key Topics</h4>
                                        <ul className="space-y-4 mb-6">
                                            {phase.topics.map(topic => (
                                                <li key={topic.name} className="flex items-start gap-4">
                                                    <div className="flex-shrink-0 bg-slate-800/50 text-blue-400 rounded-md h-8 w-8 flex items-center justify-center mt-1">
                                                        <topic.icon className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-slate-200">{topic.name}</p>
                                                        <p className="text-sm text-slate-400">{topic.description}</p>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Roadmap;