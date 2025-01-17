import React, { useState, useEffect } from 'react';
import './FoodItems.css';

const FoodItems = ({ cart, setCart, selectedCategory }) => {
    const [foodItems, setFoodItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFoodItems = async () => {
            try {
                const url = `http://localhost:5000/api/menu${selectedCategory !== "All Items" ? `?category=${selectedCategory}` : ''}`;
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Failed to fetch menu items');
                }
                const data = await response.json();
                setFoodItems(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchFoodItems();
    }, [selectedCategory]);

    const addToCart = (food) => {
        setCart((prevCart) => ({
            ...prevCart,
            [food._id]: (prevCart[food._id] || 0) + 1,
        }));
    };

    const removeFromCart = (food) => {
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

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="food-items-container">
            {foodItems.length === 0 ? (
                <div className="no-items">No items found in this category</div>
            ) : (
                foodItems.map((food) => (
                    <div className="food-item" key={food._id}>
                        <img 
                            src={`http://localhost:5000${food.image_url}`} 
                            alt={food.name} 
                            className="food-image" 
                        />
                        <h3>{food.name}</h3>
                        <p>{food.description}</p>
                        <p className="food-price">${food.price}</p>
                        <div className="food-item-actions">
                            <button onClick={() => addToCart(food)}>+</button>
                            {cart[food._id] && (
                                <>
                                    <span>{cart[food._id]}</span>
                                    <button onClick={() => removeFromCart(food)}>-</button>
                                </>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default FoodItems;
