// src/components/StoryCard.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './StoryCard.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../services/api';

const StoryCard = ({ story, isSaved = false, handleSaveStory, showSaveButton = false, onDeleteStory, currentUser, isOwner }) => {
  const [isRead, setIsRead] = useState(false);

  const defaultProfileImage = 'https://www.gravatar.com/avatar/?d=mp&f=y';
  const baseImageUrl = process.env.REACT_APP_BASE_IMAGE_URL || 'http://localhost:5000/uploads/';

  const storyImageSrc = story.img ? `${baseImageUrl}${story.img}` : 'https://via.placeholder.com/150';
  const profileImageSrc = story.profile_image ? `${baseImageUrl}${story.profile_image}` : defaultProfileImage;

  const checkIfRead = async () => {
    if (!currentUser) return;
    try {
      const response = await api.get(`/auth/read_stories/${currentUser.id}`);
      const readStories = response.data;
      const hasRead = readStories.some(readStory => readStory.id === story.id);
      setIsRead(hasRead);
    } catch (error) {
      console.error('Error checking read stories:', error);
    }
  };

  useEffect(() => {
    checkIfRead();
  }, [currentUser, story.id]);

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
  
    if (!currentUser || !token) {
      toast.error('You need to be logged in to delete a story.');
      return;
    }
  
    const confirmToast = toast(
      <div>
        <p>Are you sure you want to delete this story? This action cannot be undone.</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
          <button
            style={{ backgroundColor: 'red', color: 'white', padding: '5px 10px', border: 'none', cursor: 'pointer' }}
            onClick={async () => {
              try {
                const response = await api.delete(`/auth/stories/${story.id}`, {
                  headers: {
                    'Authorization': `Bearer ${token}`
                  }
                });
  
                if (response.status === 200) {
                  toast.success('Story successfully deleted!');
                  if (onDeleteStory) onDeleteStory(story.id);
                } else {
                  toast.error('Error deleting the story.');
                }
              } catch (error) {
                console.error('Error deleting the story:', error);
                const errorMessage = error.response?.data?.error || 'Error deleting the story.';
                toast.error(errorMessage);
              }
              toast.dismiss(confirmToast);
            }}
          >
            Confirm
          </button>
          <button
            style={{ backgroundColor: 'grey', color: 'white', padding: '5px 10px', border: 'none', cursor: 'pointer' }}
            onClick={() => toast.dismiss(confirmToast)}
          >
            Cancel
          </button>
        </div>
      </div>,
      { autoClose: false, closeOnClick: false }
    );
  };

  const handleMarkAsRead = async () => {
    const token = localStorage.getItem('token');

    if (!currentUser || !token) {
      toast.error('You need to be logged in to mark a story as read.');
      return;
    }

    try {
      const response = await api.post('/auth/read_story', { storyId: story.id }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      toast.success(response.data.message);
      setIsRead(true);
    } catch (error) {
      console.error('Error marking story as read:', error);
      const errorMessage = error.response?.data?.error || 'Error marking story as read.';
      toast.error(errorMessage);
    }
  };

  const handleUnmarkAsRead = async () => {
    const token = localStorage.getItem('token');

    if (!currentUser || !token) {
      toast.error('You need to be logged in to unmark a story as read.');
      return;
    }

    try {
      const response = await api.delete(`/auth/read_story/${story.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      toast.success(response.data.message);
      setIsRead(false);
    } catch (error) {
      console.error('Error unmarking story as read:', error);
      const errorMessage = error.response?.data?.error || 'Error unmarking story as read.';
      toast.error(errorMessage);
    }
  };

  return (
    <div className='story-container2'>
      <Link to={`/story/${story.id}`} className='story-container-link'>
        <div className='intro-container'>
          <div className='story-image'>
            <img
              src={storyImageSrc}
              alt={story.title || "Story image"}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/150';
                console.error(`Error loading image: ${story.img}`);
              }}
              loading="lazy"
            />
          </div>
          <div className='text-container-info'>
            <h3>{story.title}</h3>
            <Link 
              to={`/StorysPage?category=${encodeURIComponent(story.category)}`} 
              className='category-text'
            >
              {story.category}
              <div className="tooltip">Category</div>
            </Link>
          </div>
        </div>
        <p className='introduction-paragraf'>Introduction</p>
        <div className='story-content2'>
          <p>{story.content.length > 100 ? `${story.content.substring(0, 100)}...` : story.content}</p>
        </div>
      </Link>
      <div className='bottom-story-container'>
        <Link to={`/profile/${story.username}`} className='author-info'>
          <img
            src={profileImageSrc}
            alt={`Profile image of ${story.username}`}
            className='author-profile-image'
            onError={(e) => {
              e.target.src = defaultProfileImage;
              console.error(`Error loading profile image of ${story.username}`);
            }}
            loading="lazy"
          />
          <small className='username-text' title={story.username}>
            {story.username}
          </small>
          <div className="tooltip">Profile</div>
        </Link>
        <div className='action-buttons'>
          {showSaveButton && handleSaveStory && (
            <button
              className="save-icon-button"
              onClick={() => handleSaveStory(story.id)}
              aria-label={isSaved ? 'Remove story from favorites' : 'Add story to favorites'}
            >
              <span className="save-icon">
                {isSaved ? 'bookmark_check' : 'bookmark_add'}
              </span>
              <div className="tooltip">
                {isSaved ? 'Remove Story' : 'Save Story'}
              </div>
            </button>
          )}
          {currentUser && (
            !isRead ? (
              <button
                className="mark-read-button"
                onClick={handleMarkAsRead}
                aria-label="Mark story as read"
              >
                <span className="mark-read-icon">visibility</span>
                <div className="tooltip">Mark as Read</div>
              </button>
            ) : (
              <button
                className="unmark-read-button"
                onClick={handleUnmarkAsRead}
                aria-label="Unmark story as read"
              >
                <span className="unmark-read-icon">visibility_off</span>
                <div className="tooltip">Unmark as Read</div>
              </button>
            )
          )}
          {currentUser && isOwner && currentUser.id === story.user_id && (
            <button
              className="delete-icon-button"
              onClick={handleDelete}
              aria-label="Delete story"
            >
              <span className="delete-icon">delete</span>
              <div className="tooltip">Delete Story</div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoryCard;
