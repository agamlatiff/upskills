import React from 'react';

// For Courses
export interface Instructor {
    name: string;
    avatar: string;
}

export interface CurriculumLesson {
    title: string;
    content: string;
}

export interface CurriculumSection {
    title: string;
    lessons: CurriculumLesson[];
}

export interface Review {
    name: string;
    rating: number;
    comment: string;
}

export interface Course {
    id: number;
    slug: string;
    title: string;
    shortDescription: string;
    longDescription: string;
    category: 'Frontend' | 'Backend' | 'Data Science' | 'UI/UX Design' | 'DevOps';
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
    duration: string;
    image: string;
    popular: boolean;
    isFree: boolean;
    rating: number;
    students: number;
    instructor: Instructor;
    whatYouWillLearn: string[];
    requirements: string[];
    curriculum: CurriculumSection[];
    reviews: Review[];
}


// For Roadmaps
export interface RoadmapTopic {
    name: string;
    description: string;
    icon: React.FC<{ className?: string }>;
}

export interface RoadmapPhase {
    title: string;
    description: string;
    topics: RoadmapTopic[];
    relatedCourseIds: number[];
}

export interface Roadmap {
    id: string;
    title: string;
    description: string;
    phases: RoadmapPhase[];
}
