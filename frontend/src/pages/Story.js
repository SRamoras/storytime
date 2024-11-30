// src/pages/Story.js

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import './Story.css'; // Certifique-se de que o caminho está correto

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

    // Use a variável de ambiente para a URL base
    const baseImageUrl = process.env.REACT_APP_BASE_IMAGE_URL || 'http://localhost:5000/uploads/';
    const imgSrc = story.img ? `${baseImageUrl}${story.img}` : '';

    return (
        <div className="story-page">
            <div className='main-container-story'>
                <div className='intro-container'>
                    <div>
                        <h1>{story.title}</h1>    
                        <p><strong>Categoria:</strong> {story.category}</p>
                        <small>Feita por: {story.username}</small>    
                    </div>   

                    {story.img && (
                        <div className="story-image-container">
                            <img 
                                src={imgSrc} 
                                alt={story.title} 
                                onError={(e) => { e.target.src = `${baseImageUrl}default-image.jpg`; }} // Imagem de fallback
                                loading="lazy"
                            />
                        </div>
                    )}
                </div>
                <p className="story-content">{story.content}</p>
            </div>
        </div>
    );
};

export default Story;
