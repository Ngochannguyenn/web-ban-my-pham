import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import './App.css';
import { CartProvider } from './context/CartContext';

// Admin pages
import AdminDashboard from './pages/admin/dashboard';
import AdminCategories from './pages/admin/categories';
import AdminProducts from './pages/admin/products';
import AdminOrders from './pages/admin/orders';
import AdminCustomers from './pages/admin/customers';

// Customer pages
import Home from './pages/customer/home';
import Products from './pages/customer/products';
import Cart from './pages/customer/cart';
import Checkout from './pages/customer/checkout';
import Profile from './pages/customer/profile';
import Register from './pages/customer/profile/register';
import Login from './pages/customer/profile/login';
import ProductDetail from './pages/customer/products/detail';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import CustomerLayout from './layouts/CustomerLayout';

function App() {
  return (
    <ConfigProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* Admin routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="customers" element={<AdminCustomers />} />
            </Route>

            {/* Customer routes */}
            <Route path="/" element={<CustomerLayout />}>
              <Route index element={<Home />} />
              <Route path="products" element={<Products />} />
              <Route path="products/:id" element={<ProductDetail />} />
              <Route path="cart" element={<Cart />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="profile" element={<Profile />} />
              <Route path="register" element={<Register />} />
              <Route path="login" element={<Login />} />
            </Route>
          </Routes>
        </Router>
      </CartProvider>
    </ConfigProvider>
  );
}

export default App;
