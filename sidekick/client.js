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
const message_type_1 = require("./message-type");
class Client {
    constructor(sock) {
        this.sock = sock;
    }
    sendMessage(jid, content, type, options) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let res;
            let ops;
            if (type === message_type_1.MessageType.text) {
                ops = {
                    text: content
                };
                if ((_a = options === null || options === void 0 ? void 0 : options.contextInfo) === null || _a === void 0 ? void 0 : _a.mentionedJid) {
                    ops.mentions = options.contextInfo.mentionedJid;
                }
                res = yield this.sock.sendMessage(jid, ops);
            }
            else if (type === message_type_1.MessageType.sticker) {
                res = yield this.sock.sendMessage(jid, {
                    sticker: new Buffer(content)
                });
            }
            else if (type === message_type_1.MessageType.audio) {
                res = yield this.sock.sendMessage(jid, {
                    audio: content,
                    mimetype: 'audio/mp4'
                });
            }
            else if (type === message_type_1.MessageType.image) {
                ops = {
                    image: content,
                };
                if (options === null || options === void 0 ? void 0 : options.caption) {
                    ops.caption = options.caption;
                }
                res = yield this.sock.sendMessage(jid, ops);
            }
            else if (type == message_type_1.MessageType.audio) {
                res = yield this.sock.sendMessage(jid, {
                    audio: content,
                    mimetype: 'audio/mp3'
                });
            }
            else if (type === message_type_1.MessageType.buttonsMessage) {
                res = yield this.sock.sendMessage(jid, content);
            }
            else if (type == message_type_1.MessageType.video) {
                ops = {
                    video: content,
                };
                if (options === null || options === void 0 ? void 0 : options.caption) {
                    ops.caption = options.caption;
                }
                res = yield this.sock.sendMessage(jid, ops);
            }
            else if (type === message_type_1.MessageType.document) {
                ops = {
                    text: options.caption
                };
                let ops2 = {
                    document: content,
                };
                if (options === null || options === void 0 ? void 0 : options.mimetype) {
                    ops2.mimetype = options.mimetype;
                    ops2.fileName = options.filename;
                }
                // console.log(ops2);
                yield this.sock.sendMessage(jid, ops);
                res = yield this.sock.sendMessage(jid, ops2);
            }
            return res;
        });
    }
    ;
    deleteMessage(jid, key) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.sock.sendMessage(jid, {
                delete: key
            });
        });
    }
    ;
    getGroupMetaData(jid, BotsApp) {
        return __awaiter(this, void 0, void 0, function* () {
            const groupMetadata = jid.endsWith("@g.us") ? yield this.sock.groupMetadata(jid) : null;
            const getGroupAdmins = (participants) => {
                var admins = [];
                for (var i in participants) {
                    participants[i].admin ? admins.push(participants[i].id) : '';
                }
                // console.log("ADMINS -> " + admins);
                return admins;
            };
            BotsApp.groupName = BotsApp.isGroup ? groupMetadata.subject : null;
            BotsApp.groupMembers = BotsApp.isGroup ? groupMetadata.participants : null;
            BotsApp.groupAdmins = BotsApp.isGroup ? getGroupAdmins(BotsApp.groupMembers) : null;
            BotsApp.groupId = BotsApp.isGroup ? groupMetadata.id : null;
            BotsApp.isBotGroupAdmin = BotsApp.isGroup ? (BotsApp.groupAdmins.includes(BotsApp.owner)) : false;
            BotsApp.isSenderGroupAdmin = BotsApp.isGroup ? (BotsApp.groupAdmins.includes(BotsApp.sender)) : false;
        });
    }
}
module.exports = Client;
