/**
 * @swagger
 * components:
 *   schemas:
 *     CartItem:
 *       type: object
 *       required:
 *         - productId
 *         - quantity
 *       properties:
 *         productId: 
 *           type: integer
 *           description: Id publico del producto
 *         quantity:
 *           type: integer
 *           description: Cantidad de productos
 *           minimun: 1 
 *     Cart:
 *       type: object
 *       required:
 *         - userId
 *         - items
 *       properties:
 *         userId:
 *           type: integer
 *           description: Id publico del usuario dueño del carrito
 *         items: 
 *           type: array
 *           description: Lista de id de productos y cantidades
 *           items: 
 *             $ref: '#/components/schemas/CartItem'
 */

const Schema = require('mongoose').Schema;

const cartItemSchema = new Schema({
    productId: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 }
}, { _id: false });

const cartSchema = new Schema({
    userId: { type: Number, required: true },
    items: { type: [cartItemSchema], required: true }
}, { timestamps: true });

cartSchema.set('toJSON', {
    versionKey: false,
    transform: (_doc, ret) => {
        delete ret._id;
        return ret;
    }
});

module.exports = model('Cart', cartSchema);