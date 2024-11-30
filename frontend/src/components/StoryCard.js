// src/components/StoryCard.js

import React from 'react';
import { Link } from 'react-router-dom';
import './StoryCard.css';

const StoryCard = ({ story, isSaved = false, handleSaveStory, showSaveButton = false }) => {
  const defaultProfileImage = 'https://www.gravatar.com/avatar/?d=mp&f=y';
  const baseImageUrl = process.env.REACT_APP_BASE_IMAGE_URL || 'http://localhost:5000/uploads/';

  // Construir o caminho completo da imagem da história
  const storyImageSrc = story.img ? `${baseImageUrl}${story.img}` : 'https://via.placeholder.com/150';

  // Construir o caminho completo da imagem de perfil, se aplicável
  // Supondo que 'profile_image' também esteja na pasta 'uploads'
  const profileImageSrc = story.profile_image ? `${baseImageUrl}${story.profile_image}` : defaultProfileImage;

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
              loading="lazy" // Carregamento preguiçoso para melhor performance
            />
          </div>
          <div className='text-container-info'>
            <h3>{story.title}</h3>
            <p className='category-text'>{story.category}</p>
          </div>
        </div>
        <div className='story-content2'>
          <p>{story.content.length > 100 ? `${story.content.substring(0, 100)}...` : story.content}</p>
        </div>
      </Link>
      <div className='bottom-story-container'>
        <div className='author-info'>
          <img
            src={profileImageSrc}
            alt={`Imagem de perfil de ${story.username}`}
            className='author-profile-image'
            onError={(e) => {
              e.target.src = defaultProfileImage;
              console.error(`Erro ao carregar a imagem de perfil de ${story.username}`);
            }}
            loading="lazy" // Carregamento preguiçoso para melhor performance
          />
          <small className='username-text' title={story.username}>
            {story.username}
          </small>
        </div>
        {showSaveButton && handleSaveStory && (
          <button
            className="save-icon-button"
            onClick={() => handleSaveStory(story.id)}
            aria-label={isSaved ? 'Remover história dos favoritos' : 'Adicionar história aos favoritos'}
          >
            <span
              className="material-symbols-outlined save-icon"
            >
              {isSaved ? 'bookmark_check' : 'bookmark_add'}
            </span>
            <div className="tooltip">
              {isSaved ? 'Remover História' : 'Salvar História'}
            </div>
          </button>
        )}
      </div>
    </div>
  );
};

export default StoryCard;
