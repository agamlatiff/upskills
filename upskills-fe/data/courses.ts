import { slugify } from '../utils/slugify';
import type { Course } from '../types';

const coursesData: Omit<Course, 'slug'>[] = [
  {
    id: 1,
    title: 'React - The Complete Guide (incl Hooks, React Router, Redux)',
    shortDescription: 'Dive in and learn React.js from scratch!',
    longDescription: 'Dive in and learn React.js from scratch! Learn Reactjs, Hooks, Redux, React Routing, Animations, Next.js and way more! This course is the most up-to-date and in-depth React course you can find. It was updated to React 18 in 2024 and features all the latest features and best practices.',
    category: 'Frontend',
    difficulty: 'Beginner',
    duration: '12 lectures',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1400&auto=format&fit=crop',
    popular: true,
    isFree: false,
    rating: 4.6,
    students: 843281,
    instructor: {
        name: 'Maximilian Schwarzmüller',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
    },
    whatYouWillLearn: [
        'Build powerful, fast, user-friendly and reactive web apps',
        'Provide amazing user experiences by leveraging the power of JavaScript with ease',
        'Apply for high-paid jobs or work as a freelancer in one the most-demanded sectors in web development',
        'Learn all about React Hooks and React Components'
    ],
    requirements: [
        'JavaScript + HTML + CSS fundamentals are absolutely required',
        'You DON\'T need to be a JavaScript expert to succeed in this course',
        'ES6+ JavaScript knowledge is beneficial but not a must-have',
        'NO prior React or any other JS framework experience is required!'
    ],
    curriculum: [
        {
            title: 'Getting Started',
            lessons: [
                { title: 'Introduction', content: '### Welcome to the Course!\n\nThis course is your complete guide to mastering React.js. We will start from the absolute basics and gradually move towards advanced topics, ensuring you have a solid foundation at every step.\n\nIn this initial module, we will achieve three key things:\n1.  **Understand the "Why":** We\'ll get a high-level overview of what React is, why it was created, and the problems it solves in modern web development. We\'ll compare it briefly to other paradigms like server-side rendering and other JavaScript frameworks.\n2.  **Set Up Our Environment:** We\'ll ensure you have all the necessary tools installed, including `Node.js`, `npm`, and a code editor like `Visual Studio Code`.\n3.  **Create Our First App:** By the end of this module, you\'ll have a new React application running locally on your machine, ready for you to start building.\n\nLet\'s begin your journey to becoming a React developer!' },
                { 
                    title: 'What is React?', 
                    content: '### Understanding React: The Core Principles\n\nReact is a declarative, efficient, and flexible JavaScript library for building user interfaces. It lets you compose complex UIs from small and isolated pieces of code called **components**.\n\nReact has a few key principles that make it so powerful:\n\n- **Component-Based Architecture:** Instead of building a large, monolithic application, you break down your UI into smaller, reusable components. Each component manages its own state and logic, making your code easier to manage, test, and scale. Think of it like building with LEGO bricks; each brick (component) is simple, but you can combine them to build complex structures (your application).\n\n- **Declarative Views:** With React, you simply tell it *what* you want the UI to look like for a given state, and React takes care of updating the DOM to match that state. This is a contrast to *imperative* programming (like with vanilla JavaScript or jQuery), where you manually find and manipulate the DOM elements step-by-step. The declarative approach makes your code more predictable and easier to debug.\n\n- **Virtual DOM:** React keeps a lightweight representation of the real DOM in memory, called the Virtual DOM. When a component\'s state changes, React first updates the Virtual DOM, then compares it with the previous version to identify the minimal changes needed. Finally, it updates only those specific parts of the real DOM. This "diffing" algorithm makes React applications incredibly fast and efficient because it avoids unnecessary and costly manipulations of the actual browser DOM.\n\nHere\'s a simple React component example written with JSX:\n```javascript\n// This is a functional component called Welcome.\n// It accepts an object of properties, called "props".\nfunction Welcome(props) {\n  // It returns a React element that describes what should appear on the screen.\n  return <h1>Hello, {props.name}</h1>;\n}\n\n// You can then use this component in your app like this:\nconst element = <Welcome name="Sara" />;\n```\nThis code looks like HTML, but it\'s actually JSX, which we\'ll explore next. The key takeaway is that React allows you to build your UI with a clear, component-driven structure, making your applications more predictable and easier to debug.' 
                },
                { title: 'Setting up the development environment', content: '### Your Development Setup\n\nTo create a modern React application, you need a few tools installed on your computer. The most common and officially recommended way to start a new React project is by using a toolchain that handles complex configurations for you.\n\n**1. Install Node.js and npm:**\nReact development relies on Node.js as a runtime and npm (Node Package Manager) to manage project dependencies. If you don\'t have them installed, download the LTS (Long Term Support) version from the official [Node.js website](https://nodejs.org/). Npm is included with the Node.js installation.\n\n**2. Use a modern code editor:**\nWe recommend using `Visual Studio Code` (VS Code) as it has excellent support for JavaScript and React, with many helpful extensions like "ES7+ React/Redux/React-Native snippets".\n\n**3. Create Your First React App:**\nThe recommended way to create a new single-page React application is by using a framework like `Next.js` or `Remix`, or a bundler-based toolchain like `Vite`.\n\nFor this course, we will use **Vite** because it provides an extremely fast development experience.\n\nTo create a new project with Vite, run the following command in your terminal:\n```bash\n# This command will scaffold a new project.\nnpm create vite@latest my-react-app -- --template react\n\n# Navigate into your new project directory\ncd my-react-app\n\n# Install the necessary dependencies\nnpm install\n\n# Start the development server\nnpm run dev\n```\nAfter running `npm run dev`, Vite will start a development server, and you can view your new React application by opening the provided URL (usually `http://localhost:5173`) in your web browser. This setup includes everything you need: a dev server, code bundling, and hot module replacement for a smooth workflow.' }
            ]
        },
        {
            title: 'React Basics & Working with Components',
            lessons: [
                { title: 'Components & Core Syntax', content: '### The Building Blocks of React\n\nComponents are the heart of React. They are independent, reusable pieces of code that describe a part of the user interface. A component can be as simple as a button or as complex as an entire page. There are two main types of components in React:\n\n**1. Functional Components:**\nThese are modern React components written as simple JavaScript functions. They accept `props` as an argument and return a React element. With the introduction of Hooks, functional components can now manage state and side effects, making them the standard way to write components today.\n```javascript\nimport React from \'react\';\n\n// A simple functional component\nfunction Greeting(props) {\n  return <h1>Hello, {props.name}!</h1>;\n}\n\nexport default Greeting;\n```\n\n**2. Class Components:**\nThese are older ES6 classes that extend from `React.Component`. They use a `render()` method to return JSX and manage state with `this.state`. While still supported, they are less common in new codebases and we will focus on functional components.\n```javascript\nimport React from \'react\';\n\nclass Welcome extends React.Component {\n  render() {\n    return <h1>Hello, {this.props.name}!</h1>;\n  }\n}\n\nexport default Welcome;\n```\nBy breaking our UI into components, we can think about each part in isolation, making development more manageable and code more reusable.' },
                { 
                    title: 'JSX Deep Dive', 
                    content: '### Understanding JavaScript XML (JSX)\n\nJSX is a syntax extension for JavaScript that lets you write HTML-like markup inside a JavaScript file. While you can write React without JSX, most developers find it helpful as a visual aid when working with UI inside the JavaScript code.\n\n#### Key JSX Rules\n\n1.  **Return a Single Root Element:** A component must return a single JSX tag. If you need to return multiple elements, you must wrap them in a parent tag, like a `<div>`, or use a React Fragment (`<>...</>`), which doesn\'t add an extra node to the DOM.\n\n2.  **Close All Tags:** JSX tags must be explicitly closed. Self-closing tags in HTML like `<br>` or `<img>` must become `<br />` or `<img />` in JSX.\n\n3.  **Use camelCase for Most Attributes:** Most HTML attributes are written in camelCase in JSX. For example, the `class` attribute becomes `className` and `for` becomes `htmlFor`. This is because `class` and `for` are reserved keywords in JavaScript.\n\n#### Embedding JavaScript Expressions\n\nYou can embed any valid JavaScript expression within JSX by wrapping it in curly braces `{}`.\n```javascript\nfunction UserProfile(props) {\n  const user = props.user;\n  return (\n    <div className="profile">\n      <h2>{user.name.toUpperCase()}</h2>\n      <img src={user.avatarUrl} alt={"Photo of " + user.name} />\n    </div>\n  );\n}\n```\n\n#### Conditional Rendering in JSX\n\nYou can\'t use standard `if/else` statements inside JSX, but you can use conditional expressions.\n- **Ternary Operator:** `condition ? <ComponentA /> : <ComponentB />`\n- **Logical `&&` Operator:** `condition && <ComponentA />` (Renders `<ComponentA />` only if `condition` is true).\n\n```javascript\nfunction LoginStatus(props) {\n  const isLoggedIn = props.isLoggedIn;\n  return (\n    <div>\n      {isLoggedIn ? (\n        <p>Welcome back!</p>\n      ) : (\n        <p>Please sign in.</p>\n      )}\n      {isLoggedIn && <button>Logout</button>}\n    </div>\n  );\n}\n```' 
                },
                { 
                    title: 'Props & State Management', 
                    content: '### Managing Data: Props and State\n\nIn React, data flows through your application in two main ways: through *props* and through *state*. Understanding the difference is fundamental.\n\n#### What are Props?\n\n*Props* (short for properties) are how you pass data from a parent component down to a child component. Props are **read-only**. A child component should never modify the props it receives. This principle is called "one-way data flow" and it makes your application easier to debug.\n\n*Example of passing props:*\n```javascript\n// Parent Component\nfunction App() {\n  return <Greeting name="Alice" role="Developer" />;\n}\n\n// Child Component\nfunction Greeting(props) {\n  // props is an object: { name: "Alice", role: "Developer" }\n  return <h1>Hello, {props.name} the {props.role}!</h1>;\n}\n```\n\n#### What is State?\n\n*State* is data that is managed *within* a component. Unlike props, state is private to the component and can change over time in response to user actions. When a component\'s state changes, React will automatically re-render the component and its children to reflect the new state. This re-rendering is the core of React\'s reactivity.\n\nWe use the `useState` Hook to add state to functional components.\n\n*Example of using state:*\n```javascript\nimport React, { useState } from \'react\';\n\nfunction Counter() {\n  // useState(0) initializes our state with the value 0.\n  // It returns the current state value (`count`) and a function to update it (`setCount`).\n  const [count, setCount] = useState(0);\n\n  function handleClick() {\n    setCount(count + 1);\n  }\n\n  return (\n    <div>\n      <p>You clicked {count} times</p>\n      <button onClick={handleClick}>Click me</button>\n    </div>\n  );\n}\n```\n**Key takeaway:** use *props* for data that is passed down from a parent, and use *state* for data that is managed and changed *by the component itself*.' 
                }
            ]
        },
        {
            title: 'Advanced React Concepts',
            lessons: [
                { 
                    title: 'React Hooks in-depth', 
                    content: '### The Power of Hooks\n\nHooks let you use state and other React features without writing a class. We\'ve already seen `useState`. Let\'s explore other essential hooks.\n\n#### `useEffect`: The Effect Hook\nThe `useEffect` Hook lets you perform side effects in function components. Common side effects are data fetching, setting up subscriptions, and manually changing the DOM.\n\n*Example of fetching data with `useEffect`:*\n```javascript\nimport React, { useState, useEffect } from \'react\';\n\nfunction UserData({ userId }) {\n  const [user, setUser] = useState(null);\n\n  useEffect(() => {\n    fetch(`https://api.example.com/users/${userId}`)\n      .then(response => response.json())\n      .then(data => setUser(data));\n\n    // The second argument to useEffect is the dependency array.\n    // By passing [userId], we tell React to only re-run this effect\n    // if the userId prop changes.\n  }, [userId]);\n\n  if (!user) return <p>Loading...</p>;\n\n  return <h2>{user.name}</h2>;\n}\n```\n\n#### `useContext`: Avoiding Prop Drilling\nSometimes you need to pass data through many levels of components. This is called "prop drilling". `useContext` lets you share values between components without having to explicitly pass a prop through every level of the tree.\n\n#### `useRef`: Escaping the Render Cycle\nA `useRef` Hook is a mutable object whose `.current` property can be changed without triggering a re-render. It\'s useful for two main things:\n1. Accessing a DOM element directly (e.g., to focus an input).\n2. Storing a mutable value that does not need to cause a re-render when it changes (like a timer ID).\n\n#### `useCallback` and `useMemo`: Performance Optimization\n- `useCallback` returns a memoized version of a callback function that only changes if one of its dependencies has changed. This is useful when passing callbacks to optimized child components.\n- `useMemo` returns a memoized value. It will only recompute the memoized value when one of the dependencies has changed. This is useful for expensive calculations.' 
                },
                { title: 'Working with Redux', content: '### Global State Management with Redux\n\nFor larger applications, managing state that needs to be shared across many components can become complex. This is where Redux comes in. Redux provides a predictable state container for your entire JavaScript application. \n\nWe will learn the modern approach using **Redux Toolkit**, which simplifies Redux development significantly. Key concepts include:\n- **Store:** A single source of truth for your application state.\n- **Slices:** A way to organize your Redux logic for a specific feature. A slice contains the reducer logic and the actions for a single piece of state.\n- **`useSelector`:** A hook to read data from the store.\n- **`useDispatch`:** A hook to dispatch actions to update the store.' },
                { title: 'Building Custom Hooks', content: '### Creating Reusable Logic\n\nCustom Hooks are a powerful feature that allows you to extract component logic into reusable functions. A custom Hook is simply a JavaScript function whose name starts with "use" and that can call other Hooks.\n\nLet\'s build a `useLocalStorage` hook to persist state in the browser.\n\n```javascript\nimport { useState, useEffect } from \'react\';\n\nfunction useLocalStorage(key, initialValue) {\n  const [value, setValue] = useState(() => {\n    const storedValue = window.localStorage.getItem(key);\n    return storedValue !== null ? JSON.parse(storedValue) : initialValue;\n  });\n\n  useEffect(() => {\n    window.localStorage.setItem(key, JSON.stringify(value));\n  }, [key, value]);\n\n  return [value, setValue];\n}\n\n// Then, in your component:\nfunction MyComponent() {\n  const [name, setName] = useLocalStorage(\'name\', \'Guest\');\n  // ...\n}\n```\nThis keeps your component code clean and your logic reusable and testable.' }
            ]
        },
        {
            title: 'Building a Real-World Project',
            lessons: [
                { title: 'Project Planning', content: '### From Idea to Plan\n\nBefore writing any code, it’s crucial to plan our application. We will be building a small e-commerce front-end. We will define the features (product list, product detail, shopping cart), sketch out the component hierarchy (`<ProductList>`, `<ProductCard>`, `<Cart>`), and decide on our data structure. A good plan will save you hours of refactoring later.' },
                { title: 'Implementing Features', content: '### Bringing it to Life\n\nIn this section, we will start building our project. We will tackle common challenges like client-side routing with `React Router` to create different pages, fetching product data from a mock API, and managing global shopping cart state (perhaps with `useContext` or Redux), and creating responsive UI components. We will put all our knowledge of components, props, state, and hooks into practice.' },
                { title: 'Deployment', content: '### Sharing Your App with the World\n\nThe final step is to deploy our application. We will cover how to create a production build of our React app and deploy it to a modern hosting platform like `Netlify` or `Vercel`. We will also discuss how to handle environment variables for things like API keys, ensuring that sensitive information is not exposed in our code.' }
            ]
        }
    ],
    reviews: [
        {
            name: 'Alice',
            rating: 5,
            comment: 'This is the best React course out there. Max is a fantastic instructor.'
        },
        {
            name: 'Bob',
            rating: 4,
            comment: 'Very comprehensive, but can be a bit fast-paced at times.'
        }
    ]
  },
  {
    id: 2,
    title: 'Node.js, Express, MongoDB & More: The Complete Bootcamp 2024',
    shortDescription: 'Master Node.js by building a real-world RESTful API.',
    longDescription: 'Master Node.js by building a real-world RESTful API and web app (with authentication, Node.js security, payments & more). This course is designed for developers who want to build scalable and robust backend systems.',
    category: 'Backend',
    difficulty: 'Intermediate',
    duration: '6 lectures',
    image: 'https://images.unsplash.com/photo-1565034946487-077786996e27?q=80&w=1400&auto=format&fit=crop',
    popular: true,
    isFree: false,
    rating: 4.8,
    students: 254123,
    instructor: {
        name: 'Jonas Schmedtmann',
        avatar: 'https://randomuser.me/api/portraits/men/2.jpg'
    },
    whatYouWillLearn: [
        'Master the entire modern back-end stack: Node, Express, MongoDB and Mongoose.',
        'Build a complete, beautiful and real-world application from scratch (API and server-side rendered website).',
        'Learn how to work with payments, file uploads, and authentication.',
        'Understand how to deploy your applications to production.'
    ],
    requirements: ['Basic understanding of JavaScript (variables, functions, objects, arrays).'],
    curriculum: [
        {
            title: 'Introduction to Node.js',
            lessons: [
                { title: 'What is Node.js?', content: '### Understanding Node.js\n\nNode.js is not a programming language or a framework; it\'s a **JavaScript runtime environment**. It allows you to run JavaScript code on the server, outside of a web browser. It is built on Google Chrome\'s V8 JavaScript engine.\n\nKey features of Node.js include:\n- **Asynchronous and Event-Driven:** Most APIs in Node.js are asynchronous (non-blocking). This means a Node.js server never waits for an API to return data. After calling an API, the server moves to the next one, and a notification mechanism (the Event Loop) returns the response from the first API call when it\'s ready. This allows Node.js to handle a huge number of concurrent connections with high throughput.\n- **Single-Threaded:** Node.js operates on a single thread, using the event loop to handle concurrency. This simplifies programming as you don\'t have to worry about thread safety issues, but it also means that CPU-intensive operations can block the main thread and should be handled carefully.' },
                { title: 'Node.js Internals', content: '### How Node.js Works Under the Hood\n\nTo truly master Node.js, it\'s important to understand its core components.\n- **The Event Loop:** This is the heart of Node.js. It\'s a loop that picks up events from a queue and pushes their callbacks to the call stack to be executed. It allows Node.js to perform non-blocking I/O operations by offloading operations to the system kernel whenever possible.\n- **Libuv:** This is a C++ library that provides the event loop and handles asynchronous I/O operations. It has a thread pool to manage operations that can\'t be handled asynchronously by the OS kernel (like certain file system operations or DNS lookups).\n- **V8 Engine:** This is Google\'s open-source JavaScript engine that compiles JavaScript into native machine code, making it incredibly fast.' },
                { title: 'Modules and the File System', content: '### Organizing Your Code and Working with Files\n\nNode.js uses a module system to organize code. We will cover both the traditional **CommonJS** (`require`/`module.exports`) and the modern **ES Modules** (`import`/`export`).\n\nWe will also explore the built-in `fs` (File System) module. A key concept here is **Streams**, which are objects that let you read data from a source or write data to a destination in continuous fashion. They are especially useful for working with large files, as you don\'t need to load the entire file into memory at once.\n\n```javascript\nconst fs = require(\'fs\');\nconst http = require(\'http\');\n\nconst server = http.createServer((req, res) => {\n  // Bad practice: loads entire file into memory\n  // fs.readFile(\'large-file.txt\', (err, data) => res.end(data));\n\n  // Good practice: streams the file chunk by chunk\n  const readStream = fs.createReadStream(\'large-file.txt\');\n  readStream.pipe(res);\n});\n```' }
            ]
        },
        {
            title: 'Building a RESTful API with Express',
            lessons: [
                { title: 'Introduction to Express', content: '### Getting Started with Express.js\n\nExpress.js is a minimal and flexible Node.js web application framework that provides a robust set of features. We will set up a project from scratch, initialize `package.json`, install Express, and create a basic server.\n\n```javascript\nconst express = require(\'express\');\nconst app = express();\nconst port = 3000;\n\n// Middleware to parse JSON bodies\napp.use(express.json());\n\napp.get(\'/\', (req, res) => {\n  res.status(200).json({ message: \'Hello World!\' });\n});\n\napp.listen(port, () => {\n  console.log(`Server is running at http://localhost:${port}`);\n});\n```' },
                { title: 'Routing', content: '### Handling HTTP Requests\n\nRouting refers to how an application’s endpoints respond to client requests. We will learn to structure our routes cleanly using `express.Router` to create modular, mountable route handlers. We\'ll build a complete CRUD (Create, Read, Update, Delete) API for a resource like "products" or "users".\n\n```javascript\n// In routes/productRoutes.js\nconst express = require(\'express\');\nconst router = express.Router();\n\nrouter.get(\'/\', (req, res) => { /* Get all products */ });\nrouter.post(\'/\', (req, res) => { /* Create a new product */ });\nrouter.get(\'/:id\', (req, res) => { /* Get a single product */ });\n\nmodule.exports = router;\n\n// In app.js\nconst productRouter = require(\'./routes/productRoutes\');\napp.use(\'/api/products\', productRouter);\n```' },
                { title: 'Middleware', content: '### The Core of Express\n\nMiddleware functions are functions that have access to the request (`req`), response (`res`), and the `next` function in the application’s request-response cycle. We will write our own custom middleware for logging and authentication.\n\nWe will also cover **error-handling middleware**. This is a special type of middleware that has four arguments `(err, req, res, next)`. It allows you to centralize your error handling logic in one place.\n\n```javascript\n// Custom error-handling middleware\napp.use((err, req, res, next) => {\n  console.error(err.stack);\n  res.status(500).send(\'Something broke!\');\n});\n```' }
            ]
        }
    ],
    reviews: [
        {
            name: 'Charlie',
            rating: 5,
            comment: 'Jonas explains complex topics in a very easy to understand way. Highly recommended.'
        }
    ]
  },
  {
    id: 3,
    title: 'The Complete Python Pro Bootcamp for 2024',
    shortDescription: 'Become a Python Programmer from scratch.',
    longDescription: 'Become a Python Programmer and learn one of employer\'s most requested skills of 2024! This is the most comprehensive, yet straight-forward, course for the Python programming language. You will go from beginner to pro with 100+ real-world projects.',
    category: 'Data Science',
    difficulty: 'All Levels',
    duration: '6 lectures',
    image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=1400&auto=format&fit=crop',
    popular: true,
    isFree: false,
    rating: 4.7,
    students: 1203456,
    instructor: {
        name: 'Angela Yu',
        avatar: 'https://randomuser.me/api/portraits/women/3.jpg'
    },
    whatYouWillLearn: [
        'Be able to program in Python professionally.',
        'Master Python for data science, machine learning, and web development.',
        'Build a portfolio of 100+ Python projects to apply for developer jobs.',
        'Learn automation, game development, and app development with Python.'
    ],
    requirements: ['No programming experience needed. You will learn everything you need to know.'],
    curriculum: [
        {
            title: 'Python Basics',
            lessons: [
                { title: 'Variables and Data Types', content: '### Storing Data in Python\n\nWelcome to Python! A **variable** is a name that refers to a value. Python is dynamically typed, which means you don\'t have to declare the type of a variable.\n\nCommon data types include:\n- **Strings (`str`):** Text data. e.g., `"Hello"`. We will explore f-strings for easy formatting: `f"Hello, {name}"`\n- **Integers (`int`):** Whole numbers. e.g., `42`\n- **Floats (`float`):** Numbers with a decimal point. e.g., `3.14`\n- **Booleans (`bool`):** Represents `True` or `False`.\n\n```python\nname = "Alice"\nage = 30\n\nprint(f"Hello, {name}! You are {age} years old.") # Using an f-string\n```' },
                { title: 'Lists, Tuples, and Dictionaries', content: '### Working with Collections\n\nPython provides several built-in data structures.\n- **Lists:** Ordered, mutable (changeable). Defined with `[]`. Common methods: `.append()`, `.pop()`, `.sort()`.\n- **Tuples:** Ordered, immutable (unchangeable). Defined with `()`. Useful for data that should not change, like coordinates.\n- **Dictionaries:** Unordered (in older Python versions), mutable collections of key-value pairs. Defined with `{}`. Common methods: `.keys()`, `.values()`, `.items()`.\n- **Sets:** Unordered, mutable collections of *unique* elements. Defined with `set()` or `{}` (but an empty `{}` creates a dictionary). Useful for membership testing and removing duplicates.\n\n```python\n# A list of fruits\nfruits = ["apple", "banana", "cherry"]\nfruits.append("orange")\n\n# A dictionary representing a person\nperson = {\n  "name": "Bob",\n  "age": 25\n}\n\n# A set of unique numbers\nnumbers = {1, 2, 3, 3, 4} # will be {1, 2, 3, 4}\n```'},
                { title: 'Control Flow: Conditionals and Loops', content: '### Making Decisions and Repeating Actions\n\n- **`if`, `elif`, `else` statements** are used for conditional logic.\n- **`for` loops** are used to iterate over a sequence (like a list).\n- **`while` loops** are used to repeat a block of code as long as a condition is true.\n\nWe will also cover **error handling** using `try...except` blocks, which is crucial for writing robust code.\n\n```python\n# Looping through a dictionary\nperson = {\'name\': \'Carol\', \'age\': 42}\nfor key, value in person.items():\n    print(f"{key}: {value}")\n\n# Error handling\ntry:\n    result = 10 / 0\nexcept ZeroDivisionError:\n    print("You can\'t divide by zero!")\n```' }
            ]
        },
        {
            title: 'Advanced Python',
            lessons: [
                { title: 'Object-Oriented Programming (OOP)', content: '### Structuring Code with Classes\n\nObject-Oriented Programming is a paradigm for structuring programs so that properties and behaviors are bundled into individual **objects**. A **class** is a blueprint for creating objects.\n\nWe will cover:\n- **Classes and Objects:** How to define a class with an `__init__` constructor.\n- **Inheritance:** Creating a subclass that inherits from a parent class using `super()` to call the parent\'s methods.\n- **Dunder Methods:** Special methods like `__str__` to define how an object is represented as a string.\n\n```python\nclass Animal:\n  def __init__(self, name):\n    self.name = name\n  def speak(self):\n    raise NotImplementedError("Subclass must implement abstract method")\n\nclass Dog(Animal):\n  def speak(self):\n    return "Woof!"\n\nmy_dog = Dog("Buddy")\nprint(f"{my_dog.name} says {my_dog.speak()}")\n```' },
                { title: 'Decorators', content: '### Modifying Functions on the Fly\n\nA decorator is a function that takes another function, adds some functionality, and returns the modified function. Let\'s create a timer decorator.\n\n```python\nimport time\n\ndef timer(func):\n    def wrapper(*args, **kwargs):\n        start_time = time.time()\n        result = func(*args, **kwargs)\n        end_time = time.time()\n        print(f"{func.__name__} ran in: {end_time - start_time} sec")\n        return result\n    return wrapper\n\n@timer\ndef some_long_task():\n    time.sleep(2)\n\nsome_long_task()\n```' },
                { title: 'List Comprehensions', content: '### A More Pythonic Way to Create Collections\n\nComprehensions provide a concise way to create collections.\n- **List Comprehensions:** `[x**2 for x in range(10) if x % 2 == 0]` (squares of even numbers)\n- **Dictionary Comprehensions:** `{x: x**2 for x in range(5)}` (creates `{0: 0, 1: 1, ...}`)\n- **Set Comprehensions:** `{s.lower() for s in [\'A\', \'B\', \'a\']}` (creates `{\'a\', \'b\'}`)\n\nThey are often more readable and faster than using traditional loops.' }
            ]
        }
    ],
    reviews: [
        {
            name: 'David',
            rating: 5,
            comment: 'Angela is an amazing teacher. The projects are fun and engaging.'
        }
    ]
  },
  {
    id: 4,
    title: 'Figma UI UX Design Essentials',
    shortDescription: 'Learn Figma like a pro and start designing beautiful apps.',
    longDescription: 'Learn Figma like a pro and start designing beautiful and engaging mobile apps, websites and more. Master the #1 tool for UI/UX designers. This course will take you from the very basics to advanced prototyping and collaboration features.',
    category: 'UI/UX Design',
    difficulty: 'Beginner',
    duration: '6 lectures',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1400&auto=format&fit=crop',
    popular: false,
    isFree: true,
    rating: 4.5,
    students: 98765,
    instructor: {
        name: 'Daniel Scott',
        avatar: 'https://randomuser.me/api/portraits/men/4.jpg'
    },
    whatYouWillLearn: [
        'Build a UI project from beginning to end.',
        'Create a professional and stunning portfolio to show to clients.',
        'Learn how to create a simple style guide to keep your designs consistent.',
        'Master prototyping and animation in Figma.'
    ],
    requirements: ['No previous design experience is necessary.'],
    curriculum: [
        {
            title: 'Figma Fundamentals',
            lessons: [
                { title: 'The Figma Interface', content: '### Getting Comfortable with the Figma Workspace\n\nWelcome to Figma! We\'ll take a tour of the user interface: the **Toolbar** at the top, the **Layers Panel** on the left, the **Canvas** in the middle, and the **Properties Panel** on the right. We will also introduce essential keyboard shortcuts to speed up your workflow (e.g., `F` for Frame, `R` for Rectangle, `T` for Text).' },
                { title: 'Frames, Shapes, and Text', content: '### The Basic Building Blocks\n\n- **Frames:** Frames are the containers for your designs (like artboards). We will create frames for different screen sizes and understand nesting frames.\n- **Shapes:** Learn to create and manipulate basic vector shapes. We will explore the boolean operations (Union, Subtract, etc.) to create more complex shapes.\n- **Text:** Master the text tool. We will cover typography basics like font pairing, line height, and letter spacing to create readable and beautiful text.' },
                { title: 'Layout Grids and Constraints', content: '### Designing with Structure\n\n**Layout Grids** are essential for creating aligned and professional-looking designs. We will set up a responsive 12-column grid, a common standard for web design. **Constraints** are rules that tell Figma how layers should respond when you resize their parent Frame. We will create a simple responsive header component and see how constraints keep the logo on the left and navigation on the right.' }
            ]
        },
        {
            title: 'Advanced Design Techniques',
            lessons: [
                { title: 'Auto Layout', content: '### Building Responsive Components\n\nAuto Layout is one of Figma\'s most powerful features. It allows you to create frames that grow or shrink automatically. We will build a complex card component with a title, description, and tags, and see how Auto Layout handles varying text lengths and automatically maintains spacing. We will also explore nesting Auto Layout frames for even more control.' },
                { title: 'Components, Variants, and Styles', content: '### Creating Reusable Design Systems\n\n- **Components:** Learn how to create reusable design elements. When you change the main component, all instances update automatically.\n- **Variants:** Variants allow you to group similar components. We will create one button component with variants for its different states (primary, secondary, hover, disabled) and sizes (small, medium, large).\n- **Styles:** Create reusable styles for colors (e.g., primary, text, background), text, and effects to build a consistent and scalable design system.' },
                { title: 'Prototyping', content: '### Bringing Your Designs to Life\n\nPrototyping allows you to create interactive flows. We will learn how to create connections between frames, add transitions (like "dissolve" or "slide in"), and use **Smart Animate** to create seamless animations between different states of a component. We will also explore **interactive components** to create micro-interactions, like a toggle switch that animates when clicked.' }
            ]
        }
    ],
    reviews: [
        {
            name: 'Eve',
            rating: 4,
            comment: 'Great course for beginners. Covers all the essentials.'
        }
    ]
  },
  {
    id: 5,
    title: 'Advanced CSS and Sass: Flexbox, Grid, Animations and More!',
    shortDescription: 'Master advanced CSS techniques.',
    longDescription: 'The most advanced and modern CSS course on the internet: master flexbox, CSS Grid, responsive design, and so much more. This course is for developers who already have a solid foundation in HTML and CSS.',
    category: 'Frontend',
    difficulty: 'Advanced',
    duration: '5 lectures',
    image: 'https://images.unsplash.com/photo-1524749292158-7540c2494485?q=80&w=1400&auto=format&fit=crop',
    popular: true,
    isFree: false,
    rating: 4.9,
    students: 154321,
    instructor: {
        name: 'Jonas Schmedtmann',
        avatar: 'https://randomuser.me/api/portraits/men/2.jpg'
    },
    whatYouWillLearn: [
        'Master Flexbox and CSS Grid for creating complex layouts.',
        'Learn advanced animation and transition techniques.',
        'Understand how to write modular and reusable CSS with Sass.',
        'Build beautiful and responsive websites.'
    ],
    requirements: ['Solid understanding of HTML and basic CSS.'],
    curriculum: [
        {
            title: 'Sass: A CSS Preprocessor',
            lessons: [
                { title: 'What is Sass?', content: '### Writing More Powerful CSS\n\nSass (Syntactically Awesome Style Sheets) is a CSS preprocessor that adds special features like variables, nested rules, and mixins. We will learn how to set up a Sass workflow using a compiler and structure our project with partial files (`_variables.scss`, `_mixins.scss`, etc.) for better organization.' },
                { title: 'Variables, Nesting, and Mixins', content: '### Core Sass Features\n\n- **Variables:** Store values you want to reuse, like colors or font sizes. e.g., `$primary-color: #3b82f6;`\n- **Nesting:** Nest your CSS selectors in a way that follows the same visual hierarchy of your HTML.\n- **Mixins:** Create reusable groups of CSS declarations. We will create a mixin for creating responsive breakpoints.\n- **Functions & Control Directives:** We will explore `@extend` for sharing styles, and use directives like `@each` and `@for` to write loops that generate CSS.' }
            ]
        },
        {
            title: 'Advanced Layouts',
            lessons: [
                { title: 'Flexbox Deep Dive', content: '### One-Dimensional Layouts with Flexbox\n\nFlexbox is a layout model designed for laying out items in a single dimension. We will master all its properties, including the container properties (`justify-content`, `align-items`, `flex-wrap`) and the item properties (`flex-grow`, `flex-shrink`, `flex-basis`, `order`). We will build several practical components like a responsive navigation bar and a card layout.' },
                { title: 'Mastering CSS Grid', content: '### Two-Dimensional Layouts with CSS Grid\n\nCSS Grid is a powerful layout system for creating two-dimensional layouts. We will learn how to define grid containers, create tracks and gaps, and place items on the grid using line numbers and `grid-template-areas`. We will build a complete, complex magazine-style page layout to see the true power of CSS Grid.' },
                { title: 'Responsive Design Techniques', content: '### Building for Any Screen Size\n\nWe will cover advanced responsive design techniques, including using media queries, creating fluid layouts, and implementing mobile-first design. We will also learn about modern CSS functions like `clamp()` for creating fluid typography that scales with the viewport, and how to combine Flexbox and Grid to build complex, fully responsive layouts that look great on any device.' }
            ]
        }
    ],
    reviews: [
        {
            name: 'Frank',
            rating: 5,
            comment: 'Another brilliant course from Jonas. He is a CSS wizard.'
        }
    ]
  },
  {
    id: 6,
    title: 'Docker & Kubernetes: The Practical Guide 2024',
    shortDescription: 'Learn Docker and Kubernetes from the ground up.',
    longDescription: 'Learn Docker and Kubernetes from the ground up and build, test and deploy your applications with containers in production. This course provides a hands-on approach to learning containerization and orchestration.',
    category: 'DevOps',
    difficulty: 'Intermediate',
    duration: '6 lectures',
    image: 'https://images.unsplash.com/photo-1605745341112-85968b193d5b?q=80&w=1400&auto=format&fit=crop',
    popular: true,
    isFree: false,
    rating: 4.8,
    students: 123456,
    instructor: {
        name: 'Stephen Grider',
        avatar: 'https://randomuser.me/api/portraits/men/5.jpg'
    },
    whatYouWillLearn: [
        'Understand the fundamentals of Docker and Kubernetes.',
        'Containerize your applications with Docker.',
        'Orchestrate your containers with Kubernetes.',
        'Set up a CI/CD pipeline for your applications.'
    ],
    requirements: ['Basic understanding of web development concepts.'],
    curriculum: [
        {
            title: 'Docker Fundamentals',
            lessons: [
                { title: 'What is Docker?', content: '### Introduction to Containerization\n\nDocker is a platform for developing, shipping, and running applications in **containers**. A container packages up an application\'s code along with all its dependencies. We will contrast this with Virtual Machines (VMs) and understand why containers are more lightweight and efficient. We will install Docker and run our first container.' },
                { title: 'Images and Containers', content: '### The Building Blocks of Docker\n\n- **Image:** A read-only template with instructions for creating a container. We will learn about image layers and how they make builds and transfers more efficient.\n- **Container:** A runnable instance of an image. We will learn commands like `docker run`, `docker stop`, `docker ps`, and `docker exec`.\n- **Docker Compose:** We will learn to use `docker-compose.yml` to define and run multi-container Docker applications (e.g., a web server and a database) with a single command.' },
                { title: 'Creating Docker Images with Dockerfile', content: '### Defining Your Own Containers\n\nA `Dockerfile` is a text file that contains all the commands to build an image. We will write a Dockerfile for a Node.js application and learn about **multi-stage builds** to create smaller, more secure production images by separating the build environment from the runtime environment.' }
            ]
        },
        {
            title: 'Kubernetes Deep Dive',
            lessons: [
                { title: 'What is Kubernetes?', content: '### Container Orchestration\n\nKubernetes (K8s) is an open-source container orchestration platform for automating the deployment, scaling, and management of containerized applications. We will explore the problems Kubernetes solves, such as service discovery, load balancing, self-healing, and automated rollouts and rollbacks.' },
                { title: 'Kubernetes Architecture', content: '### Understanding the Cluster\n\nA Kubernetes cluster consists of **Nodes** (worker machines) and a **Control Plane** that manages them. We will learn about the key components of the control plane (API Server, etcd, Scheduler) and the worker nodes (Kubelet, Kube-proxy) and how they work together.' },
                { title: 'Pods, Services, and Deployments', content: '### Core Kubernetes Objects\n\nWe will write YAML configuration files to define the desired state of our application.\n- **Pods:** The smallest deployable units in Kubernetes. \n- **Deployments:** A way to declaratively manage a set of identical Pods, handling updates and rollbacks.\n- **Services:** An abstraction to expose an application running on a set of Pods. We will learn the difference between `ClusterIP`, `NodePort`, and `LoadBalancer` services.\n- **Ingress:** An API object that manages external access to the services in a cluster, typically HTTP. Ingress can provide load balancing, SSL termination and name-based virtual hosting.' }
            ]
        }
    ],
    reviews: [
        {
            name: 'Grace',
            rating: 5,
            comment: 'Stephen is an excellent instructor. The course is very practical and hands-on.'
        }
    ]
  },
  {
    id: 7,
    title: 'Go: The Complete Developer\'s Guide (Golang)',
    shortDescription: 'Master the Go Programming Language.',
    longDescription: 'Master the fundamentals and advanced features of the Go Programming Language (Golang). This course is perfect for anyone looking to learn a new, powerful, and efficient programming language.',
    category: 'Backend',
    difficulty: 'All Levels',
    duration: '6 lectures',
    image: 'https://images.unsplash.com/photo-1623434914022-386f217a123a?q=80&w=1400&auto=format&fit=crop',
    popular: false,
    isFree: false,
    rating: 4.6,
    students: 87654,
    instructor: {
        name: 'Stephen Grider',
        avatar: 'https://randomuser.me/api/portraits/men/5.jpg'
    },
    whatYouWillLearn: [
        'Understand the fundamentals of Go.',
        'Learn about concurrency and goroutines.',
        'Build real-world applications with Go.',
        'Master the Go standard library.'
    ],
    requirements: ['No prior programming experience required.'],
    curriculum: [
        {
            title: 'Go Basics',
            lessons: [
                { title: 'Why Go?', content: '### The Go Programming Language\n\nGo (or Golang) is an open-source programming language developed by Google. It is statically typed, compiled, and known for its simplicity, efficiency, and powerful support for **concurrency**. We will compare its performance and use cases to other languages like Python and Node.js.' },
                { title: 'Variables, Data Types, and Packages', content: '### The Fundamentals\n\nWe will learn how to declare variables using `var` and `:=`. We will cover Go\'s basic data types, as well as composite types like **arrays**, **slices**, and **maps**. Slices are a key data structure in Go, providing a more flexible interface to sequences of data than arrays.' },
                { title: 'Functions and Control Flow', content: '### Writing Logic in Go\n\nThis lesson covers how to define functions, including how to return multiple values, a common pattern in Go for error handling. We will explore Go\'s control flow statements, including `if/else`, the powerful `for` loop, and the `switch` statement.' }
            ]
        },
        {
            title: 'Advanced Go Features',
            lessons: [
                { title: 'Structs and Interfaces', content: '### Custom Data Structures\n\n- **Structs:** Structs are typed collections of fields. We will learn how to define structs and attach methods to them.\n- **Interfaces:** Interfaces in Go are a powerful way to define behavior. They are satisfied implicitly. If a type implements the methods of an interface, it automatically satisfies that interface. This allows for flexible and decoupled code, which we will demonstrate with a practical example.' },
                { title: 'Concurrency with Goroutines and Channels', content: '### Go\'s Superpower\n\nConcurrency is a built-in feature of Go. \n- **Goroutines:** A goroutine is a lightweight thread. We will learn how to start them with the `go` keyword.\n- **Channels:** Channels are the pipes that connect concurrent goroutines. We will learn the difference between buffered and unbuffered channels and use them to build a **worker pool** pattern to process jobs concurrently.' }
            ]
        }
    ],
    reviews: [
        {
            name: 'Heidi',
            rating: 4,
            comment: 'Great introduction to Go. Could use more advanced projects.'
        }
    ]
  },
  {
    id: 8,
    title: 'SQL - MySQL for Data Analytics and Business Intelligence',
    shortDescription: 'Learn SQL, MySQL, and more in this course.',
    longDescription: 'SQL for beginners, database management and data analytics. Learn SQL, MySQL, and more in this course. This course is designed to take you from a complete beginner to an advanced SQL user.',
    category: 'Data Science',
    difficulty: 'Beginner',
    duration: '6 lectures',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1400&auto=format&fit=crop',
    popular: false,
    isFree: true,
    rating: 4.7,
    students: 198765,
    instructor: {
        name: 'Kirill Eremenko',
        avatar: 'https://randomuser.me/api/portraits/men/6.jpg'
    },
    whatYouWillLearn: [
        'Master SQL and MySQL.',
        'Learn how to perform data analysis and business intelligence tasks.',
        'Understand database design and management.',
        'Write complex SQL queries.'
    ],
    requirements: ['No prior experience with SQL or databases is required.'],
    curriculum: [
        {
            title: 'Database Fundamentals',
            lessons: [
                { title: 'What is a Relational Database?', content: '### Understanding Databases\n\nA **Relational Database** stores data in tables, which are like spreadsheets. Each table has rows and columns. We will learn about primary keys, foreign keys, and how they create relationships between tables. We will also touch on the basics of **normalization** to design efficient and non-redundant database schemas.' },
                { title: 'Basic SQL Commands: SELECT, FROM, WHERE', content: '### Retrieving Data\n\nThe most fundamental SQL command is `SELECT`. We will cover:\n- **`SELECT`** and **`FROM`** to specify columns and tables.\n- **`WHERE`** to filter records using comparison operators (`=`, `>`, `<`), `AND`, `OR`, `LIKE` (for pattern matching), and `IN` (for matching multiple values).\n\n```sql\n-- Selects all users whose name starts with \'J\' and are from CA or NY\nSELECT *\nFROM users\nWHERE name LIKE \'J%\'\n  AND state IN (\'CA\', \'NY\');\n```' },
                { title: 'Sorting and Limiting Results', content: '### Ordering and Paginating Data\n\n- **`ORDER BY`** is used to sort the result set.\n- **`LIMIT`** is used to specify the maximum number of records to return.\n- **`OFFSET`** is used to skip a certain number of records, which is essential for implementing pagination.\n\n```sql\n-- Selects the second page of 10 users, ordered by name\nSELECT name, email\nFROM users\nORDER BY name ASC\nLIMIT 10 OFFSET 10;\n```' }
            ]
        },
        {
            title: 'Advanced SQL',
            lessons: [
                { title: 'Aggregate Functions', content: '### Summarizing Your Data\n\nAggregate functions perform a calculation on a set of values. Common functions include `COUNT()`, `SUM()`, `AVG()`, `MIN()`, and `MAX()`. We will use them with the **`GROUP BY`** clause. We will also learn the difference between `WHERE` and `HAVING` ( `WHERE` filters rows before grouping, `HAVING` filters groups after aggregation).' },
                { title: 'JOINs: Combining Data from Multiple Tables', content: '### Connecting Tables\n\nA **`JOIN`** clause is used to combine rows from two or more tables. We will cover:\n- **`INNER JOIN`**: Returns records that have matching values in both tables.\n- **`LEFT JOIN`**: Returns all records from the left table, and the matched records from the right table.\n- **`RIGHT JOIN`**: Returns all records from the right table, and the matched records from the left table.\n- **`FULL OUTER JOIN`**: Returns all records when there is a match in either left or right table.\n\nWe will use a practical example with `orders` and `customers` tables.' },
                { title: 'Subqueries & CTEs', content: '### Nested and Reusable Queries\n\n- **Subqueries** are queries nested inside another query. They can be powerful but sometimes hard to read.\n- **Common Table Expressions (CTEs)** are a more modern and readable alternative to complex subqueries. A CTE allows you to define a temporary, named result set that you can reference within a `SELECT`, `INSERT`, `UPDATE`, or `DELETE` statement.\n\n```sql\n-- Using a CTE to find customers in states with more than 100 customers\nWITH StateCounts AS (\n    SELECT state, COUNT(*) as num_customers\n    FROM customers\n    GROUP BY state\n)\nSELECT *\nFROM customers\nWHERE state IN (SELECT state FROM StateCounts WHERE num_customers > 100);\n```' }
            ]
        }
    ],
    reviews: [
        {
            name: 'Ivan',
            rating: 5,
            comment: 'Kirill is a fantastic teacher. The course is very well-structured and easy to follow.'
        }
    ]
  },
  {
    id: 9,
    title: 'Machine Learning A-Z™: AI, Python & R + ChatGPT Bonus',
    shortDescription: 'Learn to create Machine Learning algorithms in Python and R.',
    longDescription: 'Learn to create Machine Learning algorithms in Python and R from two Data Science experts. Code templates included. This course covers everything from regression and classification to clustering and deep learning.',
    category: 'Data Science',
    difficulty: 'Advanced',
    duration: '44 lectures',
    image: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?q=80&w=1400&auto=format&fit=crop',
    popular: true,
    isFree: false,
    rating: 4.5,
    students: 950000,
    instructor: {
        name: 'Kirill Eremenko',
        avatar: 'https://randomuser.me/api/portraits/men/6.jpg'
    },
    whatYouWillLearn: [
        'Master Machine Learning on Python & R',
        'Have a great intuition of many Machine Learning models',
        'Make accurate predictions',
        'Handle specific topics like Reinforcement Learning, NLP and Deep Learning'
    ],
    requirements: ['Just some high school mathematics level.'],
    curriculum: [
        {
            title: 'Part 1: Data Preprocessing',
            lessons: [
                { title: 'Data Preprocessing Template', content: 'Content for Data Preprocessing Template' },
                { title: 'Importing the libraries', content: 'Content for Importing the libraries' },
            ]
        },
        {
            title: 'Part 2: Regression',
            lessons: [
                { title: 'Simple Linear Regression', content: 'Content for Simple Linear Regression' },
                { title: 'Multiple Linear Regression', content: 'Content for Multiple Linear Regression' },
            ]
        }
    ],
    reviews: [
        {
            name: 'John',
            rating: 5,
            comment: 'Amazing content, very detailed.'
        }
    ]
  },
  {
    id: 10,
    title: 'The Web Developer Bootcamp 2024',
    shortDescription: 'The only course you need to learn web development - HTML, CSS, JS, Node, and More!',
    longDescription: 'This is the only course you need to learn web development. There are a lot of options for online developer training, but this course is without a doubt the most comprehensive and effective on the market. It covers HTML, CSS, JavaScript, Node.js, and much more.',
    category: 'Frontend',
    difficulty: 'All Levels',
    duration: '63 lectures',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1400&auto=format&fit=crop',
    popular: true,
    isFree: false,
    rating: 4.7,
    students: 780000,
    instructor: {
        name: 'Colt Steele',
        avatar: 'https://randomuser.me/api/portraits/men/7.jpg'
    },
    whatYouWillLearn: [
        'Build real world websites and web apps',
        'Work as a freelance web developer',
        'Master frontend development with React',
        'Master backend development with Node.js and Express'
    ],
    requirements: ['No programming experience needed! I take you from beginner to expert.'],
    curriculum: [
        {
            title: 'Introduction to Web Development',
            lessons: [
                { title: 'How the web works', content: 'Content for How the web works' },
                { title: 'HTML Essentials', content: 'Content for HTML Essentials' },
            ]
        },
        {
            title: 'JavaScript Basics',
            lessons: [
                { title: 'Variables and Primitives', content: 'Content for Variables and Primitives' },
                { title: 'Conditionals and Loops', content: 'Content for Conditionals and Loops' },
            ]
        }
    ],
    reviews: [
        {
            name: 'Sarah',
            rating: 5,
            comment: 'Colt is the best instructor I have ever had. The course is amazing.'
        }
    ]
  },
  {
    id: 11,
    title: 'AWS Certified Solutions Architect - Associate SAA-C03',
    shortDescription: 'Pass the AWS Certified Solutions Architect - Associate exam.',
    longDescription: 'Pass the AWS Certified Solutions Architect - Associate exam with this comprehensive course. Learn all about AWS services like EC2, S3, RDS, and VPC. This course is packed with practical exercises and real-world scenarios.',
    category: 'DevOps',
    difficulty: 'Intermediate',
    duration: '27 lectures',
    image: 'https://images.unsplash.com/photo-1579226905180-636b76d96082?q=80&w=1400&auto=format&fit=crop',
    popular: false,
    isFree: false,
    rating: 4.7,
    students: 600000,
    instructor: {
        name: 'Stephane Maarek',
        avatar: 'https://randomuser.me/api/portraits/men/8.jpg'
    },
    whatYouWillLearn: [
        'Pass the AWS Certified Solutions Architect Associate Certification (SAA-C03)',
        'Perform Real-World Solution Architecting on AWS',
        'Learn the AWS Fundamentals (EC2, ELB, ASG, RDS, ElastiCache, S3)',
        'Master all the differences of Databases on AWS'
    ],
    requirements: ['Absolute beginners to AWS are welcome.', 'No programming knowledge required.'],
    curriculum: [
        {
            title: 'Introduction to AWS',
            lessons: [
                { title: 'What is Cloud Computing?', content: 'Content for What is Cloud Computing?' },
                { title: 'AWS Global Infrastructure', content: 'Content for AWS Global Infrastructure' },
            ]
        },
        {
            title: 'IAM & EC2',
            lessons: [
                { title: 'IAM: Users, Groups, Roles, Policies', content: 'Content for IAM' },
                { title: 'EC2 Fundamentals', content: 'Content for EC2 Fundamentals' },
            ]
        }
    ],
    reviews: [
        {
            name: 'Mike',
            rating: 5,
            comment: 'The best course to prepare for the AWS certification. Stephane is great.'
        }
    ]
  },
  {
    id: 12,
    title: 'User Experience Design Essentials - Adobe XD UI UX Design',
    shortDescription: 'Use XD to get a job in UI Design, User Interface, User Experience design.',
    longDescription: 'Use Adobe XD to create beautiful user interfaces and user experiences. Learn all the latest tips and tricks in XD. This course will take you from a beginner to an advanced user of Adobe XD.',
    category: 'UI/UX Design',
    difficulty: 'Beginner',
    duration: '15 lectures',
    image: 'https://images.unsplash.com/photo-1611162618071-b34a2ec19a1f?q=80&w=1400&auto=format&fit=crop',
    popular: false,
    isFree: false,
    rating: 4.6,
    students: 250000,
    instructor: {
        name: 'Daniel Scott',
        avatar: 'https://randomuser.me/api/portraits/men/4.jpg'
    },
    whatYouWillLearn: [
        'How to use Adobe XD to design and prototype a mobile app.',
        'How to work with fonts & colors.',
        'How to create your own UI Kits.',
        'You will be able to start earning money from your XD Skills.'
    ],
    requirements: ['You will need a copy of Adobe XD 2019 or above. A free trial can be downloaded from Adobe.'],
    curriculum: [
        {
            title: 'Getting Started with Adobe XD',
            lessons: [
                { title: 'Introduction to Adobe XD', content: 'Content for Introduction to Adobe XD' },
                { title: 'Artboards and Navigation', content: 'Content for Artboards and Navigation' },
            ]
        },
        {
            title: 'Prototyping',
            lessons: [
                { title: 'Creating Interactive Prototypes', content: 'Content for Creating Interactive Prototypes' },
                { title: 'Auto-Animate in XD', content: 'Content for Auto-Animate in XD' },
            ]
        }
    ],
    reviews: [
        {
            name: 'Jessica',
            rating: 5,
            comment: 'Dan is a great teacher. I learned so much from this course.'
        }
    ]
  }
];

export const allCourses: Course[] = coursesData.map(course => ({
  ...course,
  slug: slugify(course.title)
}));
