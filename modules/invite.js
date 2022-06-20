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
Object.defineProperty(exports, "__esModule", { value: true });
const input_sanitization_1 = __importDefault(require("../sidekick/input-sanitization"));
const db_js_1 = __importDefault(require("../lib/db.js"));
const message_type_1 = require("../sidekick/message-type");
module.exports = {
    name: "invite",
    description: db_js_1.default.invite.DESCRIPTION,
    extendedDescription: db_js_1.default.invite.EXTENDED_DESCRIPTION,
    demo: { isEnabled: false },
    handle(client, chat, BotsApp, args) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!BotsApp.isGroup) {
                    client.sendMessage(BotsApp.chatId, db_js_1.default.general.NOT_A_GROUP, message_type_1.MessageType.text).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                    return;
                }
                yield client.getGroupMetaData(BotsApp.chatId, BotsApp);
                if (!BotsApp.isBotGroupAdmin) {
                    client.sendMessage(BotsApp.chatId, db_js_1.default.general.BOT_NOT_ADMIN, message_type_1.MessageType.text).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                    return;
                }
                const code = yield client.sock.groupInviteCode(BotsApp.chatId);
                if (BotsApp.isTextReply) {
                    client.sendMessage(chat.message.extendedTextMessage.contextInfo.participant, "https://chat.whatsapp.com/" + code, message_type_1.MessageType.text).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                    client.sendMessage(BotsApp.chatId, db_js_1.default.invite.LINK_SENT, message_type_1.MessageType.text).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                    return;
                }
                client.sendMessage(BotsApp.chatId, "https://chat.whatsapp.com/" + code, message_type_1.MessageType.text).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                return;
            }
            catch (err) {
                yield input_sanitization_1.default.handleError(err, client, BotsApp);
            }
        });
    },
};
