/**
 * @swagger
 * tags:
 *   - name: Products
 *     description: Gestión de productos
 */

const { requiredFields, validateInt } = require('../middlewares/validation.middleware');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

const express = require('express');
const router = express.Router();
const Product = require('../models/Products');

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
 *         name: search
 *         schema:
 *           type: string
 *         description: Texto a buscar
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
 *         description: Token faltante
 *       "500":
 *         description: Error de servidor
 */
router.get('/', authenticate, async (req, res) => {
    const { search, minPrice, maxPrice, minRating } = req.query;
    const filters = {};

    if (search) {
        const text = String(search);

        filters.$or = [
            { title: { $regex: text, $options: 'i' } },
            { description: { $regex: text, $options: 'i' } }
        ];
    }

    if (minPrice !== null) {
        const min = parseFloat(minPrice);
        if (!Number.isNaN(min)) {
            filters.price = { ...(filters.price || {}), $gte: min };
        }
    }
    if (maxPrice !== null) {
        const max = parseFloat(maxPrice);
        if (!Number.isNaN(max)) {
            filters.price = { ...(filters.price || {}), $lte: max };
        }
    }

    if (minRating !== null) {
        const rat = parseFloat(minRating);
        if (!Number.isNaN(rat)) {
            filters.rating = { $gte: rat };
        }
    }

    try {
        let query = Product.find(filters);
        if (filters.$text) {
            query = query
                .select({ score: { $meta: 'textScore' } })
                .sort({ score: { $meta: 'textScore' } });
        }
        const items = await query.exec();
        return res.json(items);
    } catch (e) {
        console.error('Error al obtener lista de productos', e);
        return res.status(500).json({ message: 'Error de servidor' });
    }
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Obtener un producto por su Id publico
 *     tags: 
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Id publico del producto
 *     responses:
 *       "200":
 *         description: Detalles del producto
 *         content: 
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Products'
 *       "400":
 *         description: Formato de id no valido
 *       "401":
 *         description: Token faltante
 *       "404":
 *         description: Producto no encontrado
 *       "500":
 *         description: Error de servidor
 */
router.get('/:id', validateInt('id'), authenticate, async (req, res) => {
    const publicId = req.params.id;

    try {
        const item = await Product.findOne({ publicId });
        if (!item) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        return res.json(item);
    } catch (e) {
        console.error(`Error al obtener el producto ${publicId}`, e);
        return res.status(500).json({ message: 'Error de servidor' });
    }
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Crear un producto nuevo
 *     tags: 
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - price
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               rating:
 *                 type: number
 *               mianImage:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               stock:
 *                 type: integer
 *     responses:
 *       "201":
 *         description: Producto creado
 *         content: 
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Products'
 *       "400":
 *         description: datos invalidos o insuficientes
 *       "401":
 *         description: Token faltante
 *       "403":
 *         description: No autorizado
 *       "500":
 *         description: Error de servidor
 */
router.post(
    '/',
    authenticate,
    authorize('ADMIN'),
    requiredFields(['title', 'description', 'price']),
    async (req, res) => {
        try {
            const { title, description, price, rating = 0, mainImage, images = [], stock } = req.body;
            const newProduct = new Product({
                title: title.trim(),
                description: description.trim(),
                price,
                rating,
                mainImage: (mainImage || 'DEFAULT').trim(),
                images,
                stock: typeof stock === 'number' ? stock : 0
            });

            await newProduct.save();
            return res.status(201).json(newProduct);
        } catch (e) {
            console.error('Error creando el producto', e);
            if (e.name === 'ValidationError') {
                return res.status(400).json({ message: 'Datos invalidos' });
            }
            return res.status(500).json({ message: 'Error de servidor' });
        }
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
 *         description: Id publico del procucto a editar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               rating:
 *                 type: number
 *               mainImage:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               stock:
 *                 type: integer
 *     responses:
 *       "200":
 *         description: Producto actualizado
 *         content: 
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Products'
 *       "400":
 *         description: Datos invalidos
 *       "401":
 *         description: Token faltante
 *       "403":
 *         description: No autorizado
 *       "404":
 *         description: Producto no encontrado
 *       "500":
 *         description: Error de servidor
 */
router.put('/:id', authenticate, authorize('ADMIN'), async (req, res) => {
    const publicId = req.params.id
    try {
        const item = await Product.findOne({ publicId });
        if (!item) {
            return res.status(404).json({ message: 'producto no encontrado' })
        };

        const fields = ['title', 'description', 'price', 'rating', 'mainImage', 'images', 'stock'];
        const updates = fields.reduce((updatedObject, key) => {
            let newValue = req.body[key];
            if (newValue === undefined) {
                return updatedObject;
            }

            if (typeof newValue === 'string') {
                newValue = newValue.trim();
            }

            const currentValue = item[key];

            if (Array.isArray(currentValue) && Array.isArray(newValue)) {
                const diferent =
                    newValue.length !== currentValue.length ||
                    newValue.some((element, index) => element !== currentValue[index]);
                if (diferent) {
                    updatedObject[key] = newValue;
                }
            } else {
                if (newValue !== currentValue) {
                    updatedObject[key] = newValue;
                }
            }

            return updatedObject;
        }, {});

        if (Object.keys(updates).length === 0) {
            return res.status(200).json({ message: 'No se detectaron cambios', product: item })
        }

        const updatedItem = await Product.findOneAndUpdate(
            { publicId },
            updates,
            { new: true }
        );

        return res.status(200).json(updatedItem);

    } catch (e) {
        console.error('Error editando el producto', e);
        if (e.name === 'ValidationError') {
            return res.status(400).json({ message: 'Datos invalidos' });
        }
        return res.status(500).json({ message: 'Error de servidor' });
    }
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
 *           type: integer
 *         description: Id publico del producto a editar 
 *     responses:
 *       "204":
 *         description: Producto eliminado
 *       "401":
 *         description: Token faltante
 *       "403":
 *         description: No autorizado
 *       "404":
 *         description: Producto no encontrado
 *       "500":
 *         description: Error de servidor
 */
router.delete('/:id', validateInt('id'), authenticate, authorize('ADMIN'), async (req, res) => {
    const publicId = req.params.id

    try {
        const deleted = await Product.findOneAndDelete({ publicId });

        if (!deleted) {
            return res.status(404).json({ message: 'Producto no encontrado' })
        }
        return res.status(204).json({ message: `Producto ${publicId} eliminado` });
    } catch (error) {
        console.error(`Error editando el producto ${publicId}`, e);
        return res.status(500).json({ message: 'Error de servidor' });
    }

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
 *           type: integer
 *         description: Id publico del producto a clonar
 *     responses:
 *       "201":
 *         description: Producto clonado
 *         content: 
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Products'
 *       "401":
 *         description: Token faltante
 *       "403":
 *         description: No autorizado
 *       "404":
 *         description: Producto original no encontrado
 *       "500":
 *         description: Error de servidor
 */
router.post('/:id/clone', authenticate, authorize('ADMIN'), async (req, res) => {
    const publicId = req.params.id
    try {
        const item = await Product.findOne({ publicId });
        if (!item) {
            return res.status(404).json({ message: `Producto ${publicId} no encontrado` })
        }

        const clonedItem = {
            title: item.title,
            description: item.description,
            price: item.price,
            rating: item.rating,
            mainImage: item.mainImage,
            images: item.images,
            stock: item.stock
        };

        const newProduct = new Product(clonedItem);
        await newProduct.save();
        return res.status(201).json(newProduct);

    } catch (error) {
        console.error(`Error clonando el producto ${publicId}`, e);
        if (e.name === 'ValidationError') {
            return res.status(400).json({ message: 'Datos invalidos' });
        }
        return res.status(500).json({ message: 'Error de servidor' });
    }
});

module.exports = router;