const Cart = require("../models/cart");
const Product = require("../models/product");
const { pool } = require("../config/dataBasePostgres"); // Importa directamente el pool

// Crear carrito
exports.createCart = async (req, res) => {
  const { userId, products } = req.body;
  try {
    // Verificar si el usuario existe en PostgreSQL
    const userResult = await pool.query(
      "SELECT * FROM users WHERE id = $1",
      [userId]
    );
    if (userResult.rowCount === 0) {
      return res
        .status(404)
        .json({ message: "Usuario no encontrado en PostgreSQL" });
    }
    // Validar que los productos existan en MongoDB
    const productsIds = products.map((p) => p.product);
    const validProducts = await Product.find({
      _id: { $in: productsIds },
    });
    if (validProducts.length !== productsIds.length) {
      return res
        .status(400)
        .json({ message: "Uno o más productos no son válidos" });
    }

    // Verificar si ya existe un carrito para el usuario
    const cartExisting = await Cart.findOne({ userId });
    if (cartExisting) {
      return res
        .status(400)
        .json({ message: "Ya existe un carrito para este usuario" });
    }
    // Crear el carrito en MongoDB
    const newCart = new Cart({
      userId,
      products,
    });
    await newCart.save();

    res.status(201).json({ message: "Carrito creado", cart: newCart });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear el carrito", error: error.message });
  }
};

// Obtener carrito
exports.getCart = async (req, res) => {
  const { userId } = req.params;
  try {
    const cart = await Cart.findOne({ userId: userId }).populate(
      "products.product"
    );
    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }
    res.status(200).json(cart);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener el carrito", error: error.message });
  }
};

// Actualizar carrito
exports.updateCart = async (req, res) => {
  const { userId, products } = req.body;
  try {
    const updatedCart = await Cart.findOneAndUpdate(
      { userId },
      { products },
      { new: true }
    );
    if (!updatedCart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }
    res.status(200).json({ message: "Carrito actualizado", updatedCart });
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar el carrito",
      error: error.message,
    });
  }
};

// Eliminar carrito
exports.deleteCart = async (req, res) => {
  const { userId } = req.params;
  try {
    const cartDeleted = await Cart.findOneAndDelete(
      { userId }
    );
    if (!cartDeleted) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }
    res.status(200).json({ message: "Carrito eliminado" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar el carrito", error: error.message });
  }
};
