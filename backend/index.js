const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config(); // Carrega as variáveis de ambiente do arquivo .env

const app = express();
app.use(cors()); // Permite requisições do front-end
app.use(express.json()); // Lida com JSON no body das requisições

// Rota de teste
app.get('/', (req, res) => {
    res.send('API Running!');
});

// Porta do servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



const pool = require('./db');

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Erro ao conectar ao banco:', err);
    } else {
        console.log('Conexão ao banco bem-sucedida:', res.rows);
    }
});


const authRoutes = require('./routes/auth'); // Importa as rotas de autenticação
app.use('/api/auth', authRoutes); // Define o caminho base das rotas