
const jwt = require('jsonwebtoken');
const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../db');
const router = express.Router();
router.get('/test', (req, res) => {
    res.send('Rota de teste funcionando!');
});

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
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        console.log('Requisição recebida para login:', { username, password });

        // Verificar se o username existe no banco de dados
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (result.rows.length === 0) {
            console.log('Usuário não encontrado:', username);
            return res.status(401).json({ error: 'Usuário não encontrado.' });
        }

        const user = result.rows[0];
        console.log('Usuário encontrado no banco:', user);

        // Comparar a senha fornecida com a armazenada no banco
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Senha incorreta para o usuário:', username);
            return res.status(401).json({ error: 'Senha incorreta.' });
        }

        // Gerar um token JWT
        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
        console.log('Token gerado com sucesso:', token);

        res.status(200).json({ message: 'Login bem-sucedido!', token });
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({ error: 'Erro ao fazer login.' });
    }
});

const authenticateToken = require('../middleware/authMiddleware');

router.get('/protected-route', authenticateToken, (req, res) => {
    res.json({ message: 'Acesso permitido!', user: req.user });
});


router.post('/stories', authenticateToken, async (req, res) => {
    const { title, content } = req.body;
    const userId = req.user.id; // Obtido do token JWT

    try {
        const result = await pool.query(
            'INSERT INTO stories (user_id, title, content) VALUES ($1, $2, $3) RETURNING *',
            [userId, title, content]
        );
        res.status(201).json({ message: 'História criada com sucesso!', story: result.rows[0] });
    } catch (error) {
        console.error('Erro ao criar história:', error);
        res.status(500).json({ error: 'Erro ao criar história.' });
    }
});
router.get('/stories', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT stories.*, users.username FROM stories JOIN users ON stories.user_id = users.id ORDER BY stories.created_at DESC'
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Erro ao listar histórias:', error);
        res.status(500).json({ error: 'Erro ao listar histórias.' });
    }
});

module.exports = router;
