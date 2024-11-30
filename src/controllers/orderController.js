const Order = require("../models/order");
const Cart = require("../models/cart");
const { pool } = require("../config/dataBasePostgres");

exports.createOrderFromCart = async (req, res) => {
  const { userId } = req.params;
  try {
    // Verificar que el userId sea válido
    if (isNaN(userId)) {
      return res.status(400).json({ mensaje: 'El userId debe ser un número válido' });
  }
  const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
  if (userResult.rowCount === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado en PostgreSQL' });
  }
    const cart = await Cart.findOne({ userId: parseInt(userId) }).populate(
      "products.product"
    );
    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }
    let total = 0;
    const productsOrder = cart.products.map((item) => {
      const price = item.product.price * item.quantity;
      total += price;
      return {
        product: item.product._id,
        quantity: item.quantity,
        price
      };
    });
    const newOrder = new Order({
      user: parseInt(userId),
      cartId: cart._id,
      products: productsOrder,
      total
    });
    await newOrder.save();
    await Cart.findOneAndUpdate({ userId: parseInt(userId) }, { products: [] });
    res
      .status(201)
      .json({ message: "Orden creada con exito", order: newOrder });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear la orden", error: error.message });
  }
};

exports.getOrder = async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await Order.findById(orderId).populate("products.product");
    if (!order) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }
    res.status(200).json({ message: 'Orden encontrada', order});
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener las ordenes", error: error.message });
  }
};
