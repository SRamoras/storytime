// pages/Story.js

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import './Story.css'; // Crie um arquivo CSS para estilização específica

const Story = () => {
    const { id } = useParams(); // Obter o ID da história a partir da URL
    const [story, setStory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStory = async () => {
            try {
                const response = await api.get(`/auth/stories/id/${id}`);
                setStory(response.data);
            } catch (err) {
                console.error('Erro ao buscar história:', err);
                setError('Falha ao carregar a história.');
            } finally {
                setLoading(false);
            }
        };

        fetchStory();
    }, [id]);

    if (loading) {
        return <p>Carregando história...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!story) {
        return <p>História não encontrada.</p>;
    }

    return (
        <div className="story-page">
            <h1>{story.title}</h1>
            {story.img && (
                <div className="story-image-container">
                    <img src={story.img} alt={story.title} />
                </div>
            )}
            <p className="story-content">{story.content}</p>
            <p><strong>Categoria:</strong> {story.category}</p>
            <small>Por: {story.username}</small>
        </div>
    );
};

export default Story;
