// StoryCard.js

import React from 'react';
import { Link } from 'react-router-dom';
import './StoryCard.css'; // We'll create a separate CSS file for this component

const StoryCard = ({ story, isSaved = false, handleSaveStory, showSaveButton = false }) => {
  return (
    <div className='story-container2'>
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
      {showSaveButton && handleSaveStory && (
        <button
          className="save-button"
          onClick={() => handleSaveStory(story.id)}
        >
          {isSaved ? 'Remover História' : 'Salvar História'}
        </button>
      )}
    </div>
  );
};

export default StoryCard;
