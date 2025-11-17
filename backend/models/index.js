const { Sequelize } = require("sequelize");

// Conexión a MySQL (ajusta usuario, contraseña y base de datos)
const sequelize = new Sequelize("gamevote_angular_node", "root", "", {
    host: "localhost",
    dialect: "mysql",
});

module.exports = sequelize;
