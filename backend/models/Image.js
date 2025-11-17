const { DataTypes } = require("sequelize");
const sequelize = require("./index");

const Image = sequelize.define("Image", {
    url: { type: DataTypes.STRING, allowNull: false },
    from: { type: DataTypes.ENUM("user", "valoration"), allowNull: false },
    fromId: { type: DataTypes.INTEGER, allowNull: true }
}, {
    tableName: "Images",
    timestamps: true
});

module.exports = Image;
