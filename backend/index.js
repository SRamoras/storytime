// backend/index.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config(); // Carrega as variáveis de ambiente do arquivo .env

const app = express();

// Configuração detalhada do CORS
app.use(cors({
    origin: 'https://sramoras.github.io/StoryTime', // URL do seu frontend no GitHub Pages
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 204
}));

app.use(express.json()); // Lida com JSON no body das requisições

// Servir a pasta uploads como estática
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rota de teste
app.get('/', (req, res) => {
    res.send('API Running!');
});

// Importar as rotas
const authRoutes = require('./routes/auth'); // Importa as rotas de autenticação
app.use('/api/auth', authRoutes);

// Porta do servidor (usando a variável de ambiente)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Conexão com o banco de dados
const pool = require('./db');

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Erro ao conectar ao banco:', err);
    } else {
        console.log('Conexão ao banco bem-sucedida:', res.rows);
    }
});
