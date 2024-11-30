/* const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Clave secreta para firmar el JWT
const JWT_SECRET = process.env.JWT_SECRET;

// Registrar un nuevo usuario
exports.registerUser = async (req, res) => {
    try {

        // Verificar si el usuario ya existe
        const { name, email, password, address, phone } = req.body;
        const existingUser = await User.findOne({email});
        if(existingUser) {
            return res.status(400).json({ message: "El correo ya esta registrado" });
        }
        // Encriptar la contraseña
        const encryptedPassword = await bcrypt.hash(password, 10);
        // Crea el objeto usuario
        const newUser = new User({
            name,
            email,
            password: encryptedPassword,
            address,
            phone
        });

        await newUser.save();
        res.status(201).json({ message: "Usuario registrado con éxito" });
    } catch(error) {
        res.status(500).json({ message: "Error al registrar el usuario", error: error.message });
    }
};

// Inicio de sesion de un usuario
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Validar si el usuario existe
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Correo o contraseña incorrectos" });
        }
        // Verifica la contraseña
        const isValidPassword = await bcrypt.compare(password, user.password);
        if(!isValidPassword) {
            return res.status(400).json({ message: "Contraseña incorrecta" });
        }

        // Crea el token JWT
        const token = jwt.sign({ id:user._id, role:user.role}, JWT_SECRET, {expiresIn: "1h"});
        res.status(200).json({ message: 'Inicio de sesión exitoso', token });
        
    } catch(error) {
        res.status(500).json({ message: "Error al iniciar sesión", error: error.message });
    }
} */