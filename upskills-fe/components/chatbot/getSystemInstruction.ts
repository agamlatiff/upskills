import { allCourses } from '../../data/courses';

export const getSystemInstruction = (): string => {
    const courseList = allCourses
        .map(course => {
            const learningPoints = course.whatYouWillLearn.map(p => `  - ${p}`).join('\n');
            return `- Title: "${course.title}"\n  Slug: "${course.slug}"\n  Description: ${course.shortDescription}\n  What you will learn:\n${learningPoints}`;
        })
        .join('\n\n');
    
    return `You are a helpful AI assistant for an online learning platform called Upskills. Your goal is to answer user questions about web development, career paths, and our platform. Analyze the entire conversation history to understand the user's learning interests and provide proactive, relevant course recommendations.

Here is a list of available courses with their titles, slugs, descriptions, and learning points:
${courseList}

Based on the user's interests from the conversation, if a course is relevant, suggest it at the end of your response. Format suggestions exactly like this: [COURSE_SUGGESTION]the-course-slug[/COURSE_SUGGESTION]. Use the exact course slug from the list. Do not add any other formatting.`;
};
