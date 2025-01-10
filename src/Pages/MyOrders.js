import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MyOrders.css';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/signin');
            return;
        }

        const fetchOrders = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/orders', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch orders');
                }

                const data = await response.json();
                setOrders(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching orders:', error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchOrders();
    }, [token, navigate]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="orders-container">
            <h2>My Orders</h2>
            {orders.length === 0 ? (
                <p>No orders found</p>
            ) : (
                orders.map((order) => (
                    <div key={order._id} className="order-card">
                        <div className="order-header">
                            <h3>Order ID: {order._id}</h3>
                            <p>Date: {new Date(order.created_at).toLocaleDateString()}</p>
                            <p>Status: <span className={`status-${order.status.toLowerCase()}`}>{order.status}</span></p>
                        </div>
                        <table className="order-items-table">
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items.map((item, idx) => (
                                    <tr key={idx}>
                                        <td>{item.name}</td>
                                        <td>{item.quantity}</td>
                                        <td>${item.price}</td>
                                        <td>${item.total}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="order-summary">
                            <p>Delivery Fee: ${order.delivery_fee}</p>
                            <p>Total Amount: ${order.total_amount}</p>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default MyOrders;
