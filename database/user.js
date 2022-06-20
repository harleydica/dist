"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const config_1 = __importDefault(require("../config"));
const sequelize_1 = require("sequelize");
const sequelize = config_1.default.DATABASE;
class User extends sequelize_1.Model {
}
User.init({
    JID: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, { sequelize, tableName: "Users" });
function addUser(jid = null) {
    return __awaiter(this, void 0, void 0, function* () {
        User.findOrCreate({
            where: {
                JID: jid
            },
        });
    });
}
function getUser(jid = null) {
    return __awaiter(this, void 0, void 0, function* () {
        var Msg = yield User.findAll({
            where: {
                JID: jid
            },
        });
        if (Msg.length < 1) {
            return false;
        }
        else {
            return true;
        }
    });
}
module.exports = {
    User: User,
    addUser: addUser,
    getUser: getUser
};
