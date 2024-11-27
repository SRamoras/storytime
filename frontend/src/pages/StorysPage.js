// StorysPage.js

import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import StoryCard from '../components/StoryCard';
import './StorysPage.css';

const StorysPage = () => {
    const [stories, setStories] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('Todas');
    const [sortOrder, setSortOrder] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const storiesPerPage = 12;
    const [currentUser, setCurrentUser] = useState(null);
    const [savedStoryIds, setSavedStoryIds] = useState([]);

    // Buscar o usuário atual
    useEffect(() => {
        const fetchCurrentUser = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.log('Nenhum token encontrado');
                setLoading(false);
                return;
            }

            try {
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                const response = await api.get('/auth/me');
                setCurrentUser(response.data);
            } catch (error) {
                console.error('Erro ao obter o usuário atual:', error);
            }
        };

        fetchCurrentUser();
    }, []);

    // Buscar as histórias salvas após o currentUser ser definido
    useEffect(() => {
        const fetchSavedStories = async () => {
            if (!currentUser) return;

            try {
                const token = localStorage.getItem('token');
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                const response = await api.get(`/auth/saved_stories/${currentUser.id}`);
                const ids = response.data.map(story => story.id);
                setSavedStoryIds(ids);
            } catch (error) {
                console.error('Erro ao obter histórias salvas:', error);
            }
        };

        fetchSavedStories();
    }, [currentUser]);

    // Buscar todas as histórias
    useEffect(() => {
        const fetchStories = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await api.get('/auth/stories_all', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
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

    // Funções de manipulação
    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        setCurrentPage(1);
    };

    const handleSort = (order) => {
        setSortOrder(order);
        setCurrentPage(1);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    // Filtrar e ordenar histórias
    const displayedStories = useMemo(() => {
        let filtered = [...stories];

        if (selectedCategory !== 'Todas') {
            filtered = filtered.filter(story => story.category === selectedCategory);
        }

        if (searchTerm.trim() !== '') {
            const lowerSearch = searchTerm.toLowerCase();
            filtered = filtered.filter(story =>
                story.title.toLowerCase().includes(lowerSearch) ||
                story.content.toLowerCase().includes(lowerSearch)
            );
        }

        if (sortOrder === 'asc') {
            filtered.sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortOrder === 'desc') {
            filtered.sort((a, b) => b.title.localeCompare(a.title));
        }

        return filtered;
    }, [stories, selectedCategory, sortOrder, searchTerm]);

    // Paginação
    const indexOfLastStory = currentPage * storiesPerPage;
    const indexOfFirstStory = indexOfLastStory - storiesPerPage;
    const currentStories = displayedStories.slice(indexOfFirstStory, indexOfLastStory);
    const totalPages = Math.ceil(displayedStories.length / storiesPerPage);

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Função para salvar ou remover história
    const handleSaveStory = async (storyId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Você precisa estar logado para salvar histórias.');
            return;
        }

        if (!currentUser) {
            alert('Erro ao obter o ID do usuário.');
            return;
        }

        try {
            const isSaved = savedStoryIds.includes(storyId);

            if (isSaved) {
                // Remover a história salva
                await api.delete(`/auth/save_story/${storyId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                alert('História removida com sucesso!');
                // Atualizar o estado local
                setSavedStoryIds(savedStoryIds.filter(id => id !== storyId));
            } else {
                // Salvar a história
                await api.post('/auth/save_story', { storyId }, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });
                alert('História salva com sucesso!');
                // Atualizar o estado local
                setSavedStoryIds([...savedStoryIds, storyId]);
            }
        } catch (error) {
            console.error('Erro ao salvar/remover a história:', error);
            alert('Erro ao salvar/remover a história.');
        }
    };

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
            <h1>Interative Storys Explorer</h1>
            <h6>
                Mergulhe em aventuras incríveis e tome decisões que moldam o destino de cada história. Cada escolha leva a caminhos inesperados, repletos de mistérios, desafios e finais surpreendentes.
            </h6>
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
                {currentStories.length > 0 ? (
                    currentStories.map(story => {
                        const isSaved = savedStoryIds.includes(story.id);
                        return (
                            <StoryCard
                                key={story.id}
                                story={story}
                                isSaved={isSaved}
                                handleSaveStory={handleSaveStory}
                                showSaveButton={true}
                            />
                        );
                    })
                ) : (
                    <p className="no-results">Nenhuma história encontrada.</p>
                )}
            </div>

            {/* Paginação */}
            <div className="pagination">
                <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="pagination-button"
                >
                    Anterior
                </button>
                <span>Página {currentPage} de {totalPages}</span>
                <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="pagination-button"
                >
                    Próxima
                </button>
            </div>
        </div>
    );
};

export default StorysPage;
