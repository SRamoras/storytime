// auth.js

const jwt = require('jsonwebtoken');
const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../db');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Configuração do armazenamento para Multer
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');  // Pasta onde o arquivo será salvo
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

// Limite de tamanho do arquivo (por exemplo, 2MB)
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    fileFilter: fileFilter
});

// Middleware de autenticação
const authenticateToken = require('../middleware/authMiddleware');

// Rota de Registro
router.post('/register', async (req, res) => {
    const { username, firstname, lastname, email, password } = req.body;

    try {
        // Gera o hash da senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insere o usuário no banco de dados
        const result = await pool.query(
            'INSERT INTO users (username, firstname, lastname, email, password) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, email, created_at',
            [username, firstname, lastname, email, hashedPassword]
        );

        res.status(201).json({
            message: 'Usuário registrado com sucesso!',
            user: result.rows[0],
        });
    } catch (error) {
        console.error('Erro ao registrar o usuário:', error);
        res.status(500).json({ error: 'Erro ao registrar o usuário.' });
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

// Rota para listar histórias
router.get('/stories', async (req, res) => {
    const { user_id } = req.query; // Obter o user_id dos parâmetros de consulta
    console.log(`Recebido user_id: ${user_id}`); // Log para verificar o recebimento do user_id

    try {
        let result;

        if (user_id) {
            // Se um user_id for fornecido, filtrar as histórias por esse user_id
            result = await pool.query(
                `SELECT stories.*, users.username 
                 FROM stories 
                 JOIN users ON stories.user_id = users.id 
                 WHERE users.id = $1 
                 ORDER BY stories.created_at DESC`,
                [user_id]
            );
            console.log(`Histórias retornadas para user_id ${user_id}:`, result.rows);
        } else {
            // Caso contrário, retornar todas as histórias
            result = await pool.query(
                `SELECT stories.*, users.username 
                 FROM stories 
                 JOIN users ON stories.user_id = users.id 
                 ORDER BY stories.created_at DESC`
            );
            console.log(`Todas as histórias retornadas:`, result.rows);
        }

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Erro ao listar histórias:', error);
        res.status(500).json({ error: 'Erro ao listar histórias.' });
    }
});

// **Nova Rota POST para criar uma história**
router.post('/stories', authenticateToken, upload.single('img'), async (req, res) => {
    const { title, content } = req.body;
    const userId = req.user.id; // Obtido do middleware de autenticação

    // Validação básica
    if (!title || !content) {
        return res.status(400).json({ error: 'Título e conteúdo são obrigatórios.' });
    }

    let imageUrl = null;
    if (req.file) {
        // Construir a URL completa para acessar a imagem
        imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    try {
        // Inserir a nova história no banco de dados
        const result = await pool.query(
            `INSERT INTO stories (user_id, title, content, img) 
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [userId, title, content, imageUrl]
        );

        res.status(201).json({
            message: 'História criada com sucesso!',
            story: result.rows[0],
        });
    } catch (error) {
        console.error('Erro ao criar história:', error);
        res.status(500).json({ error: 'Erro ao criar história.' });
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

// Exporta o router **APÓS** todas as rotas estarem definidas
module.exports = router;
