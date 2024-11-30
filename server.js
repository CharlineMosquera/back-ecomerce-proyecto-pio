const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const conectarDB = require("./src/config/dataBase"); // Para Conexión a MongoDB
const {pool} = require('./src/config/dataBasePostgres'); // Para Conexión a PostgreSQL
const authMiddleware = require('./src/middleware/authMiddleware');

// Cargar variables de entorno
dotenv.config();

// Inicializar Servidor Express
const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Configurar CORS
app.use(cors({
    origin: 'http://localhost:3000', 
    methods: ["GET", "POST", "PUT", "DELETE"],// Permitir solicitudes solo desde el frontend
    credentials: true,              // Habilitar cookies o encabezados personalizados
  }));

// Conectar a la base de datos Mongo
conectarDB();
// Conectar a la base de datos Postgres
pool.connect().catch(err => console.error('Error al conectar a PostgreSQL:', err.message));

// Rutas
app.use("/api/products", require("./src/routes/productRoutes"));
app.use("/api/users", require("./src/routes/userRoutes"));
app.use("/api/orders", require("./src/routes/orderRoutes"));
app.use("/api/categories", require("./src/routes/categoryRoutes"));
app.use("/api/cart", require("./src/routes/cartRoutes"));

// Ruta protegida de ejemplo
app.get('/api/profile', authMiddleware, (req, res) => {
    res.status(200).json({ message: 'Perfil de admin', user: req.user });
});

// Manejo de rutas no encontradas
app.use((req, res, next) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

// Manejo de errores en el servidor
app.use((error, req, res, next) => {
    console.error(error.stack);
    res.status(500).json({message: "Error en el servidor", error: error.message});
});

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
