const { pool } = require("../config/dataBasePostgres");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registrar un nuevo usuario
exports.registerUser = async (req, res) => {
    const { name, email, password, address, phone, role } = req.body;
    // Validación de campos requeridos
    if (!name || !email || !password || !address || !phone) {
        return res.status(400).json({ message: "Todos los campos son requeridos" });
    }
    try {
        // Verificar si el correo ya está registrado
        const checkUser = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );
        if (checkUser.rows.length > 0) {
            return res.status(400).json({ message: "El correo electrónico ya está registrado" });
        }
        const encryptedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            "INSERT INTO users (name, email, password, address, phone, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [name, email, encryptedPassword, address, phone, role || "cliente"]
        );
        res.status(201).json({ message: "Usuario registrado con éxito", user: result.rows[0] });
    } catch(error) {
        // Imprimir detalles del error
        console.error("Error en la consulta SQL:", error);
        if (error.code === '23505') {  // Error por email duplicado
            return res.status(400).json({ message: "El correo electrónico ya está registrado" });
        }
        res.status(500).json({ message: "Error al registrar el usuario", error: error.message });
    }
};

// Inicio de sesion de un usuario
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];
        if (!user) {
            return res.status(400).json({ message: 'Usuario no encontrado' });
        }
        // Verifica la contraseña
        const isValidPassword = await bcrypt.compare(password, user.password);
        if(!isValidPassword) {
            return res.status(400).json({ message: "Contraseña incorrecta" });
        }

        // Crea el token JWT
        const token = jwt.sign({ id:user._id, role:user.role}, process.env.JWT_SECRET, {expiresIn: "1h"});
        return res.status(200).json({ mensaje: 'Inicio de sesión exitoso', token });
    } catch(error) {
        return res.status(500).json({ message: "Error al iniciar sesión", error: error.message });
    }
};

// Obtener perfil de usuario
exports.getProfileUser = async (req, res) => {
    // Verifica que req.user exista (por si no se pasó el token correctamente o el middleware no lo asignó)
    if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'No autorizado, falta el token o la autenticación' });
    }
    const userId = req.user.id;
    try {
        const result = await pool.query('SELECT id, name, email, address, phone, role, created_at FROM users WHERE id = $1', [userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        return res.status(200).json({ usuario: result.rows[0] });
    } catch (error) {
        console.error('Error al obtener el perfil del usuario:', error);  // Registra el error para depuración
        return res.status(500).json({ message: 'Error al obtener el perfil del usuario', error: error.message });
    }
};

// Actualizar perfil de usuario
exports.updateProfileUser = async (req, res) => {
    const userId = req.user.id;
    const { name, email, address, phone, role } = req.body;
    try {
        const result = await pool.query(
            'UPDATE users SET name = $1, email = $2, address = $3, phone = $4, role = $5 WHERE id = $6 RETURNING *',
            [name, email, address, phone, role, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        return res.status(200).json({ message: 'Perfil actualizado', usuario: result.rows[0] });
    } catch (error) {
        return res.status(500).json({ message: 'Error al actualizar el perfil', error: error.message });
    }
};
