import React from 'react';

const DishCard = ({ dish }) => {
    return (
        <div className="dish-card">
            <img src={dish.image} alt={dish.name} />
            <h3>{dish.name}</h3>
            <p>{dish.description}</p>
            <p>Price: ${dish.price}</p>
        </div>
    );
};

export default DishCard;
