// src/pages/Story.js

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
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
    const baseImageUrl = process.env.REACT_APP_BASE_IMAGE_URL || 'https://storytime-backend-f240.onrender.com/uploads/';
    const imgSrc = story.img ? `${baseImageUrl}${story.img}` : '';

    // Construir o caminho completo da imagem de perfil do autor, se aplicável
    const profileImageSrc = story.profile_image ? `${baseImageUrl}${story.profile_image}` : 'https://www.gravatar.com/avatar/?d=mp&f=y';

    return (
        <div>
            {story.img && (
                <div className="story-image-container-story-page">
                    <img 
                        src={imgSrc} 
                        alt={story.title} 
                        onError={(e) => { e.target.src = `${baseImageUrl}default-image.jpg`; }} // Imagem de fallback
                        loading="lazy"
                    />
                </div>
            )}
            <div className="story-page">
                <div className='main-container-story'>
                    <div className='intro-container'>
                        <div className='intro-container-main-text'>
                            <h1>{story.title}</h1>    
                            <p>
                                <Link 
                                    to={`/StorysPage?category=${encodeURIComponent(story.category)}`} 
                                    className='category-link'
                                >
                                    {story.category}
                                </Link>
                            </p>
                            <small>
                                Made by:{' '}
                                <Link to={`/profile/${story.username}`} className='author-link'>
                                    {story.username}
                                </Link>
                            </small>    
                        </div> 
                    </div>
                    <p className="story-content">{story.content}</p>
                </div>
            </div>
        </div>
    );
};  

export default Story;
