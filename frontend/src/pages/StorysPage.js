// src/pages/StorysPage.js

import React, { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import StoryCard from '../components/StoryCard';
import './StorysPage.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StorysPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const initialCategory = queryParams.get('category') || 'All';

    const [stories, setStories] = useState([]);
    const [categories, setCategories] = useState(['All']);
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [sortOrder, setSortOrder] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const storiesPerPage = 12;
    const [currentUser, setCurrentUser] = useState(null);
    const [savedStoryIds, setSavedStoryIds] = useState([]);

    // Fetch current user
    useEffect(() => {
        const fetchCurrentUser = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.log('No token found');
                setLoading(false);
                return;
            }

            try {
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                const response = await api.get('/auth/me');
                setCurrentUser(response.data);
            } catch (error) {
                console.error('Error fetching current user:', error);
                toast.error('Failed to fetch user data.');
                // Axios interceptor will redirect to login page
            }
        };

        fetchCurrentUser();
    }, []);

    // Fetch saved stories after currentUser is set
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
                console.error('Error fetching saved stories:', error);
                toast.error('Failed to fetch saved stories.');
            }
        };

        fetchSavedStories();
    }, [currentUser]);

    // Fetch all stories and categories
    useEffect(() => {
        const fetchStoriesAndCategories = async () => {
            try {
                const response = await api.get('/auth/stories_all');
                setStories(response.data);

                // Extract unique categories
                const uniqueCategories = ['All', ...new Set(response.data.map(story => story.category).filter(Boolean))];
                setCategories(uniqueCategories);
            } catch (error) {
                console.error('Error loading stories:', error);
                setError('Error loading stories.');
                toast.error('Error loading stories.');
            } finally {
                setLoading(false);
            }
        };

        fetchStoriesAndCategories();
    }, []);

    // Update selectedCategory when query parameter changes
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const category = params.get('category') || 'All';
        setSelectedCategory(category);
        setCurrentPage(1); // Reset to first page when category changes
    }, [location.search]);

    // Handler functions
    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        setCurrentPage(1);

        // Update URL with category parameter using useNavigate
        if (category === 'All') {
            navigate('/StorysPage');
        } else {
            navigate(`/StorysPage?category=${encodeURIComponent(category)}`);
        }
    };

    const handleSort = (order) => {
        setSortOrder(order);
        setCurrentPage(1);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    // Filter and sort stories
    const displayedStories = useMemo(() => {
        let filtered = [...stories];

        if (selectedCategory !== 'All') {
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

    // Pagination
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

    // Function to save or remove story
    const handleSaveStory = async (storyId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.info('You need to be logged in to save stories.');
            return;
        }

        if (!currentUser) {
            toast.error('Error obtaining user ID.');
            return;
        }

        try {
            const isSaved = savedStoryIds.includes(storyId);

            if (isSaved) {
                // Remove saved story
                await api.delete(`/auth/save_story/${storyId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                toast.success('Story removed successfully!');
                // Update local state
                setSavedStoryIds(savedStoryIds.filter(id => id !== storyId));
            } else {
                // Save story
                await api.post('/auth/save_story', { storyId }, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });
                toast.success('Story saved successfully!');
                // Update local state
                setSavedStoryIds([...savedStoryIds, storyId]);
            }
        } catch (error) {
            console.error('Error saving/removing story:', error);
            toast.error('Error saving/removing story.');
        }
    };

    if (loading) {
        return (
            <div className="spinner-container">
                <div className="spinner"></div>
                <p>Loading stories...</p>
                <ToastContainer />
            </div>
        );
    }

    if (error) {
        return (
            <>
                <p className="error-message">{error}</p>
                <ToastContainer />
            </>
        );
    }

    return (
        <div className="home-page">
            <div className='title-text-container'>
                <h1>Interactive <br />Stories Explorer</h1>
                <h6>
                    Dive into incredible adventures and make decisions that shape the destiny of each story. <br />Every choice leads to unexpected paths, filled with mysteries, challenges, and surprising endings.
                </h6>
            </div>
            {/* Search Bar Aligned to the Right */}
            <div className="search-bar-container-storys-page">
                <div className="search-bar">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 0 24 24"
                        width="24px"
                        fill="var(--text-color)"
                        style={{ position: 'absolute', marginLeft: '10px', marginTop: '8px' }}
                    >
                        <path d="M0 0h24v24H0z" fill="none"/>
                        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                    </svg>
                    <input
                        type="text"
                        placeholder="Search stories..."
                        value={searchTerm}
                        onChange={handleSearch}
                        style={{ paddingLeft: '40px' }}
                    />
                </div>
            </div>
            {/* Filters and Sorting Section */}
            <div className='main-container-storys-page'>
                <div className="filters-container">
                    {/* Category Filters */}
                    <div className="category-filters">
                        <h3>Category</h3>
                        <div className="filter-buttons-grid">
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
                    </div>

                    {/* Sorting */}
                    <div className="sort-buttons">
                        <h3>Sort</h3>
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
                </div>

                {/* Stories Display */}
                <div className="stories-section">
                    <div className="stories-grid">
                        {currentStories.length > 0 ? (
                            currentStories.map(story => {
                                const isSaved = savedStoryIds.includes(story.id);
                                const isOwner = currentUser && currentUser.id === story.user_id;
                                return (
                                    <StoryCard
                                        key={story.id}
                                        story={story}
                                        isSaved={isSaved}
                                        handleSaveStory={handleSaveStory}
                                        showSaveButton={true}
                                        currentUser={currentUser}
                                        isOwner={isOwner}
                                    />
                                );
                            })
                        ) : (
                            <p className="no-results">No stories found.</p>
                        )}
                    </div>
                    {/* Pagination */}
                    <div className="pagination">
                        <button
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1}
                            className="pagination-button"
                        >
                            &laquo;
                        </button>
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => setCurrentPage(index + 1)}
                                className={`pagination-button ${currentPage === index + 1 ? 'active-page' : ''}`}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className="pagination-button"
                        >
                            &raquo;
                        </button>
                    </div>
                </div>
            </div>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        </div>
    );

};

export default StorysPage;
