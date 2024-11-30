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
    const { id } = req.params;
    if (!id) return res.json({ message: "faltan datos", status: 401 });
    try {
        const result = await pool.query('SELECT id, name, email, address, phone, role, created_at FROM users WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        return res.status(200).json({ user: result.rows[0] });
    } catch (error) {
        console.error('Error al obtener el perfil del usuario:', error);  // Registra el error para depuración
        return res.status(500).json({ message: 'Error al obtener el perfil del usuario', error: error.message });
    }
};

// Obtener TODOS los perfiles de usuario
exports.getAllProfileUser = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        if (!result || result.length <= 0)
            return res.json({ message: "No hay usuarios registrados", status: 404 });
        return res.json({
            message: "Usuarios encontrados",
            users: result.rows,
            status: 200,
          });
    } catch (error) {
        console.error('Error al obtener el perfil del usuario:', error);  // Registra el error para depuración
        return res.status(500).json({ message: 'Error al obtener el perfil del usuario', error: error.message });
    }};

// Actualizar perfil de usuario
exports.updateProfileUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, address, phone, role } = req.body; // Desestructuramos solo los campos que pueden ser actualizados

    // Creamos un objeto con solo los campos enviados
    const updatedFields = {};
    if (name) updatedFields.name = name;
    if (email) updatedFields.email = email;
    if (address) updatedFields.address = address;
    if (phone) updatedFields.phone = phone;
    if (role) updatedFields.role = role;

    // Si no hay datos para actualizar, respondemos con un error
    if (Object.keys(updatedFields).length === 0) {
        return res.status(400).json({ message: 'No se proporcionaron datos para actualizar.' });
    }

    // Creamos una lista de los campos a actualizar
    const fieldsToUpdate = Object.keys(updatedFields);
    const values = fieldsToUpdate.map((field) => updatedFields[field]);

    // Generamos la consulta SQL dinámicamente
    const setString = fieldsToUpdate
        .map((field, index) => `${field} = $${index + 1}`)
        .join(', ');

    // Ejecutamos la consulta con los datos
    try {
        const result = await pool.query(
            `UPDATE users SET ${setString} WHERE id = $${fieldsToUpdate.length + 1} RETURNING *`,
            [...values, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        return res.status(200).json({ message: 'Perfil actualizado', usuario: result.rows[0] });
    } catch (error) {
        return res.status(500).json({ message: 'Error al actualizar el perfil', error: error.message });
    }
};

// Elimina un usuario
exports.deleteUser = async (req, res) => {
    const { id } = req.params;
  
    try {
      // Realizamos la consulta para eliminar el usuario
      const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
  
      // Si no se eliminó ninguna fila, significa que el usuario no fue encontrado
      if (result.rowCount === 0) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
  
      // Si se eliminó correctamente, devolvemos una respuesta positiva
      return res.status(200).json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
      // Si ocurre un error en la consulta, capturamos el error y lo respondemos
      return res.status(500).json({ message: `Error al eliminar el usuario: ${error.message}` });
    }
  };
  
