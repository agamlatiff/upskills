import React, { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';

import Hero from '../../components/Hero';
import LearningPaths from '../../components/LearningPaths';
import RealProjectsShowcase from '../../components/RealProjectsShowcase';
import CareerSupport from '../../components/CareerSupport';
import CTA from '../../components/CTA';

const Home: React.FC = () => {
  const { section } = useParams<{ section: string }>();
  const location = useLocation();

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