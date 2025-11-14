
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layout & shared components
import Header from './components/Header';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';

// Pages
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import StartLearning from './pages/StartLearning';
import CourseDetail from './pages/CourseDetail';
import Courses from './pages/Courses';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import Testimonials from './pages/Testimonials';
import Roadmap from './pages/Roadmap';
import Checkout from './pages/Checkout';
import Wishlist from './pages/Wishlist';
import CourseComplete from './pages/CourseComplete';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-brand-dark text-slate-300 font-sans">
      <Header />
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/courses/:courseSlug/learn" element={<StartLearning />} />
        <Route path="/courses/:courseSlug/completed" element={<CourseComplete />} />
        <Route path="/courses/:courseSlug" element={<CourseDetail />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/features" element={<Features />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/roadmaps/:roadmapId" element={<Roadmap />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/:section" element={<Home />} />
        <Route path="/" element={<Home />} />
      </Routes>
      <Footer />
      <Chatbot />
    </div>
  );
};

export default App;
