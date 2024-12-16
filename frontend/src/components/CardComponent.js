

import React from 'react';

const CardComponent = ({ data }) => {
    if (!data) {
        return null; 
    }

    const { firstname, lastname, email, } = data;

    return (
        <div className="card">
            <h2>{firstname} {lastname}</h2>
            <p>Email: {email}</p>
            {/* Renderize outros dados conforme necessário */}
        </div>
    );
};

export default CardComponent;
