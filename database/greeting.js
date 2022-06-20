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
class Greeting extends sequelize_1.Model {
}
Greeting.init({
    chat: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    switched: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        defaultValue: "ON",
    },
    greetingType: {
        type: sequelize_1.DataTypes.TEXT,
    },
    message: {
        type: sequelize_1.DataTypes.TEXT,
    },
}, { sequelize, tableName: "Greetings" });
function getMessage(jid = null, type) {
    return __awaiter(this, void 0, void 0, function* () {
        var Msg = yield Greeting.findAll({
            where: {
                chat: jid,
                greetingType: type,
            },
            raw: true
        });
        if (Msg.length < 1) {
            return false;
        }
        else {
            return Msg[0];
        }
    });
}
function checkSettings(jid = null, type) {
    return __awaiter(this, void 0, void 0, function* () {
        var Msg = yield Greeting.findAll({
            where: {
                chat: jid,
                greetingType: type,
            },
            raw: true
        });
        if (Msg.length < 1) {
            return false;
        }
        else {
            if (Msg[0].switched === "ON") {
                return "ON";
            }
            else {
                return "OFF";
            }
        }
    });
}
function changeSettings(groupJid = null, isWorking) {
    return __awaiter(this, void 0, void 0, function* () {
        yield Greeting.update({
            switched: isWorking
        }, {
            where: {
                chat: groupJid,
            },
        });
    });
}
function setWelcome(jid = null, text = null) {
    return __awaiter(this, void 0, void 0, function* () {
        Greeting.findOrCreate({
            where: {
                chat: jid,
                greetingType: "welcome",
            },
            defaults: {
                chat: jid,
                switched: "ON",
                greetingType: "welcome",
                message: text,
            },
        });
    });
}
function setGoodbye(jid, text = null) {
    return __awaiter(this, void 0, void 0, function* () {
        Greeting.findOrCreate({
            where: {
                chat: jid,
                greetingType: "goodbye",
            },
            defaults: {
                chat: jid,
                switched: "ON",
                greetingType: "goodbye",
                message: text,
            },
        });
    });
}
function deleteMessage(jid = null, type = null) {
    return __awaiter(this, void 0, void 0, function* () {
        var Msg = yield Greeting.findAll({
            where: {
                chat: jid,
                greetingType: type,
            },
        });
        if (Msg.length < 1) {
            return false;
        }
        else {
            return yield Msg[0].destroy();
        }
    });
}
module.exports = {
    Greeting: Greeting,
    getMessage: getMessage,
    changeSettings: changeSettings,
    checkSettings: checkSettings,
    setWelcome: setWelcome,
    setGoodbye: setGoodbye,
    deleteMessage: deleteMessage,
};
