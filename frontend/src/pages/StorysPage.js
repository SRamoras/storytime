import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './StorysPage.css';

const HomePage = () => {
    const [stories, setStories] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('Todas');
    const [sortOrder, setSortOrder] = useState(null); // 'asc' ou 'desc'
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1); // Página atual
    const storiesPerPage = 12; // Número de histórias por página
    const [userId, setUserId] = useState(null); // Estado para armazenar o ID do usuário

    // Função para obter o usuário atual a partir do token
    useEffect(() => {
        const fetchCurrentUser = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.log('Nenhum token encontrado');
                setLoading(false);
                return;
            }

            try {
                const response = await api.get('/auth/me', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUserId(response.data.id);
            } catch (error) {
                console.error('Erro ao obter o usuário atual:', error);
            }
        };

        fetchCurrentUser();
    }, []);

    // Fetch all stories from the API
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

    // Função para lidar com a seleção de categoria
    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        setCurrentPage(1); // Resetar para a primeira página
    };

    // Função para lidar com a ordenação
    const handleSort = (order) => {
        setSortOrder(order);
        setCurrentPage(1); // Resetar para a primeira página
    };

    // Função para lidar com a barra de pesquisa
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Resetar para a primeira página
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

    // Obter as histórias da página atual
    const indexOfLastStory = currentPage * storiesPerPage;
    const indexOfFirstStory = indexOfLastStory - storiesPerPage;
    const currentStories = displayedStories.slice(indexOfFirstStory, indexOfLastStory);

    // Lógica para os botões de paginação
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

    // Função para salvar a história
    const handleSaveStory = async (storyId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Você precisa estar logado para salvar histórias.');
            return;
        }

        if (!userId) {
            alert('Erro ao obter o ID do usuário.');
            return;
        }

        try {
            const dataToSend = {
                storyId: storyId,
            };

            await api.post('/auth/save_story', dataToSend, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            alert('História salva com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar a história:', error);
            alert('Erro ao salvar a história.');
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
                Dive into incredible adventures and make decisions that
                shape the fate of each story. Every choice leads to unexpected paths,
                filled with mysteries, challenges, and surprising endings.
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
                    currentStories.map(story => (
                        <div key={story.id} className='story-container2'>
                            <Link to={`/story/${story.id}`} className='story-container-link'>
                                <div className='intro-container'>
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
                                    <div className='text-container-info'>
                                        <h3>{story.title}</h3>
                                        <p>{story.category}</p>
                                    </div>
                                </div>
                                <div className='story-content2'>
                                    <p>{story.content.length > 100 ? `${story.content.substring(0, 100)}...` : story.content}</p>
                                    <small>Por: {story.username}</small>
                                </div>
                            </Link>
                            <button
                                className="save-button"
                                onClick={() => handleSaveStory(story.id)}
                            >
                                Salvar História
                            </button>
                        </div>
                    ))
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

export default HomePage;
