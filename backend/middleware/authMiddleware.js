const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    console.log('Authorization Header:', authHeader);

    if (!authHeader) {
        return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });
    }

    const token = authHeader.split(' ')[1];
    console.log('Token:', token);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token Decoded:', decoded);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Erro ao verificar token:', error);
        res.status(403).json({ error: 'Token inválido.' });
    }
};

module.exports = authenticateToken;