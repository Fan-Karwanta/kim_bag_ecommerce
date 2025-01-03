// Cart.js
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../../components/CustomerNavbar";
import CartDisplay from "../../components/CartDisplay";
import { useUser } from "../../context/UserContext";
import axios from "axios";

function Cart() {
  const { userEmail } = useUser();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkoutMessage, setCheckoutMessage] = useState("");

  useEffect(() => {
    console.log("userEmail:", userEmail);
    if (!userEmail) return;

    const fetchCartBags = async () => {
      try {
        const res = await axios.get(`http://localhost:8800/cart/${userEmail}`);
        console.log("Cart response:", res.data);
        if (res.data && res.data.success) {
          setCartItems(res.data.data);
        } else {
          console.error("Unexpected response structure:", res.data);
        }
      } catch (err) {
        console.error("Error fetching cart bags:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCartBags();
  }, [userEmail]);

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <h1>Cart</h1>
        {loading ? (
          <p>Loading cart...</p>
        ) : (
          <>
            <CartDisplay
              email={userEmail}
              cartItems={cartItems}
              setCartItems={setCartItems}
            />
            {checkoutMessage && <p className="mt-3">{checkoutMessage}</p>}
          </>
        )}
      </div>
    </div>
  );
}

export default Cart;