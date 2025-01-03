import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext"; // Import the UserProvider to wrap the app
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminAdd from "./pages/admin/AdminAdd";
import AdminUpdate from "./pages/admin/AdminUpdate";
import AdminOrder from "./pages/admin/AdminOrder";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import CustomerMarketplace from "./pages/customer/Marketplace";
import Cart from "./pages/customer/Cart";
import Profile from "./pages/customer/Profile";
import CartDisplay from "./components/CartDisplay";

// import "./style.css";

function App() {
  return (
    <div className="App">
      <UserProvider>
        <BrowserRouter>
          <Routes>
            {/* ADMIN */}
            <Route path="/" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="/add_bag" element={<AdminAdd />} />
            <Route path="/update_bag/:id" element={<AdminUpdate />} />
            <Route path="/orders" element={<AdminOrder />} />

            {/* CUSTOMER */}
            <Route path="/marketplace" element={<CustomerMarketplace />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/profile" element={<Profile />} />

            <Route path="/customer-card-bag" element={<CartDisplay />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </div>
  );
}

export default App;
