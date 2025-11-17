# UpSkills

A web platform to help users develop new skills and track their learning journey — built with **Laravel** for the backend and **React + TypeScript** for the frontend.

## Table of Contents

- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Getting Started](#getting-started)  
  - [Prerequisites](#prerequisites)  
  - [Installation](#installation)  
- [Usage](#usage)  
- [Project Structure](#project-structure)  
- [Contributing](#contributing)  
- [License](#license)  
- [Contact](#contact)  

## Features

- User registration and authentication  
- Course catalog with skill paths / learning tracks  
- Progress tracking (e.g. marking lessons as completed)  
- Dashboard for users to view current courses and achievements  
- Admin panel to manage courses, categories, and users  
- REST API powered by Laravel  
- React-based frontend for a smooth single-page experience  

## Tech Stack

- **Backend**: Laravel (PHP)  
- **Frontend**: React, TypeScript  
- **Styling**: Tailwind CSS *(if applicable)*  
- **HTTP Client**: Axios *(or whatever you use)*  
- **State / Data Fetching**: *(e.g. TanStack Query, Redux, Context API…)*  
- **Database**: MySQL / PostgreSQL / SQLite *(choose your DB)*  

## Getting Started

### Prerequisites

Make sure you have the following installed on your machine:

- PHP (version >= 8)  
- Composer  
- Node.js & npm / Yarn  
- A database (MySQL, PostgreSQL, etc.)

### Installation

1. **Clone the repo**  
   ```bash
   git clone https://github.com/agamlatiff/upskills.git  
   cd upskills
````

2. **Backend setup**

   ```bash
   cd backend  # or wherever your Laravel app lives  
   composer install  
   cp .env.example .env  
   # configure your database settings in .env  
   php artisan key:generate  
   php artisan migrate  
   php artisan db:seed   # if you have seeders  
   ```

3. **Frontend setup**

   ```bash
   cd ../frontend  # or the React folder  
   npm install  # or yarn  
   cp .env.example .env  # if you have environment variables  
   npm run dev  # or npm start
   ```

4. **Run both back & front**

   * Run Laravel server: `php artisan serve`
   * Run React dev server (from its folder): `npm run dev`

## Usage

* Register a new user / log in
* Browse available courses and learning paths
* Start a course — mark lessons as completed
* Check your progress on the dashboard
* *(Optional)* For admins: login to the admin panel to manage courses and users

## Project Structure

Here’s a rough breakdown of how the project is organized:

```
/upskills
  /backend             # Laravel application  
    /app  
    /database  
    /routes  
    /resources  
  /frontend            # React app  
    /src  
      /components  
      /pages  
      /services       # Axios / API services  
      /hooks  
```

*(Modify this section based on your real folder structure.)*

## Contributing

Contributions are welcome! If you want to contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/YourFeature`)
3. Make your changes & commit (`git commit -m 'Add some feature'`)
4. Push to your branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

Please make sure your code follows the existing style and includes tests if necessary.

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for more details.

## Contact

* **Author**: Agam Latiff
* **GitHub**: [agamlatiff](https://github.com/agamlatiff)
* **Project Link**: [https://github.com/agamlatiff/upskills](https://github.com/agamlatiff/upskills)

```
