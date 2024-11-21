// Profile.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Importar useParams para obter parâmetros da URL
import api from '../services/api';
import './Profile.css';
import books from '../Assets/books.jpg';

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
                    <p>Storys:</p>
                    <p>0</p>
                </div>
                <div className='container-info-medium'>
                    <p>Favourited:</p>
                    <p>0</p>
                </div>
                <div className='container-info-medium'>
                    <p>Stories Read</p>
                    <p>0</p>
                </div>
                <p className='subtitle-container-info'>Bio</p>
                <p>{bio || "No bio yet"}</p>
                {/* Mostrar botão de edição se for o dono do perfil */}
                {isOwner && (
                    <button onClick={handleEdit} className="edit-profile-button">Editar Perfil</button>
                )}
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

const UserPhotos = React.memo(() => (
    <div className="profile-content">
        <h2>Fotos</h2>
        <p>Aqui vão algumas fotos...</p>
        {/* Adicione aqui a lógica para exibir as fotos do usuário */}
    </div>
));

const UserStories = React.memo(({ stories }) => (
    <div className="profile-content">
        <h2>Histórias</h2>
        {stories.length === 0 ? (
            <p>Este usuário ainda não publicou histórias.</p>
        ) : (
            <ul>
                {stories.map(story => (
                    <li key={story.id}>
                        <h3>{story.title}</h3>
                        <p>{story.content}</p>
                        <small>Por: {story.username}</small>
                    </li>
                ))}
            </ul>
        )}
    </div>
));

const Profile = () => {
    const { username } = useParams(); // Obter o parâmetro 'username' da URL
    const [profileUser, setProfileUser] = useState(null); // Usuário do perfil que está sendo visualizado
    const [currentUser, setCurrentUser] = useState(null); // Usuário autenticado
    const [stories, setStories] = useState([]);
    const [content, setContent] = useState('stories'); // Estado para controlar o conteúdo exibido
    const [bio, setBio] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [profileImage, setProfileImage] = useState("");
    const [imageFile, setImageFile] = useState(null); // Estado para armazenar o arquivo selecionado

    const [loading, setLoading] = useState(true); // Estado de carregamento

    const defaultAvatar = "https://www.gravatar.com/avatar/?d=mp&f=y"; // Link para avatar padrão

    // Função para buscar os dados do perfil baseado no username da URL
    const fetchProfileUser = async () => {
        try {
            const response = await api.get(`/auth/users/${username}`); // Endpoint para buscar usuário por username
            console.log('Dados do perfil recebidos:', response.data.user); // Log para depuração
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
            const response = await api.get('/auth/protected-route'); // Endpoint para obter usuário autenticado
            console.log('Dados do usuário autenticado:', response.data.user); // Log para depuração
            setCurrentUser(response.data.user);
        } catch (error) {
            console.error('Erro ao buscar dados do usuário autenticado:', error);
        } finally {
            setLoading(false);
        }
    };

    // Buscar as histórias do usuário do perfil
    const fetchUserStories = async () => {
        if (!profileUser) return;  // Certifique-se de que profileUser está definido
        try {
            console.log(`Buscando histórias para user_id: ${profileUser.id}`);
            // Faz uma solicitação para obter as histórias do usuário atual
            const response = await api.get(`/auth/stories?user_id=${profileUser.id}`);
            console.log('Histórias recebidas:', response.data);
            setStories(response.data);
        } catch (error) {
            console.error('Erro ao carregar histórias:', error);
            alert('Erro ao carregar histórias.');
        }
    };

    // useEffect para buscar perfil e usuário atual quando o username mudar
    useEffect(() => {
        setLoading(true);
        fetchProfileUser();
        fetchCurrentUser();
    }, [username]); // Refazer a chamada quando o username na URL mudar

    // useEffect para buscar histórias quando profileUser for definido
    useEffect(() => {
        fetchUserStories();
    }, [profileUser]); // Refazer a chamada quando profileUser mudar

    const [isOwner, setIsOwner] = useState(false); // Estado para verificar se é o dono do perfil

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
            case 'photos':
                return <UserPhotos />;
            case 'stories':
                return <UserStories stories={stories} />;
            default:
                return null;
        }
    };

    // Função para lidar com o clique no botão de editar perfil
    const handleEditProfile = () => {
        setContent('settings');
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
                        {/* Removida a opção "Informações" e adicionada "Histórias" */}
                        <div 
                            className={`menu-item ${content === 'stories' ? 'active' : ''}`} 
                            onClick={() => setContent('stories')}
                        >
                            Histórias
                        </div>
                        {isOwner && (
                            <div 
                                className={`menu-item ${content === 'settings' ? 'active' : ''}`} 
                                onClick={() => setContent('settings')}
                            >
                                Configurações
                            </div>
                        )}
                        <div 
                            className={`menu-item ${content === 'photos' ? 'active' : ''}`} 
                            onClick={() => setContent('photos')}
                        >
                            Fotos
                        </div>
                     
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
