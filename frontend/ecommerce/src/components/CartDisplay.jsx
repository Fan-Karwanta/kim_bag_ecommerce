// CartDisplay.js
import React, { useState, useEffect } from "react";

function CartDisplay({ email, cartItems, setCartItems }) {
  const [selectedItems, setSelectedItems] = useState([]);
  const [currentItems, setCurrentItems] = useState([]);
  const [checkoutMessage, setCheckoutMessage] = useState(""); // Add this line

  useEffect(() => {
    setCurrentItems(cartItems || []);
  }, [cartItems]);

  const handleCheckboxChange = (prod_name) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(prod_name)
        ? prevSelected.filter((item) => item !== prod_name)
        : [...prevSelected, prod_name]
    );
  };

  const onIncrement = async (prod_name) => {
    try {
      const response = await fetch("http://localhost:8800/cart/increment", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prod_name, email }),
      });

      const data = await response.json();
      if (data.success) {
        setCurrentItems((prevItems) =>
          prevItems.map((item) =>
            item.prod_name === prod_name
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.prod_name === prod_name
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
      }
    } catch (error) {
      console.error("Error incrementing:", error);
    }
  };

  const onDecrement = async (prod_name) => {
    try {
      const response = await fetch("http://localhost:8800/cart/decrement", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prod_name, email }),
      });

      const data = await response.json();
      if (data.success) {
        setCurrentItems((prevItems) =>
          prevItems.map((item) =>
            item.prod_name === prod_name
              ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
              : item
          )
        );
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.prod_name === prod_name
              ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
              : item
          )
        );
      }
    } catch (error) {
      console.error("Error decrementing:", error);
    }
  };

  const handleCheckout = async () => {
    if (selectedItems.length === 0) {
      alert("Please select items to checkout");
      return;
    }
  
    try {
      // Show loading state
      setCheckoutMessage("Processing your order...");
  
      const response = await fetch("http://localhost:8800/checkout", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          // Add any auth headers if needed
        },
        body: JSON.stringify({ 
          email, 
          selectedItems 
        }),
      });
  
      const data = await response.json();
  
      if (!data.success) {
        throw new Error(data.message || "Checkout failed");
      }
  
      // Clear selected items
      setSelectedItems([]);
      
      // Show success message
      alert(`Order placed successfully! Order ID: ${data.orderId}`);
      
      // Refresh cart
      const cartResponse = await fetch(`http://localhost:8800/cart/${email}`);
      const cartData = await cartResponse.json();
      
      if (cartData.success) {
        setCartItems(cartData.data);
      }
  
    } catch (error) {
      console.error("Checkout error:", error);
      alert(error.message || "Failed to complete checkout");
    } finally {
      setCheckoutMessage("");
    }
  };
  

  const onRemove = async (prod_name) => {
    try {
      const response = await fetch(`http://localhost:8800/cart/${prod_name}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      if (data.success) {
        setCurrentItems((prevItems) =>
          prevItems.filter((item) => item.prod_name !== prod_name)
        );
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.prod_name !== prod_name)
        );
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  if (!currentItems || currentItems.length === 0) {
    return <p className="text-center mt-3">No items in your cart.</p>;
  }

  return (
    <div className="cart-items">
      {currentItems.map((item) => (
        <div
          key={item.cart_id}
          className="d-flex justify-content-between align-items-center border rounded p-3 mb-3"
          style={{
            borderColor: selectedItems.includes(item.prod_name) ? "#eab676" : "#dee2e6",
            borderWidth: selectedItems.includes(item.prod_name) ? "2px" : "1px",
            transition: "border-color 0.2s ease, border-width 0.2s ease",
            backgroundColor: selectedItems.includes(item.prod_name) ? "#eab676" : "transparent"
          }}
        >
          <input
            type="checkbox"
            checked={selectedItems.includes(item.prod_name)}
            onChange={() => handleCheckboxChange(item.prod_name)}
          />
          <img
            src={`http://localhost:8800${item.image}`}
            alt={item.prod_name}
            style={{
              width: "auto",
              height: "auto",
              maxWidth: "100px",
              maxHeight: "100px",
              marginLeft: 10,
            }}
          />
          <div className="flex-grow-1 m-4">
            <p className="m-0 fw-bold">{item.prod_name}</p>
            <p className="m-0">Price: ₱{item.price}</p>
          </div>
          <div className="d-flex align-items-center gap-2">
            <button
              onClick={() => onDecrement(item.prod_name)}
              className="btn btn-outline-dark btn-sm rounded-circle"
              style={{ width: "30px", height: "30px" }}
            >
              -
            </button>
            <p className="m-0">{item.quantity}</p>
            <button
              onClick={() => onIncrement(item.prod_name)}
              className="btn btn-outline-dark btn-sm rounded-circle"
              style={{ width: "30px", height: "30px" }}
            >
              +
            </button>
          </div>
          <button
            onClick={() => onRemove(item.prod_name)}
            className="btn btn-danger rounded-pill ms-3"
          >
            Remove
          </button>
        </div>
      ))}

      <div className="d-flex justify-content-end mt-3">
        <button
          onClick={handleCheckout}
          className="btn btn-primary"
          disabled={selectedItems.length === 0}
        >
          Checkout Selected Items ({selectedItems.length})
        </button>
      </div>
    </div>
  );
}

export default CartDisplay;