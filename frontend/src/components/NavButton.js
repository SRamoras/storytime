import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NavButton.css';

const NavButton = ({ text, to }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (to) {
            navigate(to);
        }
    };

    return (
        <button className="nav-button" onClick={handleClick}>
            {text}
        </button>
    );
};

export default NavButton;
