// pages/CreateStory.js

import React, { useState, useContext } from 'react';
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
    const [category, setCategory] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(file.type)) {
                toast.error('Apenas arquivos de imagem são permitidos (jpeg, jpg, png, gif).');
                return;
            }

            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                toast.error('A imagem deve ter no máximo 5MB.');
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

        if (!title || !content || !category) {
            toast.warn('Por favor, preencha o título, o conteúdo e selecione uma categoria.');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('category', category);
        if (imageFile) {
            formData.append('img', imageFile);
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
                toast.success('História criada com sucesso!');
                navigate(`/story/${newStory.id}`);
                if (closeModal) closeModal();
            } else {
                toast.error('Falha ao criar a história.');
            }
        } catch (error) {
            console.error('Erro ao criar a história:', error);
            if (error.response && error.response.data && error.response.data.error) {
                toast.error(`Falha ao criar a história: ${error.response.data.error}`);
            } else {
                toast.error('Falha ao criar a história.');
            }
        } finally {
            setUploading(false);
        }
    };

    if (!currentUser) {
        return <p>Carregando...</p>; // Ou redirecionar para o login
    }

    return (
        <div className="create-story-container">
            <ToastContainer />
            <div className="form-section">
                <h2>Criar Nova História</h2>
                <form onSubmit={handleSubmit} className="create-story-form">
                    <label>
                        Título:
                        <input 
                            type="text" 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            placeholder="Título da História"
                            required
                        />
                    </label>
                    <label>
                        Conteúdo:
                        <textarea 
                            value={content} 
                            onChange={(e) => setContent(e.target.value)} 
                            placeholder="Conteúdo da História"
                            required
                        />
                    </label>
                    <label>
                        Categoria:
                        <select 
                            value={category} 
                            onChange={(e) => setCategory(e.target.value)} 
                            required
                        >
                            <option value="">Selecione uma categoria</option>
                            <option value="Adventure">Aventura</option>
                            <option value="Romance">Romance</option>
                            <option value="Horror">Horror</option>
                            <option value="Fantasy">Fantasia</option>
                            <option value="Mystery">Mistério</option>
                            <option value="Science Fiction">Ficção Científica</option>
                        </select>
                    </label>
                    <label>
                        Imagem (Opcional):
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageChange} 
                        />
                    </label>
                    {previewImage && (
                        <div className="image-preview">
                            <img src={previewImage} alt="Pré-visualização" />
                        </div>
                    )}
                    <button type="submit" disabled={uploading}>
                        {uploading ? 'Criando...' : 'Criar História'}
                    </button>
                </form>
            </div>
            <div className="preview-section">
                <h2>Pré-visualização ao Vivo</h2>
                <div className="story-preview">
                    <div className="intro-container-replaca">
                        <div>   
                            <h3>{title || 'Título da História'}</h3>
                            <p><strong>Categoria:</strong> {category || 'Selecione uma categoria'}</p>
                        </div>  
                        {previewImage && (
                            <div className="story-image-container">
                                <img src={previewImage} alt="Pré-visualização da História" />
                            </div>
                        )}
                    </div>
                    <p className="story-content">{content || 'O conteúdo da história aparecerá aqui...'}</p>
                </div>
            </div>
        </div>
    );

};

export default CreateStory;
