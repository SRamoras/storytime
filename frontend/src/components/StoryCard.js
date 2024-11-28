// StoryCard.js

import React from 'react';
import { Link } from 'react-router-dom';
import './StoryCard.css';

const StoryCard = ({ story, isSaved = false, handleSaveStory, showSaveButton = false }) => {
  const defaultProfileImage = 'https://www.gravatar.com/avatar/?d=mp&f=y';

  return (
    <div className='story-container2'>
      <Link to={`/story/${story.id}`} className='story-container-link'>
        <div className='intro-container'>
          <div className='story-image'>
            <img
              src={story.img || 'https://via.placeholder.com/150'}
              alt={story.title || "Imagem da história"}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/150';
                console.error(`Erro ao carregar a imagem: ${story.img}`);
              }}
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
            src={story.profile_image || defaultProfileImage}
            alt={`Imagem de perfil de ${story.username}`}
            className='author-profile-image'
            onError={(e) => {
              e.target.src = defaultProfileImage;
              console.error(`Erro ao carregar a imagem de perfil de ${story.username}`);
            }}
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
