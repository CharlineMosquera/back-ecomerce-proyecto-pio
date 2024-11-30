const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) =>{
    const token = req.header('Authorization')?.replace('Bearer ', ''); // .replace elimina "Bearer "
    if(!token){
        return res.status(403).json({
            message:'Se requiere token de autenticacion'
        })
    }

    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) =>{
        if(error){
            return res.status(401).json({ message: 'Token invalido', error:error.message})
        }
        req.user = decoded
        if (req.user.role !== 'admin') {
            return res.status(403).json({ mensaje: 'No tienes permiso para acceder a esta ruta' });
        }
        next()
    })
}
module.exports = authMiddleware;