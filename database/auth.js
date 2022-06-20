"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Key = exports.Cred = void 0;
const config_1 = __importDefault(require("../config"));
const sequelize_1 = require("sequelize");
const sequelize = config_1.default.DATABASE;
class Cred extends sequelize_1.Model {
}
exports.Cred = Cred;
Cred.init({
    key: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    value: {
        type: sequelize_1.DataTypes.JSON,
    }
}, { sequelize,
    tableName: "Creds",
    timestamps: false
});
class Key extends sequelize_1.Model {
}
exports.Key = Key;
Key.init({
    key: {
        type: sequelize_1.DataTypes.STRING(1000000),
        allowNull: false,
    },
    value: {
        type: sequelize_1.DataTypes.STRING(1000000)
    },
    type: {
        type: sequelize_1.DataTypes.STRING(1000000),
    }
}, {
    sequelize,
    tableName: "Keys",
    timestamps: false,
});
