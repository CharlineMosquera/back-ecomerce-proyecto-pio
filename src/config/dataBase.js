const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const conectarDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Conexión exitosa a MongoDB");
    } catch (error) {
        console.error("Error en la conexion a MongoDB: ", error);
        process.exit(1);
    }
};

module.exports = conectarDB;