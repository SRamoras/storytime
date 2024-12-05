// src/pages/Profile.js

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Profile.css';
import books from '../Assets/books.jpg';
import StoryCard from '../components/StoryCard';
import UserReadStories from '../components/UserReadStories';

// Subcomponentes definidos fora do componente principal

// Componente UserInfo atualizado
const UserInfo = React.memo(({ user, firstname, lastname, bio, profileImage, defaultAvatar, isOwner, handleEdit, baseImageUrl }) => {
    // Construir o caminho completo da imagem de perfil
    const profileImageSrc = profileImage 
        ? (profileImage.startsWith('data:') ? profileImage : `${baseImageUrl}${profileImage}`) 
        : defaultAvatar;

    return (
        <div className="profile-content">
            <div className="user-info">
                <div className="user-img">
                    <img 
                        src={profileImageSrc} 
                        alt="Perfil" 
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
                        <p className='bio-text'>{bio || "no info"}</p>
                    </div>

                    {/* Mostrar botão de edição se for o dono do perfil */}
                  
                </div>
            </div>
        </div>
    );
});

// Componente UserSettings atualizado com limites de caracteres
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
    // Construir o caminho completo da imagem para pré-visualização
    const profileImageSrc = profileImage 
        ? (profileImage.startsWith('data:') ? profileImage : `${baseImageUrl}${profileImage}`) 
        : defaultAvatar;

    // State to manage character counts
    const [firstnameCount, setFirstnameCount] = useState(firstname.length);
    const [lastnameCount, setLastnameCount] = useState(lastname.length);
    const [bioCount, setBioCount] = useState(bio.length);

    // Handlers to update character counts
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

    // Function to validate before updating profile
    const validateAndUpdateProfile = () => {
        if (firstname.length > 10) {
            alert('O primeiro nome não pode exceder 10 caracteres.');
            return;
        }
        if (lastname.length > 10) {
            alert('O sobrenome não pode exceder 10 caracteres.');
            return;
        }
        if (bio.length > 150) {
            alert('A bio não pode exceder 150 caracteres.');
            return;
        }
        handleUpdateProfile();
    };

    return (
        <div className="profile-content">
            <h2>Update your Avatar</h2>
        
            <form className='settings-form' onSubmit={handleImageUpload}>
               <div className='intro-img-container-input'>
                    {(imageFile || profileImage) && (
                        <img 
                            src={profileImageSrc} 
                            alt="Pré-visualização" 
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
                <h2>Update the text on your Profile</h2>
                
                <label>
                    Nome:
                    <input 
                        type="text" 
                        value={firstname} 
                        onChange={handleFirstnameChange} 
                        placeholder="Nome"
                        maxLength={10} // Enforce maximum of 10 characters
                    />
                    <small className="char-count">{firstnameCount}/10</small>
                </label>
                
                <label>
                    Sobrenome:
                    <input 
                        type="text" 
                        value={lastname} 
                        onChange={handleLastnameChange} 
                        placeholder="Sobrenome"
                        maxLength={10} // Enforce maximum of 10 characters
                    />
                    <small className="char-count">{lastnameCount}/10</small>
                </label>
                
                <label>
                    Bio:
                    <textarea 
                        value={bio} 
                        onChange={handleBioChange} 
                        placeholder="Bio"
                        maxLength={150} // Enforce maximum of 150 characters
                    />
                    <small className="char-count">{bioCount}/150</small>
                </label>
                
                <button 
                    type="button" 
                    className="save-text-button" 
                    onClick={validateAndUpdateProfile}
                >
                    Save text changes
                </button>
            </div>
        </div>
    );
});

// Componente UserSavedStories
const UserSavedStories = React.memo(({ savedStories, handleSaveStory, savedStoryIds, currentUser, isOwner }) => (
    <div className="profile-content">
        <h2>Saved Stories</h2>
        {savedStories.length === 0 ? (
            <p>Nenhuma história salva.</p>
        ) : (
            <div className="stories-grid-profile">
                {savedStories.map(story => {
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

// Componente UserStories
const UserStories = React.memo(({ stories, handleSaveStory, savedStoryIds, currentUser, isOwner }) => (
    <div className="profile-content">
        <h2>Published Stories</h2>
        {stories.length === 0 ? (
            <p>Este usuário ainda não publicou histórias.</p>
        ) : (
            <div className="stories-grid-profile">
                {stories.map(story => {
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

// Componente principal Profile
const Profile = () => {
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

    const [isOwner, setIsOwner] = useState(null); // Inicializa como null

    // Refs para os itens do menu
    const menuRef = useRef(null);
    const menuItemRefs = useRef({});

    // Estados para a barra deslizante
    const [sliderStyle, setSliderStyle] = useState({
        left: 0,
        width: 0
    });

    // Função para buscar o usuário autenticado
    const fetchCurrentUser = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('Nenhum token encontrado');
            setLoading(false);
            setIsOwner(false); // Não é o dono do perfil
            return;
        }

        try {
            const response = await api.get('/auth/me', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('Dados do usuário autenticado:', response.data);
            setCurrentUser(response.data);
        } catch (error) {
            console.error('Erro ao buscar dados do usuário autenticado:', error);
        } finally {
            setLoading(false);
        }
    };

    // Função para buscar os dados do perfil baseado no username da URL
    const fetchProfileUser = async () => {
        try {
            const response = await api.get(`/auth/users/${username}`);
            console.log('Dados do perfil recebidos:', response.data.user);
            setProfileUser(response.data.user);
            setBio(response.data.user.bio || "");
            setFirstname(response.data.user.firstname || "");
            setLastname(response.data.user.lastname || "");
            setProfileImage(response.data.user.profile_image || "");
        } catch (error) {
            console.error('Erro ao buscar dados do perfil:', error);
            alert('Erro ao buscar dados do perfil.');
        }
    };

    // Função para buscar as histórias do usuário
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
            console.error('Erro ao carregar histórias:', error);
            alert('Falha ao carregar histórias.');
        } finally {
            setLoading(false);
        }
    };

    // Função para buscar as histórias salvas pelo usuário do perfil
    const fetchProfileUserSavedStories = async () => {
        if (!profileUser) return;

        try {
            const response = await api.get(`/auth/saved_stories/${profileUser.id}`);
            setSavedStories(response.data);
        } catch (error) {
            console.error('Erro ao carregar histórias salvas do usuário do perfil:', error);
            alert('Falha ao carregar histórias salvas do usuário do perfil.');
        }
    };

    // Função para buscar as histórias lidas pelo usuário do perfil
    const fetchProfileUserReadStories = async () => {
        if (!profileUser) return;

        try {
            const response = await api.get(`/auth/read_stories/${profileUser.id}`);
            setReadStories(response.data);
            console.log('Histórias lidas obtidas:', response.data);
        } catch (error) {
            console.error('Erro ao carregar histórias lidas do usuário do perfil:', error);
            alert('Falha ao carregar histórias lidas do usuário do perfil.');
        }
    };

    // Função para buscar os IDs das histórias salvas pelo usuário autenticado
    const fetchCurrentUserSavedStoryIds = async () => {
        if (!currentUser) {
            console.log('Usuário não autenticado.');
            return;
        }

        try {
            const response = await api.get(`/auth/saved_stories/${currentUser.id}`);
            const ids = response.data.map(story => story.id);
            setSavedStoryIds(ids);
        } catch (error) {
            console.error('Erro ao carregar IDs de histórias salvas do usuário atual:', error);
            alert('Falha ao carregar IDs de histórias salvas do usuário atual.');
        }
    };

    // useEffect para buscar perfil e usuário atual quando o username mudar
    useEffect(() => {
        const initialize = async () => {
            setLoading(true);
            await fetchCurrentUser();
            await fetchProfileUser();
        };
        initialize();
    }, [username]);

    // useEffect para determinar se o usuário atual é o dono do perfil
    useEffect(() => {
        if (currentUser && profileUser) {
            const owner = String(currentUser.id) === String(profileUser.id);
            setIsOwner(owner);
        } else {
            setIsOwner(false);
        }
    }, [currentUser, profileUser]);

    // useEffect para buscar histórias quando profileUser e currentUser forem definidos
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

    // useEffect para definir a aba ativa com base no parâmetro de consulta 'tab'
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

    // Função para salvar ou remover a história
    const handleSaveStory = async (storyId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Você precisa estar logado para salvar histórias.');
            return;
        }

        if (!currentUser) {
            alert('Erro ao obter o ID do usuário.');
            return;
        }

        try {
            const isSaved = savedStoryIds.includes(storyId);

            if (isSaved) {
                // Remover a história salva
                await api.delete(`/auth/save_story/${storyId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                alert('História removida com sucesso!');
                // Atualizar o estado local
                setSavedStoryIds(savedStoryIds.filter(id => id !== storyId));
            } else {
                // Salvar a história
                await api.post('/auth/save_story', { storyId }, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });
                alert('História salva com sucesso!');
                // Atualizar o estado local
                setSavedStoryIds([...savedStoryIds, storyId]);
            }
        } catch (error) {
            console.error('Erro ao salvar/remover a história:', error);
            alert('Erro ao salvar/remover a história.');
        }
    };

    // Função para atualizar o perfil
    const handleUpdateProfile = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('Nenhum token encontrado para atualizar o perfil.');
            return;
        }

        try {
            // Atualizar outros campos do perfil
            const response = await api.put('/auth/update-profile', { bio, firstname, lastname }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.data.token) {
                localStorage.setItem('token', response.data.token); // Atualiza o token no localStorage
                await fetchProfileUser(); // Recarrega o perfil com os novos dados
            }

            alert('Perfil atualizado com sucesso!');
        } catch (error) {
            console.error('Erro ao atualizar o perfil:', error);
            alert('Falha ao atualizar o perfil.');
        }
    };

    // Função para fazer upload da imagem de perfil
    const handleImageUpload = async (e) => {
        e.preventDefault();

        if (!imageFile) {
            alert('Por favor, selecione uma imagem para upload.');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            alert('Nenhum token encontrado para fazer upload da imagem.');
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
                localStorage.setItem('token', response.data.token); // Atualiza o token no localStorage
                await fetchProfileUser(); // Recarrega o perfil para mostrar a nova imagem
                alert('Imagem de perfil atualizada com sucesso!');
                setImageFile(null);
            } else {
                // Caso o backend não retorne um novo token, ainda assim atualizar o perfil
                await fetchProfileUser();
                alert('Imagem de perfil atualizada com sucesso!');
                setImageFile(null);
            }
        } catch (error) {
            console.error('Erro ao fazer upload da imagem de perfil:', error);
            alert('Falha ao fazer upload da imagem de perfil.');
        }
    };

    // Função para lidar com a mudança na seleção de imagem
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(file.type)) {
                alert('Apenas arquivos de imagem são permitidos (jpeg, jpg, png, gif).');
                return;
            }

            const maxSize = 2 * 1024 * 1024; // 2MB
            if (file.size > maxSize) {
                alert('A imagem deve ter no máximo 2MB.');
                return;
            }

            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result); // Data URL para pré-visualização
            };
            reader.readAsDataURL(file);
        } else {
            setImageFile(null);
            setProfileImage(profileUser.profile_image ? `${baseImageUrl}${profileUser.profile_image}` : defaultAvatar);
        }
    };

    // Função para lidar com o clique no botão de editar perfil
    const handleEditProfile = () => {
        setContent('settings');
    };

    // Função para desmarcar uma história como lida
    const handleUnmarkAsRead = async (storyId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Você precisa estar logado para remover histórias lidas.');
            return;
        }

        if (!currentUser) {
            alert('Erro ao obter o ID do usuário.');
            return;
        }

        try {
            // Remover a história lida
            await api.delete(`/auth/read_story/${storyId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert('História removida das lidas com sucesso!');
            // Atualizar o estado local, removendo a história das lidas
            setReadStories(readStories.filter(story => story.id !== storyId));
        } catch (error) {
            console.error('Erro ao remover a história lida:', error);
            alert('Erro ao remover a história lida.');
        }
    };

    // Função para renderizar o conteúdo com base no menu selecionado
    const renderContent = () => {
        if (!profileUser) {
            return <p>Carregando perfil...</p>;
        }

        switch(content) {
            case 'settings':
                if (!isOwner) return null; // Apenas o dono pode ver as configurações
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
                        />;
            case 'read_stories':
                return <UserReadStories 
                            readStories={readStories} 
                            handleSaveStory={handleSaveStory} 
                            savedStoryIds={savedStoryIds}
                            handleUnmarkAsRead={handleUnmarkAsRead}
                            currentUser={currentUser} // Passa currentUser
                        />;
            case 'stories':
                return <UserStories 
                            stories={stories} 
                            handleSaveStory={handleSaveStory} 
                            savedStoryIds={savedStoryIds}
                            currentUser={currentUser}
                            isOwner={isOwner}
                        />;
            default:
                return null;
        }
    };

    // Função para atualizar a barra deslizante
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

    // useEffect para atualizar a barra deslizante quando o conteúdo mudar ou a janela for redimensionada
    useEffect(() => {
        updateSlider();
        window.addEventListener('resize', updateSlider);
        return () => {
            window.removeEventListener('resize', updateSlider);
        };
    }, [content, profileUser]);

    if (loading || isOwner === null) {
        return <p>Carregando perfil...</p>;
    }

    return (
        <div className='main-profile-container'> 
            <div className='img-container-top'>
                <img src={books} alt="Banner" />
            </div>
            <div className="container-profile">
                {/* Exibição Permanente do UserInfo */}
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
                {/* Menu Atualizado */}
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
                        {/* Barra Deslizante */}
                        <div 
                            className="slider" 
                            style={{
                                left: sliderStyle.left,
                                width: sliderStyle.width
                            }}
                        ></div>
                    </div>
                    <div className='div-line'></div>
                    {/* Conteúdo Condicional */}
                    <div className="profile">
                        {renderContent()}
                    </div>
                </div>
            </div>  
        </div>
    );
};

export default Profile;
