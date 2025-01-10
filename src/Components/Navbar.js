import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { assets } from '../assets/frontend_assets/assets';
import './Navbar.css';

const Navbar = ({ cart }) => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/signin');
    };

    return (
        <nav className="navbar">
            <Link to="/" className="nav-logo">
                <img src={assets.logo} alt="Logo" />
            </Link>
            <div className="nav-links">
                {token ? (
                    <>
                        <Link to="/my-orders">
                            <img src={assets.parcel_icon} alt="Orders" />
                            My Orders
                        </Link>
                        <Link to="/admin">
                            <img src={assets.profile_icon} alt="Admin" />
                            Admin
                        </Link>
                        <Link to="/cart">
                            <img src={assets.bag_icon} alt="Cart" />
                            Cart {Object.keys(cart || {}).length > 0 && `(${Object.keys(cart).length})`}
                        </Link>
                        <button onClick={handleLogout} className="logout-btn">
                            <img src={assets.logout_icon} alt="Logout" />
                            Logout
                        </button>
                    </>
                ) : (
                    <Link to="/signin">
                        <img src={assets.profile_icon} alt="Sign In" />
                        Sign In
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;