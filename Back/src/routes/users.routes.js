const express = require('express');
const router = express.Router();

const { authenticate, authorize } = require('../middlewares/auth.middleware');
const user = require('../models/User');
const jwt = require('jsonwebtoken');

//TODO en principio todos los endpoint ADMIN

// GET /api/user
// TODO filtros
router.get('/', async (req, res) => {
    // const filters = req.query; 
    //const users = await Users.find(filters)

    res.json({});
});


// GET /api/users/:id
router.get('/:id', async (req, res) => {
    const { id } = req.params
    res.json({});
});

// POST /api/users
// solo para pruebas, se deben generar usuarios al registraste
router.post('/', async (req, res) => {
    res.status(201).json({});
});

// PUT /api/users/:id
router.put('/:id', async (req, res) => {
    const { id } = req.params
    res.json({});
});

// DELETE /api/users/:id
// valorar si para otros usuarios
router.delete('/:id', async (req, res) => {
    const { id } = req.params
    res.status(204).end();
});

// PATCH /api/users/:id/password
router.patch('/:id/password', async (req, res) => {
    const { id } = req.params
    const { oldPassword } = req.body;
    const { newPassword } = req.body;

    res.json({ mesagge: 'Contraseña actualizada' });
});

// GET /api/users/me
router.get('/me', authenticate, async (req, res) => {
    const me = await user.findById(req.userId).select('-passwordHash');
    res.json(me);
});

// PATCH /api/users/:id/role
router.patch('/:id/role', authenticate, authorize('ADMIN'), async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
    //TODO validar role
    const updated = await UserActivation.findIdAndUpdate(id, { role: role }, { new: true })
        .select('-paswordhash');
    res.json(updated);
});

module.exports = router;