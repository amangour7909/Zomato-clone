import React, { useState } from 'react';
import { food_list } from '../assets/frontend_assets/assets';
import './FoodItems.css';

const FoodItems = ({ cart, setCart, selectedCategory }) => {
    const filteredFoodList = selectedCategory === "All"
        ? food_list
        : food_list.filter(food => food.category === selectedCategory);

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

    return (
        <div className="food-items-container">
            {filteredFoodList.map((food) => (
                <div className="food-item" key={food._id}>
                    <img src={food.image} alt={food.name} className="food-image" />
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
            ))}
        </div>
    );
};

export default FoodItems;
