// Profile.js

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import './Profile.css';
import books from '../Assets/books.jpg';
import StoryCard from '../components/StoryCard';
// Subcomponentes definidos fora do componente principal

const UserInfo = React.memo(({ user, firstname, lastname, bio, profileImage, defaultAvatar, isOwner, handleEdit }) => (
    <div className="profile-content">
        <div className="user-info">
            <div className="user-img">
                <img 
                    src={profileImage || defaultAvatar} 
                    alt="Perfil" 
                    width="150" 
                    height="150" 
                />
            </div>
            <div>
                <div className='user-name-container'>
                    <p><strong>{user.username}</strong><br /></p>
                    <p>{firstname} {lastname}</p>
                </div>
                {/* <p><strong>Email:</strong> {user.email}</p> */}
                <div className='div-line'></div>
                <div className='container-info-medium'>
                    <p>Histórias:</p>
                    <p>{user.storyCount || 0}</p>
                </div>
                <div className='container-info-medium'>
                    <p>Favoritas:</p>
                    <p>{user.favoriteCount || 0}</p>
                </div>
                <div className='container-info-medium'>
                    <p>Histórias Lidas:</p>
                    <p>{user.readCount || 0}</p>
                </div>
                <p className='subtitle-container-info'>Bio</p>
                <p>{bio || "Sem bio ainda"}</p>
                {/* Mostrar botão de edição se for o dono do perfil */}
                {/* {isOwner && (
                    <button onClick={handleEdit} className="edit-profile-button">Editar Perfil</button>
                )} */}
            </div>
        </div>
    </div>
));

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
    defaultAvatar 
}) => (
    <div className="profile-content">
        <h2>Configurações</h2>
        <h3>Atualizar Imagem de Perfil</h3>
        <form onSubmit={handleImageUpload}>
            <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange} 
            />
            {imageFile && (
                <img 
                    src={profileImage} 
                    alt="Pré-visualização" 
                    width="100" 
                    height="100" 
                    style={{ borderRadius: '50%', marginTop: '10px' }} 
                />
            )}
            <button type="submit">Fazer Upload da Imagem</button>
        </form>
        <br /><br />
        <div className="settings-form">
            <label>
                Nome:
                <input 
                    type="text" 
                    value={firstname} 
                    onChange={(e) => setFirstname(e.target.value)} 
                    placeholder="Nome"
                />
            </label>
            <label>
                Sobrenome:
                <input 
                    type="text" 
                    value={lastname} 
                    onChange={(e) => setLastname(e.target.value)} 
                    placeholder="Sobrenome"
                />
            </label>
            <label>
                Bio:
                <textarea 
                    value={bio} 
                    onChange={(e) => setBio(e.target.value)} 
                    placeholder="Bio"
                />
            </label>
            <button onClick={handleUpdateProfile}>Salvar Alterações</button>
        </div>
    </div>
));

const UserSavedStories = React.memo(({ savedStories, handleSaveStory, savedStoryIds }) => (
    <div className="profile-content">
      <h2>Histórias Salvas</h2>
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
              />
            );
          })}
        </div>
      )}
    </div>
  ));

const UserStories = React.memo(({ stories, handleSaveStory, savedStoryIds }) => (
    <div className="profile-content">
        {stories.length === 0 ? (
            <p>Este usuário ainda não publicou histórias.</p>
        ) : (
            <div className="stories-grid-profile">
                {stories.map(story => {
                    const isSaved = savedStoryIds.includes(story.id);
                    return (
                        <div key={story.id} className='story-container2'>
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
                            <button
                                className="save-button"
                                onClick={() => handleSaveStory(story.id)}
                            >
                                {isSaved ? 'Remover História' : 'Salvar História'}
                            </button>
                        </div>
                    )
                })}
            </div>
        )}
    </div>
));

const Profile = () => {
    const { username } = useParams();
    const [profileUser, setProfileUser] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [stories, setStories] = useState([]);
    const [savedStories, setSavedStories] = useState([]);
    const [savedStoryIds, setSavedStoryIds] = useState([]);
    const [content, setContent] = useState('stories');
    const [bio, setBio] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [profileImage, setProfileImage] = useState("");
    const [imageFile, setImageFile] = useState(null);

    const [loading, setLoading] = useState(true);

    const defaultAvatar = "https://www.gravatar.com/avatar/?d=mp&f=y";

    // Função para buscar o usuário autenticado
    const fetchCurrentUser = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('Nenhum token encontrado');
            setLoading(false);
            return;
        }

        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
            const response = await api.get('/auth/me');
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
            setProfileImage(response.data.user.profile_image || defaultAvatar);
        } catch (error) {
            console.error('Erro ao buscar dados do perfil:', error);
            alert('Erro ao buscar dados do perfil.');
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

    // Função para buscar os IDs das histórias salvas pelo usuário autenticado
    const fetchCurrentUserSavedStoryIds = async () => {
        if (!currentUser) {
            console.log('Usuário não autenticado.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.log('Nenhum token encontrado');
                return;
            }

            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

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

    // useEffect para buscar histórias quando profileUser e currentUser forem definidos
    useEffect(() => {
        if (profileUser && currentUser) {
            fetchUserStories();
            fetchProfileUserSavedStories();
            fetchCurrentUserSavedStoryIds();
        }
    }, [profileUser, currentUser]);

    const [isOwner, setIsOwner] = useState(false);

    // useEffect para determinar se o usuário atual é o dono do perfil
    useEffect(() => {
        if (currentUser && profileUser) {
            const owner = String(currentUser.id) === String(profileUser.id);
            setIsOwner(owner);
            console.log('Current User:', currentUser);
            console.log('Profile User:', profileUser);
            console.log('isOwner:', owner);
        } else {
            setIsOwner(false);
        }
    }, [currentUser, profileUser]);

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
                fetchProfileUser(); // Recarrega o perfil com os novos dados
            }

            alert('Perfil atualizado com sucesso!');
        } catch (error) {
            console.error('Erro ao atualizar o perfil:', error);
            alert('Falha ao atualizar o perfil.');
        }
    };

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
                fetchProfileUser(); // Recarrega o perfil para mostrar a nova imagem
                alert('Imagem de perfil atualizada com sucesso!');
                setImageFile(null);
            } else {
                // Caso o backend não retorne um novo token, ainda assim atualizar o perfil
                fetchProfileUser();
                alert('Imagem de perfil atualizada com sucesso!');
                setImageFile(null);
            }
        } catch (error) {
            console.error('Erro ao fazer upload da imagem de perfil:', error);
            alert('Falha ao fazer upload da imagem de perfil.');
        }
    };

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
                setProfileImage(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImageFile(null);
            setProfileImage(profileUser.profile_image ? profileUser.profile_image : defaultAvatar);
        }
    };

    // Função para lidar com o clique no botão de editar perfil
    const handleEditProfile = () => {
        setContent('settings');
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
                        />;
            case 'saved_stories':
                return <UserSavedStories 
                            savedStories={savedStories} 
                            handleSaveStory={handleSaveStory} 
                            savedStoryIds={savedStoryIds} 
                        />;
            case 'stories':
                return <UserStories 
                            stories={stories} 
                            handleSaveStory={handleSaveStory} 
                            savedStoryIds={savedStoryIds} 
                        />;
            default:
                return null;
        }
    };

    if (loading) {
        return <p>Carregando perfil...</p>;
    }

    return (
        <div className='main-profile-container'> 
            <div className='img-container-top'>
                <img src={books} alt="" />
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
                        />
                    )}
                </div> 
                {/* Menu Atualizado */}
                <div className='menu-container'>
                    <div className="menu">
                        <div 
                            className={`menu-item ${content === 'stories' ? 'active' : ''}`} 
                            onClick={() => setContent('stories')}
                        >
                            Histórias
                        </div>
                        <div 
                            className={`menu-item ${content === 'saved_stories' ? 'active' : ''}`} 
                            onClick={() => setContent('saved_stories')}
                        >
                            Histórias Salvas
                        </div>
                        {isOwner && (
                            <div 
                                className={`menu-item ${content === 'settings' ? 'active' : ''}`} 
                                onClick={() => setContent('settings')}
                            >
                                Configurações
                            </div>
                        )}
                    </div>
                    <div className='border-line'></div>
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