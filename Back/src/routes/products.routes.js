/**
 * @swagger
 * tags:
 *   - name: Products
 *     description: Gestión de productos
 */

const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const products = require('../models/Products');

// Metodos para administrador

//TODO comprobar que llamadas tienen req o res (tambien en auth y en )

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Listar todos los productos
 *     tags: 
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Precio minimo
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Precio máximo
 *       - in: query
 *         name: minRating
 *         schema:
 *           type: number
 *         description: Valoracion mínima
 *     responses:
 *       "200":
 *         description: Lista de productos filtrados
 *         content: 
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Products'
 *       "401":
 *         description: No autenticado
 */
router.get('/', authenticate, async (req, res) => {
    //const filters = req.query; 
    //const productos = await Product.find(filters)

    res.json({});
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Obtener un producto por su Id
 *     tags: 
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Id del producto
 *     responses:
 *       "200":
 *         description: detalles del producto
 *         content: 
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Products'
 *       "401":
 *         description: No autenticado
 *       "404":
 *         description: Producto no encontrado
 */
router.get('/:id', authenticate, async (req, res) => {
    const { id } = req.params
    // const filters = req.query; 
    //const productos = await Product.find(filters)

    res.json({});
});


/**
 * @swagger
 * /api/products:
 *  post:
 *    summary: Crear un producto nuevo
 *    tags: 
 *      - Products
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Products'
 *    responses:
 *      "201":
 *        description: Producto creado
 *          content: 
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Products'
 *      "401":
 *        description: No autenticado
 *      "403":
 *        description: No autorizado
 */
router.post('/', authenticate, authorize('ADMIN'), async (req, res) => {
    // TODO implementar

    res.status(201).json({});
});


/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Editar un producto existente
 *     tags: 
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Id del procucto a editar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Products'  
 *     responses:
 *       "200":
 *         description: Producto actualizado
 *         content: 
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Products'
 *       "401":
 *         description: No autenticado
 *       "403":
 *         description: No autorizado
 *       "404":
 *         description: Producto no encontrado
 */
router.put('/:id', authenticate, authorize('ADMIN'), async (req, res) => {
    const { id } = req.params
    // TODO implementar logica de edicion
    res.json({});
});

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Eliminar un producto
 *     tags: 
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Id del producto a editar 
 *     responses:
 *       "204":
 *         description: Producto eliminado
 *       "401":
 *         description: No autenticado
 *       "403":
 *         description: No autorizado
 *       "404":
 *         description: Producto no encontrado
 */
router.delete('/:id', authenticate, authorize('ADMIN'), async (req, res) => {
    const { id } = req.params
    // TODO implementar logica de edicion
    res.status(204).end();
});

/**
 * @swagger
 * /api/products/{id}/clone:
 *   post:
 *     summary: Clonar un producto existente
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Id del producto a clonar
 *     responses:
 *       "201":
 *         description: Producto clonado
 *         content: 
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Products'
 *       "401":
 *         description: No autenticado
 *       "403":
 *         description: No autorizado
 *       "404":
 *         description: Producto original no encontrado
 */
router.post('/:id/clone', authenticate, authorize('ADMIN'), async (req, res) => {
    const { id } = req.params

    res.status(201).json({});
});

module.exports = router;