// src/pages/RegisterPage.js

import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import './LoginPage.css'; // Using the same CSS file as the login page
import BlackButton from '../components/BlackButton';
import registerImage from '../Assets/register_foto.jpg'; // Ensure this image exists or use the same as login

// Importing icons from react-icons
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        firstname: '',
        lastname: '',
        email: '',
        password: '',
    });

    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/register', formData);
            alert('User registered successfully!');
            navigate('/login'); // Redirect to login page after successful registration
        } catch (error) {
            console.error('Error registering user:', error);
            alert('Error registering user. Please check your data and try again.');
        }
    };

    // Function to toggle password visibility
    const toggleShowPassword = () => {
        setShowPassword(prevState => !prevState);
    };

    return (
        <div className="login-container"> {/* Reusing the same container class */}
            <form className="login-form register-form" onSubmit={handleRegister}> {/* Adding a specific class if needed */}
                <h1>Register</h1>
                <p>Create your account</p>
                
                {/* Username Field with Icon */}
                <div className="input-group">
                    <FaUser className="input-icon" />
                    <input
                        className="input-field"
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* First Name Field with Icon */}
                <div className="input-group">
                    <FaUser className="input-icon" />
                    <input
                        className="input-field"
                        type="text"
                        name="firstname"
                        placeholder="First Name"
                        value={formData.firstname}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Last Name Field with Icon */}
                <div className="input-group">
                    <FaUser className="input-icon" />
                    <input
                        className="input-field"
                        type="text"
                        name="lastname"
                        placeholder="Last Name"
                        value={formData.lastname}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Email Field with Icon */}
                <div className="input-group">
                    <FaEnvelope className="input-icon" />
                    <input
                        className="input-field"
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Password Field with Icon and Toggle Button */}
                <div className="input-group">
                    <FaLock className="input-icon" />
                    <input
                        className="input-field"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <button
                        type="button"
                        className="password-toggle-button"
                        onClick={toggleShowPassword}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? <FaEye /> : <FaEyeSlash />}
                    </button>
                </div>

                {/* Register Button */}
                <BlackButton type="submit" text="Register" />

                {/* Link to Login */}
                <div className="register-link">
                    <p>Already have an account? <Link to="/login">Login here</Link></p>
                </div>
            </form>

            {/* Right Side Image */}
            <div className="right-image">
                <img src={registerImage} alt="Decorative right side" /> {/* Ensure this image exists */}
            </div>
        </div>
    );
};

export default RegisterPage;
