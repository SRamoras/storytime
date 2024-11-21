// pages/CreateStory.js

import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './CreateStory.css';
import { AuthContext } from '../contexts/AuthContext';

const CreateStory = ({ closeModal }) => { // Recebe a função closeModal como prop (se estiver usando um modal)
    const { currentUser } = useContext(AuthContext);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(file.type)) {
                alert('Apenas arquivos de imagem são permitidos (jpeg, jpg, png, gif).');
                return;
            }

            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                alert('A imagem deve ter no máximo 5MB.');
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

        if (!title || !content) {
            alert('Por favor, preencha o título e o conteúdo.');
            return;
        }

        if (!currentUser) {
            alert('Você precisa estar logado para criar uma história.');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        if (imageFile) {
            formData.append('img', imageFile);
        }

        try {
            setUploading(true);
            const response = await api.post('/auth/stories', formData, {
                headers: { 
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 201) {
                alert('História criada com sucesso!');
                // Redirecionar para o perfil do usuário
                navigate(`/profile/${currentUser.username}`);
                // Fechar o modal, se aplicável
                if (closeModal) closeModal();
            }
        } catch (error) {
            console.error('Erro ao criar história:', error);
            alert('Falha ao criar história.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="create-story-container">
            <h2>Criar Nova História</h2>
            <form onSubmit={handleSubmit} className="create-story-form">
                <label>
                    Título:
                    <input 
                        type="text" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        placeholder="Título da história"
                        required
                    />
                </label>
                <label>
                    Conteúdo:
                    <textarea 
                        value={content} 
                        onChange={(e) => setContent(e.target.value)} 
                        placeholder="Conteúdo da história"
                        required
                    />
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
                        <img src={previewImage} alt="Pré-visualização" width="200" />
                    </div>
                )}
                <button type="submit" disabled={uploading}>
                    {uploading ? 'Criando...' : 'Criar História'}
                </button>
            </form>
        </div>
    );
};

export default CreateStory;
