import React from 'react';
import { Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import CheckoutSuccess from './pages/CheckoutSuccess';
import MyOrders from './pages/MyOrders';
import Profile from './pages/Profile';
import Wishlist from './pages/Wishlist';
import CustomOrder from './pages/CustomOrder';
import Gallery from './pages/Gallery';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Dashboard from './pages/admin/Dashboard';
import ManageProducts from './pages/admin/ManageProducts';
import AddProduct from './pages/admin/AddProduct';
import EditProduct from './pages/admin/EditProduct';
import ManageOrders from './pages/admin/ManageOrders';
import ManageUsers from './pages/admin/ManageUsers';
import ManageCoupons from './pages/admin/ManageCoupons';
import ChatDashboard from './pages/admin/ChatDashboard';
import ManageCustomOrders from './pages/admin/ManageCustomOrders';
import ManageBundles from './pages/admin/ManageBundles';

export default function App() {
  return (
    <Routes>
      {/* Public + user: wrapped with Navbar + Footer */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/checkout/success" element={<CheckoutSuccess />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/custom-order" element={<CustomOrder />} />
        </Route>
      </Route>
      {/* Admin */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/products" element={<ManageProducts />} />
        <Route path="/admin/products/add" element={<AddProduct />} />
        <Route path="/admin/products/:id/edit" element={<EditProduct />} />
        <Route path="/admin/orders" element={<ManageOrders />} />
        <Route path="/admin/users" element={<ManageUsers />} />
        <Route path="/admin/coupons" element={<ManageCoupons />} />
        <Route path="/admin/chats" element={<ChatDashboard />} />
        <Route path="/admin/custom-orders" element={<ManageCustomOrders />} />
        <Route path="/admin/bundles" element={<ManageBundles />} />
      </Route>
    </Routes>
  );
}
