

import { 
    ArrowPathIcon,
    BeakerIcon,
    BriefcaseIcon,
    CalculatorIcon,
    ChartBarIcon,
    CircleStackIcon,
    CloudIcon,
    CodeBracketIcon,
    DesktopIcon,
    LockClosedIcon,
    MapIcon,
    MobileIcon,
    PaletteIcon,
    PresentationChartBarIcon,
    PuzzlePieceIcon,
    RectangleGroupIcon,
    ServerIcon,
    ShieldCheckIcon,
    UserGroupIcon
} from '../components/Icons';

export const roadmapsData = [
  {
    id: 'frontend-developer',
    title: 'Frontend Developer Roadmap',
    description: 'A comprehensive path to becoming a job-ready Frontend Developer, from foundational web technologies to advanced frameworks and tools that power modern, interactive web applications.',
    phases: [
      {
        title: 'Phase 1: Web Foundations',
        description: 'Master the core technologies of the web. This phase ensures you have a rock-solid understanding of how websites are built, styled, and made interactive before moving to dynamic applications.',
        topics: [
            { name: 'Semantic HTML', description: 'Learn to structure web pages for accessibility and SEO.', icon: CodeBracketIcon },
            { name: 'Modern CSS', description: 'Style beautiful websites with advanced selectors, properties, and layouts.', icon: PaletteIcon },
            { name: 'Responsive Design', description: 'Build layouts that work seamlessly across all screen sizes using Flexbox & Grid.', icon: DesktopIcon },
            { name: 'JavaScript Fundamentals', description: 'Grasp the core concepts of the web\'s programming language.', icon: CodeBracketIcon },
            { name: 'DOM Manipulation', description: 'Learn how to dynamically change website content with JavaScript.', icon: PuzzlePieceIcon },
        ],
        relatedCourseIds: [5]
      },
      {
        title: 'Phase 2: Mastering a JavaScript Framework',
        description: 'Dive deep into React, the most popular library for building modern, component-based user interfaces. You\'ll learn to manage state, handle user events, and build complex, scalable applications.',
        topics: [
            { name: 'React & JSX', description: 'Understand the component-based architecture and syntax of React.', icon: CodeBracketIcon },
            { name: 'Components, Props & State', description: 'Master the flow of data and state management within a React application.', icon: PuzzlePieceIcon },
            { name: 'React Hooks', description: 'Use functional components to their full potential with hooks like useState and useEffect.', icon: CodeBracketIcon },
            { name: 'State Management', description: 'Learn advanced state management with tools like Redux for large-scale apps.', icon: ArrowPathIcon },
            { name: 'API Integration', description: 'Fetch and display data from backend services to create dynamic applications.', icon: ServerIcon },
        ],
        relatedCourseIds: [1]
      },
      {
        title: 'Phase 3: Advanced Frontend & DevOps',
        description: 'Go beyond the basics to become a top-tier developer. Learn about performance, type safety, testing, and how to deploy your applications to the world.',
        topics: [
            { name: 'TypeScript', description: 'Add static typing to JavaScript to build more robust and scalable applications.', icon: ShieldCheckIcon },
            { name: 'Testing', description: 'Write unit and integration tests with Jest & React Testing Library.', icon: BeakerIcon },
            { name: 'Build Tools', description: 'Understand modern build tools like Vite and Webpack for optimizing assets.', icon: CodeBracketIcon },
            { name: 'CI/CD Pipelines', description: 'Automate your testing and deployment process for faster release cycles.', icon: ArrowPathIcon },
            { name: 'Containerization', description: 'Package your frontend applications with Docker for consistent environments.', icon: CodeBracketIcon },
        ],
        relatedCourseIds: [6]
      }
    ]
  },
  {
    id: 'backend-developer',
    title: 'Backend Developer Roadmap',
    description: 'Learn to build scalable, robust, and secure server-side applications, manage complex databases, and deploy services that power the internet.',
    phases: [
      {
        title: 'Phase 1: Choose a Language & Framework',
        description: 'The first step is to master a server-side language and its primary web framework. This forms the backbone of all your backend development, from APIs to application logic.',
        topics: [
            { name: 'Node.js & Express', description: 'Build fast, scalable network applications with JavaScript on the server.', icon: CodeBracketIcon },
            { name: 'Python & Django/Flask', description: 'Use Python for rapid development and clean, pragmatic design.', icon: CodeBracketIcon },
            { name: 'Go (Golang)', description: 'Learn Go for its high performance and built-in concurrency.', icon: CodeBracketIcon },
            { name: 'RESTful API Principles', description: 'Design and build clean, predictable, and scalable APIs.', icon: ServerIcon },
        ],
        relatedCourseIds: [2, 3, 7]
      },
      {
        title: 'Phase 2: Databases & Data Management',
        description: 'Learn how to store, retrieve, and manage data efficiently. Understanding both SQL and NoSQL databases is essential for any modern backend developer.',
        topics: [
            { name: 'Relational Databases', description: 'Master SQL with databases like MySQL or PostgreSQL.', icon: CircleStackIcon },
            { name: 'NoSQL Databases', description: 'Explore flexible data models with databases like MongoDB.', icon: CircleStackIcon },
            { name: 'Data Modeling', description: 'Design efficient and scalable database schemas for your applications.', icon: PuzzlePieceIcon },
            { name: 'ORM/ODM', description: 'Interact with your database using Object-Relational or Object-Document Mappers.', icon: CodeBracketIcon },
        ],
        relatedCourseIds: [8, 2]
      },
      {
        title: 'Phase 3: Authentication, Security & DevOps',
        description: 'Secure your applications and learn how to deploy and manage them in a production environment. This phase covers critical concepts for building professional-grade software.',
        topics: [
            { name: 'Authentication', description: 'Implement secure user authentication using JWT, OAuth, and sessions.', icon: LockClosedIcon },
            { name: 'Security Best Practices', description: 'Protect your applications from common vulnerabilities like XSS and CSRF.', icon: ShieldCheckIcon },
            { name: 'Containerization (Docker)', description: 'Package your backend services into containers for easy deployment.', icon: CodeBracketIcon },
            { name: 'Orchestration (Kubernetes)', description: 'Automate the deployment, scaling, and management of your services.', icon: ArrowPathIcon },
            { name: 'Cloud Deployment', description: 'Learn to deploy your applications on cloud platforms like AWS or Vercel.', icon: CloudIcon },
        ],
        relatedCourseIds: [6]
      }
    ]
  },
  {
    id: 'data-analyst',
    title: 'Data Analyst Roadmap',
    description: 'A step-by-step guide to becoming a data analyst. Learn to collect, clean, analyze, and visualize data to uncover actionable insights and drive business decisions.',
    phases: [
      {
        title: 'Phase 1: Foundational Skills',
        description: 'Build a strong foundation in the core tools of data analysis. Mastering SQL for data retrieval and a programming language like Python for data manipulation is non-negotiable.',
        topics: [
            { name: 'Advanced SQL', description: 'Go beyond basic queries to master window functions, CTEs, and complex joins.', icon: CircleStackIcon },
            { name: 'Database Design', description: 'Understand how to structure and manage relational databases effectively.', icon: PuzzlePieceIcon },
            { name: 'Python Programming', description: 'Learn the fundamentals of Python, the go-to language for data analysis.', icon: CodeBracketIcon },
            { name: 'Statistics Fundamentals', description: 'Grasp key statistical concepts like probability, regression, and hypothesis testing.', icon: CalculatorIcon },
        ],
        relatedCourseIds: [8, 3]
      },
      {
        title: 'Phase 2: Data Analysis & Visualization',
        description: 'Learn to use powerful Python libraries to clean, transform, analyze, and visualize data. This is where you turn raw numbers into compelling stories and insights.',
        topics: [
            { name: 'Data Wrangling with Pandas', description: 'Clean, transform, and analyze structured data with this essential library.', icon: CodeBracketIcon },
            { name: 'Numerical Computing with NumPy', description: 'Perform efficient numerical operations on large datasets.', icon: CodeBracketIcon },
            { name: 'Data Visualization', description: 'Create insightful charts and graphs with Matplotlib and Seaborn.', icon: ChartBarIcon },
            { name: 'Storytelling with Data', description: 'Learn how to present your findings in a clear, compelling narrative.', icon: PresentationChartBarIcon },
        ],
        relatedCourseIds: [3]
      },
      {
        title: 'Phase 3: Business Intelligence & Advanced Topics',
        description: 'Move beyond basic analysis. Learn to use BI tools to create interactive dashboards and explore more advanced analytical techniques to provide deeper business value.',
        topics: [
            { name: 'BI Tools', description: 'Master tools like Tableau or Power BI to create interactive dashboards.', icon: PresentationChartBarIcon },
            { name: 'A/B Testing', description: 'Design and analyze experiments to make data-driven decisions.', icon: BeakerIcon },
            { name: 'Machine Learning Concepts', description: 'Get an introduction to predictive modeling and machine learning algorithms.', icon: CodeBracketIcon },
            { name: 'Domain Knowledge', description: 'Understand the specific business context to ask the right questions and find relevant insights.', icon: BriefcaseIcon },
        ],
        relatedCourseIds: []
      }
    ]
  },
  {
    id: 'ui-ux-designer',
    title: 'UI/UX Designer Roadmap',
    description: 'From foundational design principles to advanced prototyping and user testing, this roadmap will guide you on your journey to becoming a professional UI/UX designer who creates intuitive and beautiful digital products.',
    phases: [
      {
        title: 'Phase 1: UX Design Foundations',
        description: 'Understand the "why" behind design. This phase focuses on user-centric principles, research methodologies, and how to create logical and intuitive user experiences before any visual design begins.',
        topics: [
            { name: 'Design Principles', description: 'Learn core concepts like heuristics, Gestalt principles, and user-centered design.', icon: PuzzlePieceIcon },
            { name: 'User Research & Personas', description: 'Understand your users\' needs, behaviors, and motivations through research.', icon: UserGroupIcon },
            { name: 'Journey Mapping', description: 'Visualize the user experience to identify pain points and opportunities.', icon: MapIcon },
            { name: 'Wireframing', description: 'Create low-fidelity blueprints of your product to focus on structure and flow.', icon: RectangleGroupIcon },
        ],
        relatedCourseIds: [4]
      },
      {
        title: 'Phase 2: UI Design & Tool Mastery',
        description: 'Learn the "how" of design. Master Figma, the industry-standard tool, and learn to create visually stunning, consistent, and accessible user interfaces that bring the UX vision to life.',
        topics: [
            { name: 'Mastering Figma', description: 'Become proficient with the leading tool for interface design and prototyping.', icon: CodeBracketIcon },
            { name: 'Visual Design', description: 'Learn the fundamentals of typography, color theory, and layout.', icon: PaletteIcon },
            { name: 'Design Systems', description: 'Create and maintain a library of reusable components and styles for consistency.', icon: CodeBracketIcon },
            { name: 'Accessibility (A11y)', description: 'Design products that are usable by people with disabilities.', icon: UserGroupIcon },
        ],
        relatedCourseIds: [4]
      },
      {
        title: 'Phase 3: Prototyping, Testing & Handoff',
        description: 'Bring your designs to life and validate them with real users. Learn how to create interactive prototypes, conduct usability tests, and collaborate effectively with developers to ensure a high-quality final product.',
        topics: [
            { name: 'High-Fidelity Prototyping', description: 'Build realistic, interactive mockups of your application.', icon: MobileIcon },
            { name: 'Microinteractions', description: 'Design subtle animations and feedback to enhance the user experience.', icon: PuzzlePieceIcon },
            { name: 'Usability Testing', description: 'Validate your design decisions by observing real users.', icon: BeakerIcon },
            { name: 'Developer Handoff', description: 'Learn how to effectively communicate your designs to the engineering team.', icon: CodeBracketIcon },
        ],
        relatedCourseIds: [4]
      }
    ]
  }
];
