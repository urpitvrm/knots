CozyLoops — Handmade Crochet Store
=================================

A full‑stack ecommerce website for handmade crochet products.

Stack
-----

- Frontend: React + Vite, Tailwind CSS, React Router DOM, Axios, Context API, Framer Motion
- Backend: Node.js, Express.js, MongoDB with Mongoose, JWT auth, bcrypt, Multer (image upload)

Project Structure
-----------------

- `frontend/` — React app
- `backend/` — Express API server

Prerequisites
-------------

- Node.js 18+
- MongoDB running locally (or a MongoDB URI)

Setup
-----

1) Backend

- Copy `backend/.env.example` to `backend/.env` and update values.
- Install deps:

```bash
cd backend
npm install
```

- (Optional) Seed example categories/products:

```bash
npm run seed
```

- Start API:

```bash
npm run dev
```

API will run at `http://localhost:5000`. Health check: `GET /api/health`.

2) Frontend

- Copy `frontend/.env.example` to `frontend/.env` (optional). By default API is at `http://localhost:5000/api`.
- Install deps:

```bash
cd ../frontend
npm install
```

- Start dev server:

```bash
npm run dev
```

Frontend runs at `http://localhost:5173`.

Default Routes
--------------

Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

Products

- `GET /api/products` (search/filter: `search`, `category`, `minPrice`, `maxPrice`, `sort`, `page`, `limit`)
- `GET /api/products/:id`
- `POST /api/products` (admin)
- `PUT /api/products/:id` (admin)
- `DELETE /api/products/:id` (admin)

Orders

- `POST /api/orders` (user)
- `GET /api/orders/user` (user)
- `GET /api/orders/admin` (admin)
- `PUT /api/admin/orders/:id/status` (admin)

Categories

- `GET /api/categories`
- `POST /api/categories` (admin)
- `PUT /api/categories/:id` (admin)
- `DELETE /api/categories/:id` (admin)

Upload

- `POST /api/upload` (admin) — form-data `image` → returns `{ url }`

Admin notes
-----------

- First registered user becomes admin automatically (for convenience in local dev).
- Admin dashboard shows counts for products, orders, and users.
- Use the admin area to add products, upload images, manage orders/users.

Design
------

- Soft pastels (cream, beige, blush, sage), rounded cards, gentle shadows.
- Motion via Framer Motion on hero and product cards.
- Mobile responsive with Tailwind CSS.

Scripts
-------

- Backend
  - `npm run dev` — start API with nodemon
  - `npm run seed` — seed example data
- Frontend
  - `npm run dev` — start Vite dev server
  - `npm run build` — build production assets
  - `npm run preview` — preview production build

License
-------

MIT
