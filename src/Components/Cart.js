import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = ({ cart, setCart }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/menu');
                const menuItems = await response.json();
                
                const items = Object.keys(cart).map(id => {
                    const item = menuItems.find(menuItem => menuItem._id === id);
                    return item ? { ...item, quantity: cart[id] } : null;
                }).filter(item => item !== null);

                setCartItems(items);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching cart items:', error);
                setLoading(false);
            }
        };

        fetchCartItems();
    }, [cart]);

    const increaseQuantity = (food) => {
        setCart((prevCart) => ({
            ...prevCart,
            [food._id]: (prevCart[food._id] || 0) + 1,
        }));
    };

    const decreaseQuantity = (food) => {
        setCart((prevCart) => {
            const newCart = { ...prevCart };
            if (newCart[food._id] > 1) {
                newCart[food._id] -= 1;
            } else {
                delete newCart[food._id];
            }
            return newCart;
        });
    };

    const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const deliveryFee = 10;
    const grandTotal = totalAmount + deliveryFee;

    const handleCheckout = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/signin');
            return;
        }
        navigate('/payment', { 
            state: { 
                cartItems,
                totalAmount,
                deliveryFee,
                grandTotal
            }
        });
    };

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className="cart-container">
            <h2>Cart</h2>
            {cartItems.length === 0 ? (
                <p>Your cart is empty</p>
            ) : (
                <>
                    <table className="cart-table">
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Title</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Total</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map((item) => (
                                <tr key={item._id}>
                                    <td><img src={`http://localhost:5000${item.image_url}`} alt={item.name} className="cart-item-image" /></td>
                                    <td>{item.name}</td>
                                    <td>${item.price}</td>
                                    <td>{item.quantity}</td>
                                    <td>${item.price * item.quantity}</td>
                                    <td>
                                        <button onClick={() => increaseQuantity(item)}>+</button>
                                        <button onClick={() => decreaseQuantity(item)}>-</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="cart-summary">
                        <p>Cart Total: ${totalAmount}</p>
                        <p>Delivery Fee: ${deliveryFee}</p>
                        <p>Grand Total: ${grandTotal}</p>
                        <button 
                            className="checkout-btn" 
                            onClick={handleCheckout}
                            disabled={cartItems.length === 0}
                        >
                            {cartItems.length === 0 ? 'Cart is Empty' : 'Proceed to Checkout'}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;
