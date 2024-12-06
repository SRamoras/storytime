// src/components/CardComponent.js

import React from 'react';

const CardComponent = ({ data }) => {
    if (!data) {
        return null; // Não renderiza se não houver dados
    }

    const { firstname, lastname, email, /* outros campos */ } = data;

    return (
        <div className="card">
            <h2>{firstname} {lastname}</h2>
            <p>Email: {email}</p>
            {/* Renderize outros dados conforme necessário */}
        </div>
    );
};

export default CardComponent;
