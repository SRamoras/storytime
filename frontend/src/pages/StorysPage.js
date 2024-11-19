import React, { useEffect, useState } from 'react';
import api from '../services/api';

const HomePage = () => {
    const [stories, setStories] = useState([]);

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const response = await api.get('/auth/stories');
                setStories(response.data);
            } catch (error) {
                alert('Erro ao carregar histórias.');
            }
        };

        fetchStories();
    }, []);

    return (
        <div>
            <h1>Histórias</h1>
            <ul>
                {stories.map((story) => (
                    <li key={story.id}>
                        <h3>{story.title}</h3>
                        <p>{story.content}</p>
                        <small>Por: {story.username}</small>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default HomePage;
