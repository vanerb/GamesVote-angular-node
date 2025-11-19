const { DataTypes } = require("sequelize");
const sequelize = require("./index");

const Valoration = sequelize.define("Valoration", {
    description: { type: DataTypes.TEXT, allowNull: false, },
    value: { type: DataTypes.STRING, allowNull: false },
    gameId: { type: DataTypes.STRING, allowNull: false },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false }
}, {
    tableName: "Valoration",
    timestamps: true
});

module.exports = Valoration;
