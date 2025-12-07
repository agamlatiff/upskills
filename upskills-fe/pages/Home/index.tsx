import React, { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';

import Hero from '../../components/Hero';
import LearningPaths from '../../components/LearningPaths';
import RealProjectsShowcase from '../../components/RealProjectsShowcase';
import CareerSupport from '../../components/CareerSupport';
import CTA from '../../components/CTA';
import { useSEO } from '../../hooks/useSEO';

const Home: React.FC = () => {
  const { section } = useParams<{ section: string }>();
  const location = useLocation();

  // SEO for Home page
  useSEO({
    title: undefined, // Use default title
    description: 'Platform belajar programming online terbaik di Indonesia. Pelajari React, Node.js, Python, UI/UX Design dengan mentor ahli. Bangun portfolio dan raih karir impianmu!',
    keywords: 'belajar programming, kursus online, react, node.js, python, ui/ux design, web development, coding bootcamp',
    canonical: 'https://upskill.id/',
  });

  useEffect(() => {
    if (section) {
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView();
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [section, location.pathname]);

  return (
    <main>
      <Hero />
      <LearningPaths />
      <RealProjectsShowcase />
      <CareerSupport />
      <CTA />
    </main>
  );
};

export default Home;