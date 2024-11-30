const Product = require("../models/product");

exports.createProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear el producto", error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  const { id } = req.params; // Desestructuramos el id de los parámetros de la ruta
  try {
    // Buscamos el producto por su id y poblamos la categoría relacionada
    const product = await Product.findById(id).populate('category'); // Asegúrate de que el campo 'category' esté definido en el modelo
    // Si no se encuentra el producto, respondemos con un error 404
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    // Si se encuentra el producto, lo devolvemos con un estado 200
    res.status(200).json(product);
  } catch (error) {
    // Si hay un error durante la consulta, lo manejamos y respondemos con un error 500
    res.status(500).json({
      message: 'Error al obtener el producto',
      error: error.message,
    });
  }
};


exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category");
    res.status(200).json(products);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener los productos", error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updatedProduct);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error al actualizar el producto",
        error: error.message,
      });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar el producto", error: error.message });
  }
};
