import React, { useState } from 'react';
import api from '../services/api';
import './RegisterPage.css';
const RegisterPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        firstname: '',
        lastname: '',
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/register', formData);
            alert('Usuário registrado com sucesso!');
        } catch (error) {
            alert('Erro ao registrar o usuário.');
        }
    };

    return (
        <div className="register-container">
            <form className="register-form" onSubmit={handleRegister}>
                <h1>Registro</h1>
                <input
                    className="input-field"
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                />
                <input
                    className="input-field"
                    type="text"
                    name="firstname"
                    placeholder="First Name"
                    value={formData.firstname}
                    onChange={handleChange}
                />
                <input
                    className="input-field"
                    type="text"
                    name="lastname"
                    placeholder="Last Name"
                    value={formData.lastname}
                    onChange={handleChange}
                />
                <input
                    className="input-field"
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                />
                <input
                    className="input-field"
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                />
                <button className="button-black" type="submit">Registrar</button>
                <div>
                <p>Don have an account?   <a href="/login">Login here</a></p>
             
            </div> 
            </form>
        </div>
    );
};
export default RegisterPage;
