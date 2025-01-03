import React, { useState, useEffect } from "react";
import Navbar from "../../components/AdminNavbar";
import AdminOrderCard from "../../components/AdminOrderCard";

const AdminOrder = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        // Fetch orders from the API
        const fetchOrders = async () => {
            try {
                const response = await fetch("http://localhost:8800/all_orders");
                const data = await response.json();

                if (data.success) {
                    setOrders(data.data);
                } else {
                    console.error("Failed to fetch orders:", data.message);
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };

        fetchOrders();
    }, []);

    return (
        <div>
            <Navbar />
            <div className="m-5">
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <div className="h2 mb-0">Manage Orders</div>
                </div>
                <div>
                    {orders.length > 0 ? (
                        orders.map((order) => (
                            <AdminOrderCard key={order.orderId} order={order} />
                        ))
                    ) : (
                        <div>No orders available.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminOrder;
