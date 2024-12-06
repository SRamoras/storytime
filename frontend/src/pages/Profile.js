// src/pages/Profile.js

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Profile.css';
import books from '../Assets/books.jpg';
import StoryCard from '../components/StoryCard';
import UserReadStories from '../components/UserReadStories';
import { toast } from 'react-toastify';

// Subcomponents

const UserInfo = React.memo(({ user, firstname, lastname, bio, profileImage, defaultAvatar, isOwner, handleEdit, baseImageUrl }) => {
    const profileImageSrc = profileImage 
        ? (profileImage.startsWith('data:') ? profileImage : `${baseImageUrl}${profileImage}`) 
        : defaultAvatar;

    return (
        <div className="profile-content">
            <div className="user-info">
                <div className="user-img">
                    <img 
                        src={profileImageSrc} 
                        alt="Profile" 
                        width="150" 
                        height="150" 
                        onError={(e) => { e.target.src = defaultAvatar; }}
                    />
                </div>
                <div>
                    <div className='user-name-container'>
                        <h1><strong>{user.username}</strong><br /></h1>
                        <p>{firstname} {lastname}</p>
                    </div>
                    <div className='div-line1'></div>
                    <div className='container-info-medium'>
                        <p>Published Stories:</p>
                        <p>{user.storyCount || 0}</p>
                    </div>
                    <div className='container-info-medium'>
                        <p>Saved Stories:</p>
                        <p>{user.savedCount || 0}</p>
                    </div>
                    <div className='container-info-medium'>
                        <p>Read Stories:</p>
                        <p>{user.readCount || 0}</p>
                    </div>
                    <div className='div-line1'></div>
                    <div className='bio-container'>
                        <p className='subtitle-container-info'>About Me</p>
                        <p className='bio-text'>{bio || "No information available."}</p>
                    </div>
                </div>
            </div>
        </div>
    );
});

const UserSettings = React.memo(({ 
    firstname, 
    setFirstname, 
    lastname, 
    setLastname, 
    bio, 
    setBio, 
    handleUpdateProfile, 
    handleImageUpload, 
    handleImageChange, 
    profileImage, 
    imageFile, 
    defaultAvatar,
    baseImageUrl
}) => {
    const profileImageSrc = profileImage 
        ? (profileImage.startsWith('data:') ? profileImage : `${baseImageUrl}${profileImage}`) 
        : defaultAvatar;

    const [firstnameCount, setFirstnameCount] = useState(firstname.length);
    const [lastnameCount, setLastnameCount] = useState(lastname.length);
    const [bioCount, setBioCount] = useState(bio.length);

    const handleFirstnameChange = (e) => {
        const value = e.target.value;
        if (value.length <= 10) {
            setFirstname(value);
            setFirstnameCount(value.length);
        }
    };

    const handleLastnameChange = (e) => {
        const value = e.target.value;
        if (value.length <= 10) {
            setLastname(value);
            setLastnameCount(value.length);
        }
    };

    const handleBioChange = (e) => {
        const value = e.target.value;
        if (value.length <= 150) {
            setBio(value);
            setBioCount(value.length);
        }
    };

    const validateAndUpdateProfile = () => {
        if (firstname.length > 10) {
            toast.error('First name cannot exceed 10 characters.');
            return;
        }
        if (lastname.length > 10) {
            toast.error('Last name cannot exceed 10 characters.');
            return;
        }
        if (bio.length > 150) {
            toast.error('Bio cannot exceed 150 characters.');
            return;
        }
        handleUpdateProfile();
    };

    return (
        <div className="profile-content">
            <h2>Update Your Avatar</h2>
        
            <form className='settings-form' onSubmit={handleImageUpload}>
               <div className='intro-img-container-input'>
                    {(imageFile || profileImage) && (
                        <img 
                            src={profileImageSrc} 
                            alt="Preview" 
                            width="100" 
                            height="100" 
                            style={{marginRight: '15px' }} 
                        />
                    )}    
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageChange} 
                    />
                </div>
                <div className='button-submit-img'>
                    <button type="submit">Save Image Changes</button>
                </div>
            </form>
            <br /><br />
           
            <div className="settings-form-text settings-form">
                <h2>Update Your Profile Information</h2>
                
                <label>
                    First Name:
                    <input 
                        type="text" 
                        value={firstname} 
                        onChange={handleFirstnameChange} 
                        placeholder="First Name"
                        maxLength={10}
                    />
                    <small className="char-count">{firstnameCount}/10</small>
                </label>
                
                <label>
                    Last Name:
                    <input 
                        type="text" 
                        value={lastname} 
                        onChange={handleLastnameChange} 
                        placeholder="Last Name"
                        maxLength={10}
                    />
                    <small className="char-count">{lastnameCount}/10</small>
                </label>
                
                <label>
                    Bio:
                    <textarea 
                        value={bio} 
                        onChange={handleBioChange} 
                        placeholder="Bio"
                        maxLength={150}
                    />
                    <small className="char-count">{bioCount}/150</small>
                </label>
                
                <button 
                    type="button" 
                    className="save-text-button" 
                    onClick={validateAndUpdateProfile}
                >
                    Save Text Changes
                </button>
            </div>
        </div>
    );
});

const UserSavedStories = React.memo(({ savedStories, handleSaveStory, savedStoryIds, currentUser, isOwner, searchTerm, handleSearchChange }) => {
    const filteredStories = savedStories.filter(story =>
        ((story.title || '').toLowerCase().includes(searchTerm.toLowerCase())) ||
        ((story.description || '').toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="profile-content">
            <div className="tab-header">
                <h2>Saved Stories</h2>
                <div className="search-bar-container">
                    <input 
                        type="text" 
                        placeholder="Search saved stories..." 
                        value={searchTerm} 
                        onChange={handleSearchChange} 
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
                    <p>No stories saved.</p>
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
                                isOwner={isOwner}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
});

const UserStories = React.memo(({ stories, handleSaveStory, savedStoryIds, currentUser, isOwner, searchTerm, handleSearchChange }) => {
    const filteredStories = stories.filter(story =>
        ((story.title || '').toLowerCase().includes(searchTerm.toLowerCase())) ||
        ((story.description || '').toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="profile-content">
            <div className="tab-header">
                <h2>Published Stories</h2>
                <div className="search-bar-container">
                    <input 
                        type="text" 
                        placeholder="Search published stories..." 
                        value={searchTerm} 
                        onChange={handleSearchChange} 
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
                    <p>This user has not yet published stories.</p>
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
                                isOwner={isOwner}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
});

const Profile = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const { username } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [profileUser, setProfileUser] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [stories, setStories] = useState([]);
    const [savedStories, setSavedStories] = useState([]);
    const [readStories, setReadStories] = useState([]);
    const [savedStoryIds, setSavedStoryIds] = useState([]);
    const [content, setContent] = useState('stories');
    const [bio, setBio] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [profileImage, setProfileImage] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const defaultAvatar = "https://www.gravatar.com/avatar/?d=mp&f=y";
    const baseImageUrl = process.env.REACT_APP_BASE_IMAGE_URL || 'http://localhost:5000/uploads/';
    const [isOwner, setIsOwner] = useState(null);
    const menuRef = useRef(null);
    const menuItemRefs = useRef({});
    const [sliderStyle, setSliderStyle] = useState({
        left: 0,
        width: 0
    });

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const fetchCurrentUser = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('No token found');
            setLoading(false);
            setIsOwner(false);
            return;
        }

        try {
            const response = await api.get('/auth/me', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('Authenticated user data:', response.data);
            setCurrentUser(response.data);
        } catch (error) {
            console.error('Error fetching authenticated user data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchProfileUser = async () => {
        try {
            const response = await api.get(`/auth/users/${username}`);
            console.log('Profile data received:', response.data.user);
            setProfileUser(response.data.user);
            setBio(response.data.user.bio || "");
            setFirstname(response.data.user.firstname || "");
            setLastname(response.data.user.lastname || "");
            setProfileImage(response.data.user.profile_image || "");
        } catch (error) {
            console.error('Error fetching profile data:', error);
            toast.error('Error fetching profile data.');
        }
    };

    const fetchUserStories = async () => {
        try {
            let response;
            if (username) {
                response = await api.get(`/auth/stories/${username}`);
            } else if (currentUser) {
                response = await api.get('/auth/stories', { params: { user_id: currentUser.id } });
            }
            setStories(response.data);
        } catch (error) {
            console.error('Error loading stories:', error);
            toast.error('Failed to load stories.');
        } finally {
            setLoading(false);
        }
    };

    const fetchProfileUserSavedStories = async () => {
        if (!profileUser) return;

        try {
            const response = await api.get(`/auth/saved_stories/${profileUser.id}`);
            setSavedStories(response.data);
        } catch (error) {
            console.error('Error loading profile user saved stories:', error);
            toast.error('Failed to load profile user saved stories.');
        }
    };

    const fetchProfileUserReadStories = async () => {
        if (!profileUser) return;

        try {
            const response = await api.get(`/auth/read_stories/${profileUser.id}`);
            setReadStories(response.data);
            console.log('Read stories obtained:', response.data);
        } catch (error) {
            console.error('Error loading profile user read stories:', error);
            toast.error('Failed to load profile user read stories.');
        }
    };

    const fetchCurrentUserSavedStoryIds = async () => {
        if (!currentUser) {
            console.log('Unauthenticated user.');
            return;
        }

        try {
            const response = await api.get(`/auth/saved_stories/${currentUser.id}`);
            const ids = response.data.map(story => story.id);
            setSavedStoryIds(ids);
        } catch (error) {
            console.error('Error loading current user saved story IDs:', error);
            toast.error('Failed to load current user saved story IDs.');
        }
    };

    useEffect(() => {
        const initialize = async () => {
            setLoading(true);
            await fetchCurrentUser();
            await fetchProfileUser();
        };
        initialize();
    }, [username]);

    useEffect(() => {
        if (currentUser && profileUser) {
            const owner = String(currentUser.id) === String(profileUser.id);
            setIsOwner(owner);
        } else {
            setIsOwner(false);
        }
    }, [currentUser, profileUser]);

    useEffect(() => {
        if (profileUser) {
            fetchUserStories();
            fetchProfileUserSavedStories();
            fetchProfileUserReadStories();
        }

        if (currentUser) {
            fetchCurrentUserSavedStoryIds();
        }
    }, [profileUser, currentUser]);

    useEffect(() => {
        if (profileUser) {
            const params = new URLSearchParams(location.search);
            const tab = params.get('tab');
            if (tab === 'settings' && isOwner) {
                setContent('settings');
            } else if (tab === 'saved_stories') {
                setContent('saved_stories');
            } else if (tab === 'read_stories') {
                setContent('read_stories');
            } else {
                setContent('stories');
            }
        }
    }, [profileUser, location.search, isOwner]);

    const handleSaveStory = async (storyId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('You need to be logged in to save stories.');
            return;
        }

        if (!currentUser) {
            toast.error('Error obtaining user ID.');
            return;
        }

        try {
            const isSaved = savedStoryIds.includes(storyId);

            if (isSaved) {
                await api.delete(`/auth/save_story/${storyId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                toast.success('Story removed successfully!');
                setSavedStoryIds(savedStoryIds.filter(id => id !== storyId));
            } else {
                await api.post('/auth/save_story', { storyId }, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });
                toast.success('Story saved successfully!');
                setSavedStoryIds([...savedStoryIds, storyId]);
            }
        } catch (error) {
            console.error('Error saving/removing story:', error);
            toast.error('Error saving/removing story.');
        }
    };

    const handleUpdateProfile = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('No token found to update profile.');
            return;
        }

        try {
            const response = await api.put('/auth/update-profile', { bio, firstname, lastname }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                await fetchProfileUser();
            }

            toast.success('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile.');
        }
    };

    const handleImageUpload = async (e) => {
        e.preventDefault();

        if (!imageFile) {
            toast.error('Please select an image to upload.');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('No token found to upload the image.');
            return;
        }

        const formData = new FormData();
        formData.append('profileImage', imageFile);

        try {
            const response = await api.post('/auth/upload-profile-image', formData, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                await fetchProfileUser();
                toast.success('Profile image updated successfully!');
                setImageFile(null);
            } else {
                await fetchProfileUser();
                toast.success('Profile image updated successfully!');
                setImageFile(null);
            }
        } catch (error) {
            console.error('Error uploading profile image:', error);
            toast.error('Failed to upload profile image.');
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(file.type)) {
                toast.error('Only image files are allowed (jpeg, jpg, png, gif).');
                return;
            }

            const maxSize = 2 * 1024 * 1024; // 2MB
            if (file.size > maxSize) {
                toast.error('The image must be a maximum of 2MB.');
                return;
            }

            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImageFile(null);
            setProfileImage(profileUser.profile_image ? `${baseImageUrl}${profileUser.profile_image}` : defaultAvatar);
        }
    };

    const handleEditProfile = () => {
        setContent('settings');
    };

    const handleUnmarkAsRead = async (storyId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('You need to be logged in to remove read stories.');
            return;
        }

        if (!currentUser) {
            toast.error('Error getting user ID.');
            return;
        }

        try {
            await api.delete(`/auth/read_story/${storyId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success('Story successfully removed from read!');
            setReadStories(readStories.filter(story => story.id !== storyId));
        } catch (error) {
            console.error('Error removing read story:', error);
            toast.error('Error removing read story.');
        }
    };

    const renderContent = () => {
        if (!profileUser) {
            return <p>Loading profile...</p>;
        }

        switch(content) {
            case 'settings':
                if (!isOwner) return null;
                return <UserSettings 
                            firstname={firstname} 
                            setFirstname={setFirstname} 
                            lastname={lastname} 
                            setLastname={setLastname} 
                            bio={bio} 
                            setBio={setBio} 
                            handleUpdateProfile={handleUpdateProfile} 
                            handleImageUpload={handleImageUpload} 
                            handleImageChange={handleImageChange} 
                            profileImage={profileImage} 
                            imageFile={imageFile} 
                            defaultAvatar={defaultAvatar}
                            baseImageUrl={baseImageUrl}
                        />;
            case 'saved_stories':
                return <UserSavedStories 
                            savedStories={savedStories} 
                            handleSaveStory={handleSaveStory} 
                            savedStoryIds={savedStoryIds}
                            currentUser={currentUser}
                            isOwner={isOwner}
                            searchTerm={searchTerm}
                            handleSearchChange={handleSearchChange}
                        />;
            case 'read_stories':
                return <UserReadStories 
                            readStories={readStories} 
                            handleSaveStory={handleSaveStory} 
                            savedStoryIds={savedStoryIds}
                            handleUnmarkAsRead={handleUnmarkAsRead}
                            currentUser={currentUser}
                            searchTerm={searchTerm}
                            handleSearchChange={handleSearchChange}
                        />;
            case 'stories':
                return <UserStories 
                            stories={stories} 
                            handleSaveStory={handleSaveStory} 
                            savedStoryIds={savedStoryIds}
                            currentUser={currentUser}
                            isOwner={isOwner}
                            searchTerm={searchTerm}
                            handleSearchChange={handleSearchChange}
                        />;
            default:
                return null;
        }
    };

    const updateSlider = () => {
        if (!menuRef.current) return;
        const activeKey = content;
        const activeItem = menuItemRefs.current[activeKey];
        if (activeItem) {
            const { offsetLeft, clientWidth } = activeItem;
            setSliderStyle({
                left: offsetLeft,
                width: clientWidth
            });
        }
    };

    useEffect(() => {
        updateSlider();
        window.addEventListener('resize', updateSlider);
        return () => {
            window.removeEventListener('resize', updateSlider);
        };
    }, [content, profileUser]);

    if (loading || isOwner === null) {
        return <p>Loading profile...</p>;
    }

    return (
        <div className='main-profile-container'> 
            <div className='img-container-top'>
                <img src={books} alt="Banner" />
            </div>
            <div className="container-profile">
                <div className='container-info-user'>
                    {profileUser && (
                        <UserInfo 
                            user={profileUser} 
                            firstname={firstname} 
                            lastname={lastname} 
                            bio={bio} 
                            profileImage={profileImage} 
                            defaultAvatar={defaultAvatar} 
                            isOwner={isOwner} 
                            handleEdit={handleEditProfile}
                            baseImageUrl={baseImageUrl}
                        />
                    )}
                </div> 
                <div className='menu-container'>
                    <div className="menu" ref={menuRef}>
                        <div 
                            className={`menu-item ${content === 'stories' ? 'active' : ''}`} 
                            onClick={() => setContent('stories')}
                            ref={el => menuItemRefs.current['stories'] = el}
                        >
                            Published Stories
                        </div>
                        <div 
                            className={`menu-item ${content === 'saved_stories' ? 'active' : ''}`} 
                            onClick={() => setContent('saved_stories')}
                            ref={el => menuItemRefs.current['saved_stories'] = el}
                        >
                            Saved Stories
                        </div>
                        <div 
                            className={`menu-item ${content === 'read_stories' ? 'active' : ''}`} 
                            onClick={() => setContent('read_stories')}
                            ref={el => menuItemRefs.current['read_stories'] = el}
                        >
                            Read Stories
                        </div>
                        {isOwner && (
                            <div 
                                className={`menu-item ${content === 'settings' ? 'active' : ''}`} 
                                onClick={() => setContent('settings')}
                                ref={el => menuItemRefs.current['settings'] = el}
                            >
                                Settings
                            </div>
                        )}
                        <div 
                            className="slider" 
                            style={{
                                left: sliderStyle.left,
                                width: sliderStyle.width
                            }}
                        ></div>
                    </div>
                    <div className='div-line'></div>
                    <div className="profile">
                        {renderContent()}
                    </div>
                </div>
            </div>  
        </div>
    );
};

export default Profile;
