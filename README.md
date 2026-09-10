# TastyBites — Frontend

React + Vite + Tailwind frontend for the TastyBites Restaurant Management System.

## Setup

```bash
npm install
cp .env.example .env
# edit .env if your backend runs somewhere other than http://localhost:5000/api
npm run dev
```

The app runs at http://localhost:5173 and expects the backend API at the URL set in `VITE_API_URL`.

## Structure

- `src/pages/public/` — Home, Menu, Menu Item Details, Login, Register, Admin Login
- `src/pages/admin/` — Dashboard, Menu Items (list/add/edit), Users
- `src/components/` — shared UI: Navbar, Footer, MenuRow, CategoryTabs, AdminSidebar, StatCard, route guards
- `src/context/AuthContext.jsx` — login/register/logout, stores JWT + user in localStorage
- `src/api/axios.js` — pre-configured Axios instance that attaches the JWT automatically

## Notes

- Admin routes (`/admin/*`) are protected — only accounts with role `Admin` can reach them.
- User/Admin registration always assigns role `User` server-side, matching the backend.
- Menu item forms submit as `multipart/form-data` to support image upload.
