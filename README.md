# PeopleDesk — Employee Dashboard

A responsive React project for Assignment 2. It uses React Router for navigation, Bootstrap for UI utilities, and the JSONPlaceholder API to display users.

## Features
- Dashboard with user count and searchable employee directory.
- Fetches `https://jsonplaceholder.typicode.com/users`.
- Table and card views showing ID, name, email, company, and city.
- Employee form with Name, Designation, Location, and Salary.
- Frontend validation; no backend submission is performed.
- Responsive sidebar navigation and layout.

## Requirements
- Node.js 18 or later
- npm

## Run locally
1. Extract this ZIP.
2. Open a terminal inside the `employee-dashboard` folder.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open the local URL printed by Vite (usually `http://localhost:5173`).

## Create a production build
```bash
npm run build
```

## Upload to GitHub
Create an empty repository on GitHub, then run these commands from this project folder (replace the URL with your own repository URL):
```bash
git init
git add .
git commit -m "Create employee dashboard assignment"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

## Notes
- The directory uses demo users from JSONPlaceholder, not a real employee database.
- Form submission only validates the entered fields. It does not send or persist data, as specified in the assignment.
