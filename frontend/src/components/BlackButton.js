import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import './BlackButton.css';

const BlackButton = ({ text, to, onClick }) => {
    const navigate = useNavigate(); 

    const handleClick = () => {
        if (to) {
            navigate(to); 
        }
        if (onClick) {
            onClick(); 
        }
    };

    return (
        <button className="black-button" onClick={handleClick}>
            {text}
        </button>
    );
};

export default BlackButton;
