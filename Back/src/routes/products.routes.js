const express = require('express');
const router = express.Router();

const products = require('../models/Products');
// Metodos para administrador

//TODO comprobar que llamadas tienen req o res (tambien en auth y en )

// GET /api/products
// TODO filtros
router.get('/', async (req, res) => {
    // const filters = req.query; 
    //const productos = await Product.find(filters)

    res.json({});
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
    const { id } = req.params
    // const filters = req.query; 
    //const productos = await Product.find(filters)

    res.json({});
});

// POST /api/products
router.post('/', async (req, res) => {


    res.status(201).json({});
});

// PUT /api/products/:id
router.put('/:id', async (req, res) => {
    const { id } = req.params

    res.json({});
});

// DELETE /api/products/:id
router.delete('/:id', async (req, res) => {
    const { id } = req.params

    res.status(204).end();
});

// POST /api/products/:id/clone
router.post('/:id/clone', async (req, res) => {
    const { id } = req.params

    res.status(201).json({});
});

module.exports = router;