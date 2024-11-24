// routes/auth.js

const jwt = require('jsonwebtoken');
const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../db');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuração do armazenamento para Multer
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const uploadDir = path.join(__dirname, '..', 'uploads');
        // Certifique-se de que a pasta existe
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Adiciona extensão do arquivo
    }
});

// Filtro para aceitar apenas imagens
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Apenas arquivos de imagem são permitidos!'));
    }
};

// Limite de tamanho do arquivo (5MB)
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: fileFilter
});

// Middleware de autenticação
const authenticateToken = require('../middleware/authMiddleware');

// Rotas de Registro
router.post('/register', async (req, res) => {
    const { username, firstname, lastname, email, password } = req.body;

    console.log('Recebendo requisição de registro:', { username, email });

    try {
        // Gera o hash da senha
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Senha hash gerada.');

        // Insere o usuário no banco de dados
        const result = await pool.query(
            'INSERT INTO users (username, firstname, lastname, email, password) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, email, created_at',
            [username, firstname, lastname, email, hashedPassword]
        );
        console.log('Usuário inserido no banco de dados:', result.rows[0]);

        res.status(201).json({
            message: 'Usuário registrado com sucesso!',
            user: result.rows[0],
        });
    } catch (error) {
        console.error('Erro ao registrar o usuário:', error);

        // Verifica se o erro é devido a violação de constraints (e.g., username ou email duplicados)
        if (error.code === '23505') { // Código de erro para violação de unique constraint no PostgreSQL
            const field = error.constraint.includes('username') ? 'username' : 'email';
            return res.status(400).json({ error: `O ${field} já está em uso.` });
        }

        res.status(500).json({ error: 'Erro ao registrar o usuário.' });
    }
});// Rota POST para salvar uma história

// Rota POST para salvar uma história
router.post('/save_story', authenticateToken, async (req, res) => {
    console.log('Recebendo requisição para salvar história.');
    console.log('req.body:', req.body);
    const { storyId } = req.body;
    const userId = req.user.id;
    const dataSaved = new Date();

    console.log('Dados recebidos:', { userId, storyId });

    try {
        // Verificar se a história já foi salva pelo usuário
        const checkResult = await pool.query(
            'SELECT * FROM storiessaved WHERE userid = $1 AND storyid = $2',
            [userId, storyId]
        );

        console.log('Resultado da verificação:', checkResult.rows);

        if (checkResult.rows.length > 0) {
            return res.status(400).json({ error: 'História já salva.' });
        }

        // Inserir na tabela StoriesSaved
        const insertResult = await pool.query(
            'INSERT INTO storiessaved (userid, storyid, datasaved) VALUES ($1, $2, $3)',
            [userId, storyId, dataSaved]
        );

        console.log('História salva com sucesso:', insertResult);

        res.status(201).json({ message: 'História salva com sucesso!' });
    } catch (error) {
        console.error('Erro ao salvar história:', error);
        res.status(500).json({ error: 'Erro interno ao salvar história.' });
    }
});


// Rota GET para obter as histórias salvas por um usuário
// Rota GET para obter as histórias salvas por um usuário
// Rota GET para obter as histórias salvas por um usuário
router.get('/saved_stories/:userId', authenticateToken, async (req, res) => {
    const { userId } = req.params;
    console.log(`Rota /saved_stories/${userId} chamada`);

    try {
        const result = await pool.query(
            `SELECT stories.*, users.username 
             FROM storiessaved 
             JOIN stories ON storiessaved.storyid = stories.id 
             JOIN users ON stories.user_id = users.id 
             WHERE storiessaved.userid = $1`,
            [userId]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Erro ao carregar histórias salvas:', error);
        res.status(500).json({ error: 'Erro interno ao carregar histórias salvas.' });
    }
});

router.delete('/save_story/:storyId', authenticateToken, async (req, res) => {
    const { storyId } = req.params;
    const userId = req.user.id;

    console.log('Recebendo requisição para remover história salva.');
    console.log('Dados recebidos:', { userId, storyId });

    try {
        // Verificar se a história está salva pelo usuário
        const checkResult = await pool.query(
            'SELECT * FROM storiessaved WHERE userid = $1 AND storyid = $2',
            [userId, storyId]
        );

        console.log('Resultado da verificação:', checkResult.rows);

        if (checkResult.rows.length === 0) {
            return res.status(400).json({ error: 'História não está salva.' });
        }

        // Remover a história salva
        const deleteResult = await pool.query(
            'DELETE FROM storiessaved WHERE userid = $1 AND storyid = $2',
            [userId, storyId]
        );

        console.log('História removida com sucesso:', deleteResult);

        res.status(200).json({ message: 'História removida com sucesso!' });
    } catch (error) {
        console.error('Erro ao remover história salva:', error);
        res.status(500).json({ error: 'Erro interno ao remover história salva.' });
    }
});
// Rota para retornar informações do usuário autenticado
router.get('/me', authenticateToken, async (req, res) => {
    try {
        // Retorna apenas o que for necessário
        const { id, username, email, firstname, lastname, bio, profile_image } = req.user;
        res.status(200).json({
            id,
            username,
            email,
            firstname,
            lastname,
            bio,
            profile_image,
        });
    } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        res.status(500).json({ error: 'Erro interno ao carregar dados do usuário.' });
    }
});

// Rota para obter informações do usuário por username
router.get('/users/:username', async (req, res) => {
    const { username } = req.params;

    try {
        const result = await pool.query(
            'SELECT id, username, firstname, lastname, email, bio, profile_image FROM users WHERE username = $1',
            [username]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        res.status(200).json({ user: result.rows[0] });
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        res.status(500).json({ error: 'Erro ao buscar usuário.' });
    }
});

// Rota de Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Busca o usuário no banco de dados
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Usuário não encontrado.' });
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Senha incorreta.' });
        }

        // Gera o token JWT
        const token = jwt.sign({
            id: user.id,
            username: user.username,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
            bio: user.bio,
            profile_image: user.profile_image
        }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login bem-sucedido!', token });
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({ error: 'Erro ao fazer login.' });
    }
});

// Rota Protegida para Teste
router.get('/protected-route', authenticateToken, (req, res) => {
    res.json({ message: 'Acesso permitido!', user: req.user });
});

// 1. Rota GET para obter histórias do usuário autenticado ou de outro usuário via query
router.get('/stories', authenticateToken, async (req, res) => {
    console.log('GET /stories foi chamado');
    const { id: authUserId } = req.user;
    const { user_id } = req.query;

    const userId = user_id || authUserId;
    console.log('Buscando histórias para user_id:', userId);

    try {
        const result = await pool.query(
            `SELECT * FROM stories WHERE user_id = $1 ORDER BY created_at DESC`,
            [userId]
        );
        console.log('Histórias carregadas:', result.rows);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Erro ao carregar histórias:', error);
        res.status(500).json({ error: 'Erro interno ao carregar histórias.' });
    }
});

// 2. Rota GET para obter histórias de um usuário específico pelo username
router.get('/stories/:username', async (req, res) => {
    const { username } = req.params;

    try {
        // Primeiro, obtenha o ID do usuário com base no username
        const userResult = await pool.query(
            'SELECT id FROM users WHERE username = $1',
            [username]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        const userId = userResult.rows[0].id;

        // Agora, obtenha as histórias desse usuário
        const storiesResult = await pool.query(
            `SELECT * FROM stories WHERE user_id = $1 ORDER BY created_at DESC`,
            [userId]
        );

        console.log(`Histórias carregadas para o usuário ${username}:`, storiesResult.rows);
        res.status(200).json(storiesResult.rows);
    } catch (error) {
        console.error('Erro ao carregar histórias:', error);
        res.status(500).json({ error: 'Erro interno ao carregar histórias.' });
    }
});
router.get('/stories/id/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        const storyResult = await pool.query(
            'SELECT stories.*, users.username FROM stories JOIN users ON stories.user_id = users.id WHERE stories.id = $1',
            [id]
        );

        if (storyResult.rows.length === 0) {
            return res.status(404).json({ error: 'História não encontrada.' });
        }

        console.log(`História carregada com ID ${id}:`, storyResult.rows[0]);
        res.status(200).json(storyResult.rows[0]);
    } catch (error) {
        console.error('Erro ao carregar história:', error);
        res.status(500).json({ error: 'Erro interno ao carregar história.' });
    }
});
router.get('/stories_all', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT stories.*, users.username 
             FROM stories 
             JOIN users ON stories.user_id = users.id 
             ORDER BY stories.created_at DESC`
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Erro ao carregar todas as histórias:', error);
        res.status(500).json({ error: 'Erro interno ao carregar histórias.' });
    }
});
// 3. Rota POST para criar uma nova história
// 3. Rota POST para criar uma nova história
router.post('/stories', authenticateToken, upload.single('img'), async (req, res) => {
    console.log('Recebendo requisição para criar história');
    console.log('Body:', req.body);
    console.log('Arquivo:', req.file);

    const { title, content, category } = req.body;
    const userId = req.user.id; // ID do usuário autenticado

    // Validação dos campos obrigatórios
    if (!title || !content || !category) {
        return res.status(400).json({ error: 'Título, conteúdo e categoria são obrigatórios.' });
    }

    // Obter o caminho da imagem, se houver
    let imageUrl = null;
    if (req.file) {
        imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        console.log('Imagem recebida e salva em:', imageUrl);
    }

    try {
        const result = await pool.query(
            `INSERT INTO stories (title, content, category, user_id, img, created_at)
             VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *`,
            [title, content, category, userId, imageUrl]
        );

        console.log('Nova história criada:', result.rows[0]);
        res.status(201).json(result.rows[0]); // Retorna a história criada
    } catch (error) {
        console.error('Erro ao criar história:', error);
        res.status(500).json({ error: 'Erro interno ao criar história.' });
    }
});

// Rota para atualizar o perfil do usuário
router.put('/update-profile', authenticateToken, async (req, res) => {
    const { bio, firstname, lastname } = req.body;
    const userId = req.user.id;  // Certifique-se que req.user.id está disponível e correto

    try {
        const updateResult = await pool.query(
            'UPDATE users SET bio = $1, firstname = $2, lastname = $3 WHERE id = $4 RETURNING *',
            [bio, firstname, lastname, userId]
        );

        if (updateResult.rows.length > 0) {
            const updatedUser = updateResult.rows[0];

            // Recria o token com as informações atualizadas
            const newToken = jwt.sign({
                id: updatedUser.id,
                username: updatedUser.username,
                email: updatedUser.email,
                firstname: updatedUser.firstname,
                lastname: updatedUser.lastname,
                bio: updatedUser.bio,
                profile_image: updatedUser.profile_image
            }, process.env.JWT_SECRET, { expiresIn: '1h' });

            res.status(200).json({ message: 'Perfil atualizado com sucesso!', token: newToken, user: updatedUser });
        } else {
            res.status(404).json({ message: 'Usuário não encontrado.' });
        }
    } catch (error) {
        console.error('Erro ao atualizar o perfil:', error);
        res.status(500).json({ error: 'Falha ao atualizar o perfil.' });
    }
});

// Rota para upload de imagem de perfil
router.post('/upload-profile-image', authenticateToken, upload.single('profileImage'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
    }

    const imagePath = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    try {
        const userId = req.user.id; // Certifique-se de que o ID do usuário está sendo extraído corretamente do token

        // Atualiza o caminho da imagem no banco de dados usando pool.query
        const updateResult = await pool.query('UPDATE users SET profile_image = $1 WHERE id = $2 RETURNING *', [imagePath, userId]);

        if (updateResult.rows.length > 0) {
            const updatedUser = updateResult.rows[0];

            // Recria o token com as informações atualizadas
            const newToken = jwt.sign({
                id: updatedUser.id,
                username: updatedUser.username,
                email: updatedUser.email,
                firstname: updatedUser.firstname,
                lastname: updatedUser.lastname,
                bio: updatedUser.bio,
                profile_image: updatedUser.profile_image
            }, process.env.JWT_SECRET, { expiresIn: '1h' });

            res.status(200).json({ message: 'Imagem de perfil atualizada com sucesso!', token: newToken, imagePath });
        } else {
            res.status(404).json({ message: 'Usuário não encontrado.' });
        }
    } catch (error) {
        console.error('Erro no banco de dados:', error);
        res.status(500).json({ error: 'Falha ao atualizar a imagem de perfil no banco de dados.' });
    }
});

// Rota de teste existente
router.get('/test', (req, res) => {
    res.json({ message: 'Rota de teste funciona!' });
});

// Exporta o router **APÓS** todas as rotas estarem definidas
module.exports = router;
