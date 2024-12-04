// routes/auth.js

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('../db'); // Assegure-se de que o caminho está correto
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Middleware de autenticação
const authenticateToken = require('../middleware/authMiddleware');

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

// ============================
// Rotas de Autenticação
// ============================

/**
 * Rota de Registro de Usuário
 */
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
});

/**
 * Rota de Login de Usuário
 */
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

/**
 * Rota Protegida para Teste
 */
router.get('/protected-route', authenticateToken, (req, res) => {
    res.json({ message: 'Acesso permitido!', user: req.user });
});

// ============================
// Rotas de Histórias
// ============================

/**
 * Rota POST para Criar uma Nova História
 * Endpoint: /auth/stories
 */
router.post('/stories', authenticateToken, upload.single('img'), async (req, res) => {
    console.log('POST /stories foi chamado');

    const { id: authUserId } = req.user;
    const { title, content, category_id } = req.body; // Alterado para category_id
    const image = req.file ? req.file.filename : null;

    // Log dos dados recebidos
    console.log('Dados recebidos:', { title, content, category_id, image });

    // Validação dos campos obrigatórios
    if (!title || !content || !category_id) {
        return res.status(400).json({ error: 'Title, content, and category_id são obrigatórios.' });
    }

    // Converter category_id para número
    const parsedCategoryId = parseInt(category_id, 10);

    if (isNaN(parsedCategoryId)) {
        return res.status(400).json({ error: 'category_id deve ser um número válido.' });
    }

    try {
        // Verificar se o category_id existe na tabela categories
        const categoryCheck = await pool.query(
            'SELECT id FROM categories WHERE id = $1',
            [parsedCategoryId]
        );

        if (categoryCheck.rows.length === 0) {
            return res.status(400).json({ error: 'category_id inválido. Categoria não existe.' });
        }

        // Inserir a nova história no banco de dados usando category_id
        const result = await pool.query(
            `INSERT INTO stories (user_id, title, content, category_id, img, created_at) 
             VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *`,
            [authUserId, title, content, parsedCategoryId, image]
        );
        console.log('Nova história criada:', result.rows[0]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Erro ao criar história:', error);
        res.status(500).json({ error: 'Erro interno ao criar história.' });
    }
});











router.post('/read_story', authenticateToken, async (req, res) => {
    const { storyId } = req.body;
    const userId = req.user.id;
    const datavased = new Date();

    console.log('Recebendo requisição para marcar história como lida:', { userId, storyId });

    try {
        // Verificar se a história já foi marcada como lida pelo usuário
        const checkResult = await pool.query(
            'SELECT * FROM readstories WHERE userid = $1 AND storyid = $2',
            [userId, storyId]
        );

        if (checkResult.rows.length > 0) {
            return res.status(400).json({ error: 'História já marcada como lida.' });
        }

        // Inserir na tabela readstories
        const insertResult = await pool.query(
            'INSERT INTO readstories (userid, storyid, datavased) VALUES ($1, $2, $3) RETURNING *',
            [userId, storyId, datavased]
        );

        res.status(201).json({ message: 'História marcada como lida com sucesso!', readStory: insertResult.rows[0] });
    } catch (error) {
        console.error('Erro ao marcar história como lida:', error);
        res.status(500).json({ error: 'Erro interno ao marcar história como lida.' });
    }
});

/**
 * Rota DELETE para Desmarcar uma História como Lida
 * Endpoint: /auth/read_story/:storyId
 */
router.delete('/read_story/:storyId', authenticateToken, async (req, res) => {
    const { storyId } = req.params;
    const userId = req.user.id;

    console.log(`Recebendo requisição para desmarcar história como lida: UserID=${userId}, StoryID=${storyId}`);

    try {
        // Verificar se a história está marcada como lida
        const checkResult = await pool.query(
            'SELECT * FROM readstories WHERE userid = $1 AND storyid = $2',
            [userId, storyId]
        );

        if (checkResult.rows.length === 0) {
            return res.status(400).json({ error: 'História não está marcada como lida.' });
        }

        // Remover a marcação de lida
        await pool.query(
            'DELETE FROM readstories WHERE userid = $1 AND storyid = $2',
            [userId, storyId]
        );

        res.status(200).json({ message: 'História desmarcada como lida com sucesso!' });
    } catch (error) {
        console.error('Erro ao desmarcar história como lida:', error);
        res.status(500).json({ error: 'Erro interno ao desmarcar história como lida.' });
    }
});

/**
 * Rota GET para Obter Todas as Histórias Lidas de um Usuário
 * Endpoint: /auth/read_stories/:userId
 */
/**
 * Rota GET para Obter Todas as Histórias Lidas de um Usuário
 * Endpoint: /auth/read_stories/:userId
 */


// Rota GET para Obter Todas as Histórias Lidas de um Usuário
// Endpoint: /auth/read_stories/:userId
// Rota GET para Obter Todas as Histórias Lidas de um Usuário
router.get('/read_stories/:userId', authenticateToken, async (req, res) => {
    const { userId } = req.params;

    try {
        const result = await pool.query(
            `SELECT stories.id AS id, 
                    readstories.id AS read_id, 
                    readstories.userid, 
                    readstories.storyid, 
                    readstories.datavased,
                    stories.title, 
                    stories.content, 
                    stories.category_id, 
                    stories.img,
                    stories.user_id AS user_id,  -- Adicione esta linha
                    categories.name AS category,
                    users.username, 
                    users.profile_image
             FROM readstories
             JOIN stories ON readstories.storyid = stories.id
             JOIN users ON stories.user_id = users.id
             JOIN categories ON stories.category_id = categories.id
             WHERE readstories.userid = $1
             ORDER BY readstories.datavased DESC`,
            [userId]
        );

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Erro ao obter histórias lidas:', error);
        res.status(500).json({ error: 'Erro interno ao obter histórias lidas.' });
    }
});



/**
 * Rota GET para Obter Todas as Histórias com Nome da Categoria
 * Endpoint: /auth/stories_all
 */
router.get('/stories_all', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT stories.*, categories.name AS category, users.username, users.profile_image 
             FROM stories 
             JOIN users ON stories.user_id = users.id 
             JOIN categories ON stories.category_id = categories.id 
             ORDER BY stories.created_at DESC`
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Erro ao carregar todas as histórias:', error);
        res.status(500).json({ error: 'Erro interno ao carregar histórias.' });
    }
});

/**
 * Rota GET para Obter Histórias de um Usuário Específico pelo Username
 * Endpoint: /auth/stories/:username
 */
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

        // Agora, obtenha as histórias desse usuário com username e profile_image
        const storiesResult = await pool.query(
            `SELECT stories.*, users.username, users.profile_image, categories.name AS category
             FROM stories
             JOIN users ON stories.user_id = users.id
             JOIN categories ON stories.category_id = categories.id
             WHERE stories.user_id = $1
             ORDER BY stories.created_at DESC`,
            [userId]
        );

        console.log(`Histórias carregadas para o usuário ${username}:`, storiesResult.rows);
        res.status(200).json(storiesResult.rows);
    } catch (error) {
        console.error('Erro ao carregar histórias:', error);
        res.status(500).json({ error: 'Erro interno ao carregar histórias.' });
    }
});

/**
 * Rota GET para Obter uma História pelo ID
 * Endpoint: /auth/stories/id/:id
 */

router.delete('/stories/:id', authenticateToken, async (req, res) => {
    const storyId = req.params.id;
    const { id: authUserId } = req.user;

    console.log(`DELETE /stories/${storyId} chamado por usuário ID: ${authUserId}`);

    try {
        // Verificar se a história existe e pertence ao usuário
        const storyCheck = await pool.query(
            'SELECT * FROM stories WHERE id = $1',
            [storyId]
        );

        if (storyCheck.rows.length === 0) {
            return res.status(404).json({ error: 'História não encontrada.' });
        }

        const story = storyCheck.rows[0];

        if (story.user_id !== authUserId) {
            return res.status(403).json({ error: 'Acesso negado. Você não pode apagar esta história.' });
        }

        // Iniciar uma transação para garantir a atomicidade
        await pool.query('BEGIN');

        try {
            // Remover as referências na tabela storiessaved
            await pool.query(
                'DELETE FROM storiessaved WHERE storyid = $1',
                [storyId]
            );
            console.log(`Referências na tabela storiessaved para história ID: ${storyId} foram removidas.`);

            // Remover a imagem associada, se existir
            if (story.img) {
                const imagePath = path.join(__dirname, '..', 'uploads', story.img);
                fs.unlink(imagePath, (err) => {
                    if (err) {
                        console.error(`Erro ao apagar a imagem: ${imagePath}`, err);
                        // Não retornamos erro aqui para não bloquear a deleção da história
                    } else {
                        console.log(`Imagem apagada: ${imagePath}`);
                    }
                });
            }

            // Apagar a história do banco de dados
            await pool.query(
                'DELETE FROM stories WHERE id = $1',
                [storyId]
            );

            // Confirmar a transação
            await pool.query('COMMIT');

            console.log(`História ID: ${storyId} apagada por usuário ID: ${authUserId}`);
            res.status(200).json({ message: 'História apagada com sucesso!' });
        } catch (error) {
            // Reverter a transação em caso de erro
            await pool.query('ROLLBACK');
            throw error;
        }
    } catch (error) {
        console.error('Erro ao apagar história:', error);
        res.status(500).json({ error: 'Erro interno ao apagar história.' });
    }
});

router.get('/stories/id/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        const storyResult = await pool.query(
            `SELECT stories.*, users.username, users.profile_image, categories.name AS category
             FROM stories
             JOIN users ON stories.user_id = users.id
             JOIN categories ON stories.category_id = categories.id
             WHERE stories.id = $1`,
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

// ============================
// Rotas de Salvar e Remover Histórias Salvas
// ============================

/**
 * Rota POST para Salvar uma História
 * Endpoint: /auth/save_story
 */
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
        await pool.query(
            'INSERT INTO storiessaved (userid, storyid, datasaved) VALUES ($1, $2, $3)',
            [userId, storyId, dataSaved]
        );

        res.status(201).json({ message: 'História salva com sucesso!' });
    } catch (error) {
        console.error('Erro ao salvar história:', error);
        res.status(500).json({ error: 'Erro interno ao salvar história.' });
    }
});

/**
 * Rota DELETE para Remover uma História Salva
 * Endpoint: /auth/save_story/:storyId
 */
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
        await pool.query(
            'DELETE FROM storiessaved WHERE userid = $1 AND storyid = $2',
            [userId, storyId]
        );

        res.status(200).json({ message: 'História removida com sucesso!' });
    } catch (error) {
        console.error('Erro ao remover história salva:', error);
        res.status(500).json({ error: 'Erro interno ao remover história salva.' });
    }
});

/**
 * Rota GET para Obter Histórias Salvas por um Usuário
 * Endpoint: /auth/saved_stories/:userId
 */
router.get('/saved_stories/:userId', authenticateToken, async (req, res) => {
    const { userId } = req.params;
    console.log(`Rota /saved_stories/${userId} chamada`);

    try {
        const result = await pool.query(
            `SELECT stories.*, users.username, users.profile_image, categories.name AS category
             FROM storiessaved 
             JOIN stories ON storiessaved.storyid = stories.id 
             JOIN users ON stories.user_id = users.id 
             JOIN categories ON stories.category_id = categories.id
             WHERE storiessaved.userid = $1`,
            [userId]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Erro ao carregar histórias salvas:', error);
        res.status(500).json({ error: 'Erro interno ao carregar histórias salvas.' });
    }
});

// ============================
// Rotas de Perfil de Usuário
// ============================

/**
 * Rota GET para Retornar Informações do Usuário Autenticado
 * Endpoint: /auth/me
 */
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

/**
 * Rota GET para Obter Informações do Usuário por Username
 * Endpoint: /auth/users/:username
 */
// routes/auth.js
// routes/auth.js

// ... (outro código permanece o mesmo)

router.get('/users/:username', async (req, res) => {
    const { username } = req.params;

    try {
        // Busca os dados do usuário
        const userResult = await pool.query(
            'SELECT id, username, firstname, lastname, email, bio, profile_image FROM users WHERE username = $1',
            [username]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        const user = userResult.rows[0];
        const userId = user.id;

        // Obter o contador de histórias publicadas
        const storyCountResult = await pool.query(
            'SELECT COUNT(*) FROM stories WHERE user_id = $1',
            [userId]
        );
        const storyCount = parseInt(storyCountResult.rows[0].count);

        // Obter o contador de histórias salvas
        const savedCountResult = await pool.query(
            'SELECT COUNT(*) FROM storiessaved WHERE userid = $1',
            [userId]
        );
        const savedCount = parseInt(savedCountResult.rows[0].count);

        // Obter o contador de histórias lidas
        const readCountResult = await pool.query(
            'SELECT COUNT(*) FROM readstories WHERE userid = $1',
            [userId]
        );
        const readCount = parseInt(readCountResult.rows[0].count);

        // Adicionar os contadores ao objeto do usuário
        user.storyCount = storyCount;
        user.savedCount = savedCount;
        user.readCount = readCount;

        res.status(200).json({ user });
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        res.status(500).json({ error: 'Erro ao buscar usuário.' });
    }
});

// ... (continuação do código)


/**
 * Rota PUT para Atualizar o Perfil do Usuário
 * Endpoint: /auth/update-profile
 */
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

/**
 * Rota POST para Upload de Imagem de Perfil
 * Endpoint: /auth/upload-profile-image
 */
router.post('/upload-profile-image', authenticateToken, upload.single('profileImage'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
    }

    const imageFilename = req.file.filename; // Apenas o nome do arquivo

    try {
        const userId = req.user.id; // Certifique-se de que o ID do usuário está sendo extraído corretamente do token

        // Atualiza o nome da imagem no banco de dados usando pool.query
        const updateResult = await pool.query(
            'UPDATE users SET profile_image = $1 WHERE id = $2 RETURNING *',
            [imageFilename, userId]
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
                profile_image: updatedUser.profile_image // Agora é apenas o nome do arquivo
            }, process.env.JWT_SECRET, { expiresIn: '1h' });

            res.status(200).json({ 
                message: 'Imagem de perfil atualizada com sucesso!', 
                token: newToken, 
                imageName: imageFilename // Retorna apenas o nome da imagem
            });
        } else {
            res.status(404).json({ message: 'Usuário não encontrado.' });
        }
    } catch (error) {
        console.error('Erro no banco de dados:', error);
        res.status(500).json({ error: 'Falha ao atualizar a imagem de perfil no banco de dados.' });
    }
});

// ============================
// Rota GET para Obter Categorias
// ============================

/**
 * Rota GET para Obter Categorias
 * Endpoint: /auth/categories
 */
router.get('/categories', authenticateToken, async (req, res) => {
    console.log('GET /categories foi chamado.');
    try {
        const result = await pool.query('SELECT id, name FROM categories ORDER BY name ASC');
        const categories = result.rows; // Array de objetos { id, name }
        console.log('Categorias obtidas:', categories);
        res.status(200).json({ categories });
    } catch (error) {
        console.error('Erro ao buscar categorias:', error);
        res.status(500).json({ error: 'Erro ao buscar categorias.' });
    }
});

// ============================
// Rotas de Teste
// ============================

/**
 * Rota de Teste para Verificar o Funcionamento das Rotas
 * Endpoint: /auth/test
 */
router.get('/test', (req, res) => {
    res.json({ message: 'Rota de teste funciona!' });
});

// ============================
// Exportação do Router
// ============================

module.exports = router;
