// pages/CreateStory.js

import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './CreateStory.css';
import { AuthContext } from '../contexts/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateStory = ({ closeModal }) => { 
    const { currentUser, token } = useContext(AuthContext);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category_id, setCategoryId] = useState(''); // Alterado para category_id
    const [categories, setCategories] = useState([]); // Estado para armazenar categorias
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [errorCategories, setErrorCategories] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const navigate = useNavigate();

    // Define maximum characters
    const MAX_TITLE_LENGTH = 100;
    const MAX_CONTENT_LENGTH = 5000;

    // Function to determine character count class
    const getCharCountClass = (currentLength, maxLength) => {
        if (currentLength > maxLength * 0.8) { // If more than 80% of maxLength
            return 'char-count warning';
        }
        return 'char-count';
    };

    // Função para buscar categorias do backend
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/auth/categories', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setCategories(response.data.categories);
                console.log('Categorias obtidas:', response.data.categories);
            } catch (error) {
                console.error('Erro ao buscar categorias:', error);
                setErrorCategories('Erro ao carregar categorias.');
                toast.error('Erro ao carregar categorias.');
            } finally {
                setLoadingCategories(false);
            }
        };

        fetchCategories();
    }, [token]);

    // Adicionar useEffect para depuração do estado categories
    useEffect(() => {
        console.log('Estado "categories" atualizado:', categories);
    }, [categories]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(file.type)) {
                toast.error('Only image files are allowed (jpeg, jpg, png, gif).');
                return;
            }

            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                toast.error('The image must be at most 5MB.');
                return;
            }

            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImageFile(null);
            setPreviewImage(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || !content || !category_id) {
            toast.warn('Please fill in the title, content, and select a category.');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('category_id', Number(category_id)); // Convertido para número
        if (imageFile) {
            formData.append('img', imageFile);
        }

        // Adicionar log para verificar os dados enviados
        console.log('FormData entries:');
        for (let pair of formData.entries()) {
            console.log(pair[0]+ ': ' + pair[1]);
        }

        try {
            setUploading(true);
            const response = await api.post('/auth/stories', formData, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}` // Inclui o token
                }
            });

            if (response.status === 201) {
                const newStory = response.data;
                toast.success('Story created successfully!');
                navigate(`/story/${newStory.id}`);
                if (closeModal) closeModal();
            } else {
                toast.error('Failed to create the story.');
            }
        } catch (error) {
            console.error('Error creating the story:', error);
            if (error.response && error.response.data && error.response.data.error) {
                toast.error(`Failed to create the story: ${error.response.data.error}`);
            } else {
                toast.error('Failed to create the story.');
            }
        } finally {
            setUploading(false);
        }
    };

    if (!currentUser) {
        return <p>Loading...</p>; // Ou redirecione para o login
    }

    return (
        <div className="create-story-container">
            <ToastContainer />
            <div className="form-section">
                <h2>Create New Story</h2>
                <form onSubmit={handleSubmit} className="create-story-form">
                    <label htmlFor="story-title">
                        Title:
                        <input 
                            id="story-title"
                            type="text" 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            placeholder="Story Title"
                            maxLength={MAX_TITLE_LENGTH} // Define maxLength
                            required
                        />
                        <small className={getCharCountClass(title.length, MAX_TITLE_LENGTH)}>
                            {title.length}/{MAX_TITLE_LENGTH}
                        </small>
                    </label>
                    <label htmlFor="story-content">
                        Content:
                        <textarea 
                            id="story-content"
                            value={content} 
                            onChange={(e) => setContent(e.target.value)} 
                            placeholder="Story Content"
                            maxLength={MAX_CONTENT_LENGTH} // Define maxLength
                            required
                        />
                        <small className={getCharCountClass(content.length, MAX_CONTENT_LENGTH)}>
                            {content.length}/{MAX_CONTENT_LENGTH}
                        </small>
                    </label>
                    <label htmlFor="story-category">
                        Category:
                        {loadingCategories ? (
                            <p>Carregando categorias...</p>
                        ) : errorCategories ? (
                            <p className="error-message">{errorCategories}</p>
                        ) : (
                            <select 
                                id="story-category"
                                value={category_id} 
                                onChange={(e) => {
                                    setCategoryId(e.target.value);
                                    console.log('Selected category_id:', e.target.value);
                                }} 
                                required
                            >
                                <option value="">Select a category</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        )}
                    </label>
                    <label htmlFor="story-image">
                        Image:
                        <input 
                            id="story-image"
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageChange} 
                        />
                    </label>
                    {previewImage && (
                        <div className="image-preview">
                            <img src={previewImage} alt="Preview" />
                        </div>
                    )}
                    <button type="submit" disabled={uploading}>
                        {uploading ? 'Creating...' : 'Create Story'}
                    </button>
                </form>
            </div>
            <div className="preview-section">
                <h2>Live Preview</h2>
                <div className="story-preview">
                    <div className="intro-container-replaca">
                        <div>   
                            <h3>{title || 'Story Title'}</h3>
                            <p><strong>Category:</strong> {categories.find(cat => cat.id.toString() === category_id)?.name || 'Select a category'}</p>
                        </div>  
                        {previewImage && (
                            <div className="story-image-container">
                                <img src={previewImage} alt="Story Preview" />
                            </div>
                        )}
                    </div>
                    <p className="story-content">{content || 'Story content will appear here...'}</p>
                </div>
            </div>
        </div>
    );

};

export default CreateStory;
