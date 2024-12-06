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
                    <input 
                        type="text" 
                        placeholder="Search read stories..." 
                        value={searchTerm} 
                        onChange={(e) => { handleSaveStory('search', e.target.value); }} 
                        className="search-input"
                    />
                     <span className="search-icon material-symbols-outlined">
                    search
                    </span>
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
