const { DataTypes } = require("sequelize");
const sequelize = require("./index");

const User = sequelize.define("User", {
    name: { type: DataTypes.STRING, allowNull: false },
    cognames: { type: DataTypes.STRING, allowNull: false },
    tlf: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.STRING, allowNull: false },
    token: { type: DataTypes.STRING, allowNull: true },
}, {
    tableName: "Users",
    timestamps: true
});

module.exports = User;
