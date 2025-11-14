import React from 'react';
import { 
    UsersIcon, 
    CalendarDaysIcon, 
    FireIcon, 
    SearchIcon, 
    PencilSquareIcon,
    ChatBubbleOvalLeftEllipsisIcon,
    ArrowUpIcon
} from './Icons';

const forumPosts = [
  {
    id: 1,
    author: {
      name: 'Rafi',
      avatar: 'https://picsum.photos/id/1027/100/100',
    },
    title: 'Struggling with React Hooks state management. Any advice?',
    excerpt: 'Hey everyone, I\'m working on a project and my component state is getting really messy with multiple useEffect and useState hooks. I\'m considering using useReducer or maybe a state management library like Zustand. What are your thoughts or best practices for complex local state?',
    tags: ['React', 'JavaScript', 'State Management'],
    upvotes: 128,
    comments: 42,
    time: '2 hours ago',
  },
  {
    id: 2,
    author: {
      name: 'Maya',
      avatar: 'https://picsum.photos/id/1011/100/100',
    },
    title: 'Showcase: My new UI/UX portfolio built with Figma and Next.js',
    excerpt: 'I just launched my new portfolio website! It was a great learning experience combining Figma for design and Next.js for the build. I focused on clean animations and a fast Lighthouse score. Would love to get some feedback from the community. Link inside!',
    tags: ['UI/UX', 'Figma', 'Next.js', 'Portfolio'],
    upvotes: 256,
    comments: 89,
    time: '8 hours ago',
  },
  {
    id: 3,
    author: {
        name: 'Hendra',
        avatar: 'https://picsum.photos/id/1025/100/100',
    },
    title: 'Career Advice: How to prepare for a technical interview for a Backend role?',
    excerpt: 'I have my first big technical interview for a Node.js backend position next week. What are some of the most common topics or questions I should be ready for? System design, algorithms, specific Node concepts? Any resources would be super helpful. Thanks!',
    tags: ['Career', 'Interview', 'Backend', 'Node.js'],
    upvotes: 95,
    comments: 61,
    time: '1 day ago',
  },
    {
    id: 4,
    author: {
        name: 'Chen',
        avatar: 'https://picsum.photos/id/1028/100/100',
    },
    title: 'Data Science: Best Python libraries for data visualization in 2024?',
    excerpt: 'I usually default to Matplotlib and Seaborn, but I\'m wondering what other modern libraries people are using for creating interactive and beautiful data visualizations. I\'ve heard of Plotly and Bokeh. What are the pros and cons?',
    tags: ['Data Science', 'Python', 'Visualization'],
    upvotes: 150,
    comments: 33,
    time: '2 days ago',
    },
];

const upcomingEvents = [
    { name: 'Live Q&A: React State Management', date: 'Oct 28, 2024', time: '7:00 PM EST' },
    { name: 'Webinar: Modern CSS Layouts', date: 'Nov 5, 2024', time: '5:00 PM PST' },
    { name: 'Workshop: Intro to Docker', date: 'Nov 12, 2024', time: '1:00 PM EST' },
];

const topContributors = [
    { name: 'Rafi', avatar: 'https://picsum.photos/id/1027/100/100', points: '1,250' },
    { name: 'Maya', avatar: 'https://picsum.photos/id/1011/100/100', points: '1,100' },
    { name: 'Jonas S.', avatar: 'https://randomuser.me/api/portraits/men/2.jpg', points: '980' },
    { name: 'Angela Y.', avatar: 'https://randomuser.me/api/portraits/women/3.jpg', points: '950' },
];

const popularTopics = ['React', 'Career Advice', 'JavaScript', 'UI/UX', 'Python', 'DevOps'];


const Community: React.FC = () => {
    return (
        <main className="py-16 sm:py-20 lg:py-24 bg-slate-900">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-white">Community Hub</h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-400">
                        Connect, learn, and grow with fellow developers and mentors.
                    </p>
                </div>
                
                <div className="flex justify-center mb-12">
                    <a href="#" className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 text-white font-semibold rounded-full shadow-md hover:bg-blue-700 transition-transform hover:scale-105 duration-300">
                        <PencilSquareIcon className="h-5 w-5" />
                        Start a New Discussion
                    </a>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Feed */}
                    <div className="lg:col-span-2 space-y-6">
                        {forumPosts.map(post => (
                             <a key={post.id} href="#" className="block bg-brand-dark p-6 border border-slate-800 rounded-2xl shadow-lg transition-all duration-300 hover:border-blue-500/50 hover:-translate-y-1">
                                <div className="flex items-start gap-4">
                                    <img src={post.author.avatar} alt={post.author.name} className="h-12 w-12 rounded-full flex-shrink-0" />
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h2 className="text-lg font-bold text-white mb-1">{post.title}</h2>
                                                <p className="text-sm text-slate-400">
                                                    Posted by <span className="font-semibold text-slate-300">{post.author.name}</span> &bull; {post.time}
                                                </p>
                                            </div>
                                            <div className="hidden sm:flex items-center gap-2 p-2 bg-slate-800/50 border border-slate-700 rounded-lg text-sm font-semibold">
                                                <ArrowUpIcon className="h-4 w-4 text-slate-400"/>
                                                <span>{post.upvotes}</span>
                                            </div>
                                        </div>
                                        <p className="mt-4 text-slate-300 text-sm leading-relaxed">{post.excerpt}</p>
                                        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                                            <div className="flex flex-wrap gap-2">
                                                {post.tags.map(tag => (
                                                    <span key={tag} className="bg-slate-800 text-blue-400 text-xs font-medium px-2.5 py-1 rounded-full">{tag}</span>
                                                ))}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-slate-400">
                                                <ChatBubbleOvalLeftEllipsisIcon className="h-5 w-5" />
                                                <span>{post.comments} comments</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-8">
                        {/* Upcoming Events */}
                        <div className="bg-brand-dark p-6 border border-slate-800 rounded-2xl shadow-lg">
                            <h3 className="flex items-center text-lg font-bold text-white mb-4">
                                <CalendarDaysIcon className="h-6 w-6 mr-3 text-blue-400" />
                                Upcoming Events
                            </h3>
                            <ul className="space-y-4">
                                {upcomingEvents.map(event => (
                                    <li key={event.name}>
                                        <a href="#" className="group">
                                            <p className="font-semibold text-slate-200 group-hover:text-blue-400 transition-colors">{event.name}</p>
                                            <p className="text-sm text-slate-400">{event.date} &bull; {event.time}</p>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        {/* Top Contributors */}
                        <div className="bg-brand-dark p-6 border border-slate-800 rounded-2xl shadow-lg">
                            <h3 className="flex items-center text-lg font-bold text-white mb-4">
                                <UsersIcon className="h-6 w-6 mr-3 text-blue-400" />
                                Top Contributors
                            </h3>
                            <ul className="space-y-4">
                                {topContributors.map(user => (
                                    <li key={user.name} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <img src={user.avatar} alt={user.name} className="h-10 w-10 rounded-full" />
                                            <span className="font-semibold text-slate-200">{user.name}</span>
                                        </div>
                                        <span className="text-sm font-bold text-yellow-400">{user.points} pts</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Popular Topics */}
                        <div className="bg-brand-dark p-6 border border-slate-800 rounded-2xl shadow-lg">
                            <h3 className="flex items-center text-lg font-bold text-white mb-4">
                                <FireIcon className="h-6 w-6 mr-3 text-blue-400" />
                                Popular Topics
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {popularTopics.map(topic => (
                                    <a key={topic} href="#" className="bg-slate-800 text-slate-300 text-sm font-medium px-3 py-1.5 rounded-full hover:bg-slate-700 hover:text-white transition-colors">
                                        #{topic}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
};

export default Community;