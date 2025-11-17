import User from "./User.js";
import Image from "./Image.js";
import Valoration from "./Valoration.js";

// USER ↔ IMAGE
User.hasMany(Image, { foreignKey: "fromId", constraints: false, scope: { from: "user" } });
Image.belongsTo(User, { foreignKey: "fromId", constraints: false });

// VALORATION ↔ IMAGE
Valoration.hasMany(Image, { foreignKey: "fromId", constraints: false, scope: { from: "valoration" } });
Image.belongsTo(Valoration, { foreignKey: "fromId", constraints: false });

// USER ↔ VALORATION
User.hasMany(Valoration, { foreignKey: "userId", onDelete: "CASCADE" });
Valoration.belongsTo(User, { foreignKey: "userId" });

export { User, Image };
