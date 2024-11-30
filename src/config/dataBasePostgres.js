const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "my_db_users",
    password: "admin",
    port: 5432,
    max: 10,                 // Máximo de conexiones en el pool
    idleTimeoutMillis: 30000,  // Tiempo de inactividad antes de liberar una conexión
    connectionTimeoutMillis: 2000  // Timeout de conexión
});

pool.connect()
    .then(() => console.log('Conexión exitosa a PostgreSQL'))
    .catch(err => console.error('Error al conectar a PostgreSQL:', err.message));

module.exports = { pool };