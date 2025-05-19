/**
 * @swagger
 * tags:
 *   - name: Cart
 *     description: Gestion del carrito de Usuario
 */

const { validateInt } = require('../middlewares/validation.middleware');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Products = require('../models/Products');

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: listar el carrito del usuario registrado
 *     tags: 
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: Listado de productos del carrito
 *         content: 
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 UserId:
 *                   type: integer
 *                   description: Id publico del usuario
 *                 items:
 *                   type: array
 *                   item: 
 *                     type: object
 *                     properties:
 *                       productId:
 *                         type: integer
 *                         description: Id publico del producto
 *                       title:
 *                         type: string
 *                         description: Titulo del producto
 *                       price:
 *                         type: number
 *                         description: Precio del producto
 *                       quantity:
 *                         type: integer
 *                         description: Cantidad de producto
 *       "401":
 *         description: Token faltante
 *       "404":
 *         description: producto no encontrado
 *       "500":
 *         description: Error de servidor
 */
router.get('/', authenticate, async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.userId });
        if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
            return res.json({
                userId: req.userId,
                items: []
            });
        }
        const ids = cart.items.map(item => item.productId);
        const products = await Products.find({ publicId: { $in: ids } });
        const missing = ids
            .filter(id => !products
                .some(product => product.publicId === id)
            );

        if (missing.length > 0) {
            return res.status(404).json({
                message: `No existen los productos ${missing.join(', ')}`
            });
        }

        const cartItems = cart.items.map(({ productId, quantity }) => {
            const product = products.find(product => product.publicId === productId);
            return {
                productId: product.publicId,
                title: product.title,
                price: product.price,
                quantity
            }
        });

        return res.status(200).json({ items: cartItems });


    } catch (e) {
        console.error(`Error al cargar el carrito del usuario`, e);
        return res.status(500).json({ message: "Error de servidor" });
    }
});

/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: añadir un producto al carrito del usuario
 *     tags: 
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: integer
 *                 description: Id publico del producto
 *               quantity:
 *                 type: integer
 *                 description: Cantidad
 *     responses:
 *       "200":
 *         description: Carrito Actualizado
 *         content: 
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       "400":
 *         description: datos invalidos
 *       "401":
 *         description: Token faltante
 *       "500":
 *         description: Error de servidor
 */
router.post('/', authenticate, async (req, res) => {
    const { productId, quantity } = req.body;
    if (!Number.isInteger(productId) || !Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({ message: 'Id y cantidad deben ser enteros y validos' })
    }
    try {
        const productExists = await Products.exists({ publicId: productId });
        if (!productExists) {
            return res.status(400).json({ message: `El producto ${productId} no se encuentra disponible` })
        }

        let cart = await Cart.findOneAndUpdate(
            { userId: req.userId, 'items.productId': productId },
            { $inc: { 'items.$.quantity': quantity } },
            { new: true }
        );
        if (cart) return res.status(200).json(cart);

        cart = await Cart.findOneAndUpdate(
            { userId: req.userId },
            { $push: { items: { productId, quantity } } },
            { new: true, upsert: true }
        );
        return res.status(200).json(cart);

    } catch (e) {
        console.error(`Error añadiendo el producto ${productId}`, e);
        if (e.name === 'ValidationError') {
            return res.status(400).json({ message: 'Datos invalidos' });
        }
        return res.status(500).json({ message: 'Error de servidor' });
    }
});

module.exports = router;