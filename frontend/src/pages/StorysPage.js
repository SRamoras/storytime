// pages/HomePage.js

import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './StorysPage.css'; // Certifique-se de que o CSS está importado

const HomePage = () => {
    const [stories, setStories] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('Todas');
    const [sortOrder, setSortOrder] = useState(null); // 'asc' ou 'desc'
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch all stories from the API
    useEffect(() => {
        const fetchStories = async () => {
            try {
                const response = await api.get('/auth/stories_all'); // Atualizado para a nova rota
                setStories(response.data);

                // Extrair categorias únicas
                const uniqueCategories = ['Todas', ...new Set(response.data.map(story => story.category))];
                setCategories(uniqueCategories);
            } catch (error) {
                console.error('Erro ao carregar histórias:', error);
                setError('Erro ao carregar histórias.');
            } finally {
                setLoading(false);
            }
        };

        fetchStories();
    }, []);

    // Função para lidar com a seleção de categoria
    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
    };

    // Função para lidar com a ordenação
    const handleSort = (order) => {
        setSortOrder(order);
    };

    // Função para lidar com a barra de pesquisa
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    // Computar as histórias filtradas e ordenadas
    const displayedStories = useMemo(() => {
        let filtered = [...stories];

        // Filtrar por categoria
        if (selectedCategory !== 'Todas') {
            filtered = filtered.filter(story => story.category === selectedCategory);
        }

        // Filtrar por termo de pesquisa
        if (searchTerm.trim() !== '') {
            const lowerSearch = searchTerm.toLowerCase();
            filtered = filtered.filter(story =>
                story.title.toLowerCase().includes(lowerSearch) ||
                story.content.toLowerCase().includes(lowerSearch)
            );
        }

        // Ordenar
        if (sortOrder === 'asc') {
            filtered.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortOrder === 'desc') {
            filtered.sort((a, b) => b.title.localeCompare(a.title));
        }

        return filtered;
    }, [stories, selectedCategory, sortOrder, searchTerm]);

    if (loading) {
        return (
            <div className="spinner-container">
                <div className="spinner"></div>
                <p>Carregando histórias...</p>
            </div>
        );
    }

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    return (
        <div className="home-page">
            <h1>Todas as Histórias</h1>

            {/* Seção de Filtros e Ordenação */}
            <div className="filters-container">
                {/* Filtros por Categoria */}
                <div className="category-filters">
                    {categories.map((category, index) => (
                        <button
                            key={index}
                            className={`filter-button ${selectedCategory === category ? 'active' : ''}`}
                            onClick={() => handleCategoryClick(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Ordenação Alfabética */}
                <div className="sort-buttons">
                    <button
                        className={`sort-button ${sortOrder === 'asc' ? 'active' : ''}`}
                        onClick={() => handleSort('asc')}
                    >
                        A-Z
                    </button>
                    <button
                        className={`sort-button ${sortOrder === 'desc' ? 'active' : ''}`}
                        onClick={() => handleSort('desc')}
                    >
                        Z-A
                    </button>
                </div>

                {/* Barra de Pesquisa */}
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Pesquisar histórias..."
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>
            </div>

            {/* Exibição das Histórias */}
            <div className="stories-grid">
                {displayedStories.length > 0 ? (
                    displayedStories.map(story => (
                        <Link to={`/story/${story.id}`} key={story.id} className='story-container-link'>
                            <div className='story-container'>
                                <div className='story-image'>
                                    <img 
                                        src={story.img || 'https://via.placeholder.com/150'} 
                                        alt={story.title || "Imagem da história"} 
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/150'; // Fallback
                                            console.error(`Erro ao carregar a imagem: ${story.img}`);
                                        }}
                                    />
                                </div>    
                                <div className='story-content'>
                                    <h3>{story.title}</h3>
                                    <p>{story.content.length > 100 ? `${story.content.substring(0, 100)}...` : story.content}</p>
                                    <p><strong>Categoria:</strong> {story.category}</p>
                                    <small>Por: {story.username}</small>
                                </div>
                            </div>  
                        </Link>
                    ))
                ) : (
                    <p className="no-results">Nenhuma história encontrada.</p>
                )}
            </div>
        </div>
    );
};

export default HomePage;
