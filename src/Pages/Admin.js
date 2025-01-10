import React, { useState } from 'react';
import axios from 'axios';
import './Admin.css';
import { menu_list } from '../assets/frontend_assets/assets';

const Admin = () => {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: '',
        description: '',
        image: null
    });
    const [message, setMessage] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        setFormData(prev => ({
            ...prev,
            image: e.target.files[0]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('price', formData.price);
        formDataToSend.append('category', formData.category);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('image', formData.image);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:5000/api/admin/menu', 
                formDataToSend,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            setMessage('Menu item added successfully!');
            setFormData({
                name: '',
                price: '',
                category: '',
                description: '',
                image: null
            });
        } catch (error) {
            setMessage('Error adding menu item');
            console.error('Error:', error);
        }
    };

    return (
        <div className="admin-container">
            <h2>Add New Menu Item</h2>
            {message && <div className="message">{message}</div>}
            <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-group">
                    <label htmlFor="name">Item Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="price">Price:</label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="category">Category:</label>
                    <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Select Category</option>
                        {menu_list.map((menu, index) => (
                            <option key={index} value={menu.menu_name}>
                                {menu.menu_name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="image">Image:</label>
                    <input
                        type="file"
                        id="image"
                        name="image"
                        onChange={handleImageChange}
                        accept="image/*"
                        required
                    />
                </div>

                <button type="submit" className="submit-btn">Add Item</button>
            </form>
        </div>
    );
};

export default Admin;
