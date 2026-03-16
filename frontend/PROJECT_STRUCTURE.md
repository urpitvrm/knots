# CozyLoops Frontend – Project Structure

## Tech stack

- **React** (Vite)
- **Tailwind CSS**
- **React Router DOM**
- **Axios**
- **Framer Motion**

---

## Directory structure

```
src/
├── components/           # Reusable UI
│   ├── ui/               # Primitive / layout components
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Card.jsx
│   │   ├── PageHeading.jsx
│   │   ├── LoadingSpinner.jsx
│   │   └── EmptyState.jsx
│   ├── admin/            # Admin-only components
│   │   ├── ConfirmationModal.jsx
│   │   ├── DashboardCards.jsx
│   │   ├── ProductsTable.jsx
│   │   ├── OrdersTable.jsx
│   │   └── UsersTable.jsx
│   ├── AdminRoute.jsx    # Route guard (admin only)
│   ├── ProtectedRoute.jsx
│   ├── ProductCard.jsx
│   ├── Navbar.jsx
│   └── Footer.jsx
├── context/
│   ├── AuthContext.jsx
│   └── CartContext.jsx
├── layouts/
│   ├── MainLayout.jsx    # Navbar + main + Footer, uses Outlet
│   └── AdminLayout.jsx   # Sidebar + content for /admin/*
├── pages/
│   ├── Home.jsx
│   ├── Shop.jsx
│   ├── ProductDetails.jsx
│   ├── About.jsx
│   ├── Contact.jsx
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── Cart.jsx
│   ├── Checkout.jsx
│   ├── CheckoutSuccess.jsx
│   ├── MyOrders.jsx
│   ├── Profile.jsx
│   └── admin/
│       ├── Dashboard.jsx
│       ├── ManageProducts.jsx
│       ├── AddProduct.jsx
│       ├── EditProduct.jsx
│       ├── ManageOrders.jsx
│       └── ManageUsers.jsx
├── services/
│   └── api.js            # Axios instance + auth header
├── utils/
│   ├── imageUrl.js       # getImageUrl() for upload paths
│   └── motion.js         # Framer Motion variants
├── App.jsx
├── main.jsx
└── index.css             # Tailwind + custom utilities
```

---

## Routing

- **MainLayout** wraps all public and user routes (Navbar + Footer). Nested routes render via `<Outlet />`.
- **ProtectedRoute** wraps cart, checkout, orders, profile (auth required).
- **AdminRoute** wraps `/admin/*` (admin role required). Admin pages use **AdminLayout** (sidebar + content), no Navbar/Footer.

---

## Styling

- **Tailwind** with custom theme in `tailwind.config.js`: `cream`, `beige`, `blush`, `sage`, `deep`, `accent`; `font-display` (Quicksand), `font-body` (Inter); `shadow-soft`, `rounded-2xl`.
- **index.css**: `@tailwind` layers + `.card`, `.btn`, `.btn-secondary`.
- **Framer Motion**: page transitions in MainLayout; staggered lists and hover/tap on Navbar, cards, buttons; shared variants in `utils/motion.js`.

---

## Key components

| Component        | Purpose                                      |
|-----------------|----------------------------------------------|
| **Button**      | Primary/secondary/outline, loading, motion   |
| **Input**       | Label, error, consistent focus ring         |
| **Card**        | Rounded card with optional hover animation  |
| **PageHeading** | Title + subtitle + optional action          |
| **LoadingSpinner** | Centered spinner, sm/md/lg               |
| **EmptyState**  | Message + optional CTA link                 |
| **ProductCard** | Shop grid item with image, name, price, link |
| **getImageUrl()** | Resolves `/uploads/...` to API origin URL |
