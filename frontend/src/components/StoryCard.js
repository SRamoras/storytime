// src/components/StoryCard.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './StoryCard.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../services/api';

const StoryCard = ({ story, isSaved = false, handleSaveStory, showSaveButton = false, onDeleteStory, currentUser, isOwner }) => {
  const [isRead, setIsRead] = useState(false); // Estado para verificar se a história já foi lida

  const defaultProfileImage = 'https://www.gravatar.com/avatar/?d=mp&f=y';
  const baseImageUrl = process.env.REACT_APP_BASE_IMAGE_URL || 'http://localhost:5000/uploads/';

  // Construir o caminho completo da imagem da história
  const storyImageSrc = story.img ? `${baseImageUrl}${story.img}` : 'https://via.placeholder.com/150';

  // Construir o caminho completo da imagem de perfil, se aplicável
  const profileImageSrc = story.profile_image ? `${baseImageUrl}${story.profile_image}` : defaultProfileImage;

  // Função para verificar se a história já foi marcada como lida
  const checkIfRead = async () => {
    if (!currentUser) return;

    try {
      const response = await api.get(`/auth/read_stories/${currentUser.id}`);
      const readStories = response.data;
      const hasRead = readStories.some(readStory => readStory.id === story.id);
      setIsRead(hasRead);
    } catch (error) {
      console.error('Erro ao verificar histórias lidas:', error);
      // Não exibir erro ao usuário para esta ação específica
    }
  };

  useEffect(() => {
    checkIfRead();
  }, [currentUser, story.id]);

  // Função para lidar com a deleção da história
  const handleDelete = async () => {
    const token = localStorage.getItem('token');

    if (!currentUser || !token) {
      alert('Você precisa estar logado para apagar uma história.');
      return;
    }

    if (window.confirm('Tem certeza de que deseja apagar esta história? Esta ação não pode ser desfeita.')) {
      try {
        const response = await api.delete(`/auth/stories/${story.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status === 200) {
          toast.success('História apagada com sucesso!');
          if (onDeleteStory) onDeleteStory(story.id); // Notifica o componente pai para atualizar a lista
        } else {
          toast.error('Erro ao apagar a história.');
        }
      } catch (error) {
        console.error('Erro ao apagar a história:', error);
        const errorMessage = error.response?.data?.error || 'Erro ao apagar a história.';
        toast.error(errorMessage);
      }
    }
  };

  // Função para marcar a história como lida
  const handleMarkAsRead = async () => {
    const token = localStorage.getItem('token');

    if (!currentUser || !token) {
      alert('Você precisa estar logado para marcar uma história como lida.');
      return;
    }

    try {
      const response = await api.post('/auth/read_story', { storyId: story.id }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      toast.success(response.data.message);
      setIsRead(true); // Atualiza o estado local para refletir que a história foi lida
    } catch (error) {
      console.error('Erro ao marcar história como lida:', error);
      const errorMessage = error.response?.data?.error || 'Erro ao marcar história como lida.';
      toast.error(errorMessage);
    }
  };

  // Função para desmarcar a história como lida
  const handleUnmarkAsRead = async () => {
    const token = localStorage.getItem('token');

    if (!currentUser || !token) {
      alert('Você precisa estar logado para desmarcar uma história como lida.');
      return;
    }

    if (window.confirm('Tem certeza de que deseja desmarcar esta história como lida?')) {
      try {
        const response = await api.delete(`/auth/read_story/${story.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        toast.success(response.data.message);
        setIsRead(false); // Atualiza o estado local para refletir que a história não está mais marcada como lida
      } catch (error) {
        console.error('Erro ao desmarcar história como lida:', error);
        const errorMessage = error.response?.data?.error || 'Erro ao desmarcar história como lida.';
        toast.error(errorMessage);
      }
    }
  };

  return (
    <div className='story-container2'>
      <Link to={`/story/${story.id}`} className='story-container-link'>
        <div className='intro-container'>
          <div className='story-image'>
            <img
              src={storyImageSrc}
              alt={story.title || "Imagem da história"}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/150';
                console.error(`Erro ao carregar a imagem: ${story.img}`);
              }}
              loading="lazy"
            />
          </div>
          <div className='text-container-info'>
            <h3>{story.title}</h3>
            {/* Categoria como Link */}
            <Link 
              to={`/StorysPage?category=${encodeURIComponent(story.category)}`} 
              className='category-text'
            >
              {story.category}
              <div className="tooltip">
                Category
              </div>
            </Link>
          </div>
        </div>
        <p className='introduction-paragraf'>Introduction</p>
        <div className='story-content2'>
          <p>{story.content.length > 100 ? `${story.content.substring(0, 100)}...` : story.content}</p>
        </div>
      </Link>
      <div className='bottom-story-container'>
        {/* Contêiner clicável para redirecionar ao perfil do autor */}
        <Link to={`/profile/${story.username}`} className='author-info'>
          <img
            src={profileImageSrc}
            alt={`Imagem de perfil de ${story.username}`}
            className='author-profile-image'
            onError={(e) => {
              console.error(`aaaaaaaa`);
              e.target.src = defaultProfileImage;
              console.error(`Erro ao carregar a imagem de perfil de ${story.username}`);
            }}
            loading="lazy"
          />
          <small className='username-text' title={story.username}>
            {story.username}
          </small>
          <div className="tooltip">
                  Profile
                </div>

        </Link>
        <div className='action-buttons'>
          {showSaveButton && handleSaveStory && (
            <button
              className="save-icon-button"
              onClick={() => handleSaveStory(story.id)}
              aria-label={isSaved ? 'Remover história dos favoritos' : 'Adicionar história aos favoritos'}
            >
              <span className="save-icon">
                {isSaved ? 'bookmark_check' : 'bookmark_add'}
              </span>
              <div className="tooltip">
                {isSaved ? 'Remove Story' : 'Save Story'}
              </div>
            </button>
          )}
          {/* Botão de Marcar/Desmarcar como Lida */}
          {currentUser && (
            !isRead ? (
              <button
                className="mark-read-button"
                onClick={handleMarkAsRead}
                aria-label="Marcar História como Lida"
              >
                <span className="mark-read-icon">visibility</span>
                <div className="tooltip">
                  Check as Read
                </div>
              </button>
            ) : (
              <button
                className="unmark-read-button"
                onClick={handleUnmarkAsRead}
                aria-label="Desmarcar História como Lida"
              >
                <span className="unmark-read-icon">visibility_off</span>
                <div className="tooltip">
                  Uncheck as Read
                </div>
              </button>
            )
          )}
          {/* Botão de Deletar */}
          {currentUser && isOwner && currentUser.id === story.user_id && (
            <button
              className="delete-icon-button"
              onClick={handleDelete}
              aria-label="Apagar História"
            >
              <span className="delete-icon">
                delete
              </span>
              <div className="tooltip">
                Delte Story
              </div>
            </button>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default StoryCard;
