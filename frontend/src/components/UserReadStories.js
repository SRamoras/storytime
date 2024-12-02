// src/components/UserReadStories.js

import React from 'react';
import StoryCard from './StoryCard';

const UserReadStories = React.memo(({ readStories, handleSaveStory, savedStoryIds, currentUser, isOwner }) => (
    <div className="profile-content">
        <h2>Histórias Lidas</h2>
        {readStories.length === 0 ? (
            <p>Nenhuma história lida.</p>
        ) : (
            <div className="stories-grid-profile">
                {readStories.map(story => {
                    const isSaved = savedStoryIds.includes(story.id);
                    return (
                        <StoryCard
                            key={story.id}
                            story={story}
                            isSaved={isSaved}
                            handleSaveStory={handleSaveStory}
                            showSaveButton={true}
                            currentUser={currentUser}
                            isOwner={isOwner}
                        />
                    );
                })}
            </div>
        )}
    </div>
));

export default UserReadStories;
