// src/components/UserReadStories.js

import React from 'react';
import StoryCard from './StoryCard';

const UserReadStories = React.memo(({ 
    readStories, 
    handleSaveStory, 
    savedStoryIds, 
    handleUnmarkAsRead, 
    currentUser, 
    searchTerm 
}) => {
    const filteredStories = readStories.filter(story =>
        ((story.title || '').toLowerCase().includes(searchTerm.toLowerCase())) ||
        ((story.description || '').toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="profile-content">
            <div className="tab-header">
                <h2>Read Stories</h2>
                <div className="search-bar-container">
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
                        placeholder="Search read stories..." 
                        value={searchTerm} 
                        onChange={(e) => { handleSaveStory('search', e.target.value); }} 
                        className="search-input"
                    />
                    
                </div>
            </div>
            {filteredStories.length === 0 ? (
                searchTerm !== "" ? (
                    <p>No stories found with that name.</p>
                ) : (
                    <p>No stories have been read.</p>
                )
            ) : (
                <div className="stories-grid-profile">
                    {filteredStories.map(story => {
                        const isSaved = savedStoryIds.includes(story.id);
                        return (
                            <StoryCard
                                key={story.id}
                                story={story}
                                isSaved={isSaved}
                                handleSaveStory={handleSaveStory}
                                showSaveButton={true}
                                currentUser={currentUser}
                                isOwner={false}
                                handleUnmarkAsRead={handleUnmarkAsRead}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
});

export default UserReadStories;
