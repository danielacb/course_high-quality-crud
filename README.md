# High Quality Crud Course

<a href="https://dcb-high-quality-crud.vercel.app/">
  <p align="center">
     <img alt="High Quality Crud" src="https://github.com/danielacb/course_high-quality-crud/assets/18037904/96229cc1-dfe2-4a2e-92f7-48c90311373b" width="100%">
  </p>
</a>



<div align="center">
   
   [![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)](https://dcb-high-quality-crud.vercel.app/)
</div>

### Course on How to Build a High Quality CRUD project

This project revolves around the fundamental Create, Read, Update, and Delete (CRUD) operations, ensuring seamless interaction with a [supabase](https://supabase.com/) database. It embodies industry best practices and patterns, leverages the power of modern web development technologies, including JavaScript/TypeScript, Node.js, React.js/Next.js, Cypress, GitHub Actions, and Vercel, to deliver a robust and efficient web application.


- **Market Best Practices:** We adhere to industry-standard best practices and design patterns, promoting code quality, maintainability, and scalability.
- **JavaScript/TypeScript:** We use JavaScript for its versatility and TypeScript for enhanced type safety, reducing runtime errors and improving codebase readability.
- **Node.js:** The backend of our application is powered by Node.js, offering a lightweight and efficient server environment.
- **React.js/Next.js:** Our frontend is built on React.js for dynamic and responsive user interfaces. Next.js enhances performance and SEO optimization.
- **Cypress:** We employ Cypress for end-to-end testing, ensuring that the application functions flawlessly and delivers an exceptional user experience.
- **Continuous Integration:** GitHub Actions are set up to provide continuous integration, automatically building and testing your code with each push.
- **Deployment on Vercel:** Vercel hosts our application, ensuring rapid deployment, scalability, and reliability.

<br>

<a href="https://dcb-high-quality-crud.vercel.app/" target="_blank">
   <p align="center">
      <img width="229" alt="btn" src="https://github.com/danielacb/course_high-quality-crud/assets/18037904/c862c0a2-6f41-48bf-9ed4-9ed224f75896">
   </p>
</a>

<a href="https://dcb-high-quality-crud.vercel.app/" target="_blank">
   <p align="center">
      Project link
   </p>
</a>

<a href="https://crudcomqualidade.io/" target="_blank">
   <p align="center">
      Course link
   </p>
</a>

<br>

### Running the project locally

Recommended versions: node `v16.18.1` and npm `8.19.2`

1. Setup [supabase](https://supabase.com/) database:

    1.1 Create a new supabase project
   
    1.2 Create a new table with the following configuration:

    <img width="659" alt="Supabase TODOs table" src="https://github.com/danielacb/course_high-quality-crud/assets/18037904/aeb50b56-3bbe-4aba-9453-e57130ce974d">

    _(content is the only required field)_

    1.3 setup the environment variables like this:
   

```
# .env or .env.local
SUPABASE_URL=
SUPABASE_PUBLIC_KEY=
SUPABASE_SECRET_KEY=
```

3. Run:

```
# Install dependencies
npm install

# Start development mode
npm run dev
```

Visit `http://localhost:3000` to view your application.

<br>

Other scripts:

- `npm run build`: runs next build to build the application for production usage.
- `npm run start`: runs next start to start a Next.js production server.
- `npm run lint`: runs next lint to set up Next.js' built-in ESLint configuration.
- `npm run cypress:run`: runs cypress tests to completion
- `npm run cy:open`: opens cypress browser window


