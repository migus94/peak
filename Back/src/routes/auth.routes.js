const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const User = require('../models/User');

//POST /api/auth/register
router.post('/register', async (req, res) => {

    //TO DO

    res.status(201).json({ message: 'Created new user' });
});

//POST /api/auth/login
router.post('/login', async (req, res) => {

    //TO DO
    // ?
    res.json({ token: 'xxxx' });
});

// POST /api/auth/refresh
router.post('/refresh', async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ error: 'Falta token' });

    try {
        // TODO JWT
        const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN);
        const accesToken = jwt.sign(
            { sub: payload.sub, roles: payload.roles },
            process.env.JWT_KEY,
            { expiresIn: '45m' }
        );
        res.json({ accesToken });
    } catch (err) {
        res.status(401).json({ error: 'Token invalido' });
    }
});

module.exports = router;