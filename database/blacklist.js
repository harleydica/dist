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
class Blacklist extends sequelize_1.Model {
}
Blacklist.init({
    JID: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    GRPID: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, { sequelize, tableName: "Blacklist" });
function addBlacklistUser(jid = "", GrpId = "") {
    return __awaiter(this, void 0, void 0, function* () {
        Blacklist.findOrCreate({
            where: {
                JID: jid,
                GRPID: GrpId,
            },
        });
    });
}
function getBlacklistUser(jid = "", GrpId = "") {
    return __awaiter(this, void 0, void 0, function* () {
        var Msg = yield Blacklist.findAll({
            where: {
                JID: "",
                GRPID: GrpId,
            },
        });
        if (Msg.length < 1) {
            var Msg = yield Blacklist.findAll({
                where: {
                    JID: jid,
                    GRPID: "",
                },
            });
            if (Msg.length < 1) {
                var Msg = yield Blacklist.findAll({
                    where: {
                        JID: jid,
                        GRPID: GrpId,
                    },
                });
                if (Msg.length < 1) {
                    return false;
                }
                else {
                    return true;
                }
            }
            else {
                return true;
            }
        }
        else {
            return true;
        }
    });
}
function removeBlacklistUser(jid = "", GrpId = "") {
    return __awaiter(this, void 0, void 0, function* () {
        var Msg = yield Blacklist.findAll({
            where: {
                JID: jid,
                GRPID: GrpId,
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
    Blacklist: Blacklist,
    addBlacklistUser: addBlacklistUser,
    getBlacklistUser: getBlacklistUser,
    removeBlacklistUser: removeBlacklistUser,
};
