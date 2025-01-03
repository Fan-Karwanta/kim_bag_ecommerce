import React, { useState } from "react";
import "./AdminOrderCard.css"; 

const AdminOrderCard = ({ order }) => {
    const [status, setStatus] = useState(order.orderStatus || "Pending");
    const [loading, setLoading] = useState(false); 

    const handleStatusChange = async (newStatus, event) => {
        event.preventDefault();
        setStatus(newStatus);
        setLoading(true); 
        
        try {
            const response = await fetch("http://localhost:8800/update_order_status", {
                method: "PUT", 
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    orderId: order.orderId, 
                    status: newStatus,
                }),
            });

            const data = await response.json();

            if (!data.success) {
                console.error("Failed to update order status:", data.message);
                alert("Failed to update order status");
            }
        } catch (error) {
            console.error("Error updating order status:", error);
            alert("An error occurred while updating the order status");
        } finally {
            setLoading(false); 
        }
    };

    return (
        <div className="order-card mb-3">
            <div className="order-details">
                <div className="order-id">
                    <strong>Order ID: </strong> {order.orderId}
                </div>
                <div className="total-price">
                    <strong>Total Price: </strong> ₱{order.totalPrice.toFixed(2)}
                </div>
            </div>

            <div className="order-details">
                <div className="customer-name">
                    <strong>Customer Name:</strong> {order.customerName}
                </div>
                <div className="address">
                    <strong>Address:</strong>
                    <p>{order.address}</p>
                </div>
            </div>

            <div className="order-details">
                <div className="purchases">
                    <strong>Purchases:</strong>
                    <ul>
                        {order.items.map((item, index) => (
                            <li key={index}>
                                {item.prod_name} (x{item.quantity}) - ₱{item.price.toFixed(2)}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="order-details">
                <div className="order-status">
                    <div className="btn-group">
                        <button
                            type="button"
                            className="btn btn-primary dropdown-toggle"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                            disabled={loading} // Disable button when loading
                        >
                            {loading ? "Updating..." : status} {/* Show loading text if updating */}
                        </button>
                        <ul className="dropdown-menu">
                            {["Pending", "Preparing", "Shipped", "Delivered"].map(
                                (statusOption) => (
                                    <li key={statusOption}>
                                        <a
                                            className="dropdown-item"
                                            href="#"
                                            onClick={(e) => handleStatusChange(statusOption, e)} // Prevent default on click
                                        >
                                            {statusOption}
                                        </a>
                                    </li>
                                )
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOrderCard;
