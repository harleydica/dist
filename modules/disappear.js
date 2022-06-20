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
const db_js_1 = __importDefault(require("../lib/db.js"));
const input_sanitization_1 = __importDefault(require("../sidekick/input-sanitization"));
const message_type_1 = require("../sidekick/message-type");
module.exports = {
    name: "disappear",
    description: db_js_1.default.disappear.DESCRIPTION,
    extendedDescription: db_js_1.default.disappear.EXTENDED_DESCRIPTION,
    demo: { isEnabled: true, text: [".disappear", ".disappear off"] },
    handle(client, chat, BotsApp, args) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var time = 7 * 24 * 60 * 60;
                if (BotsApp.isPm) {
                    client.sendMessage(BotsApp.chatId, db_js_1.default.general.NOT_A_GROUP, message_type_1.MessageType.text).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                    return;
                }
                if (BotsApp.isGroup) {
                    if (chat.message.extendedTextMessage == null) {
                        yield client.sock.sendMessage(BotsApp.chatId, { disappearingMessagesInChat: time }).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                    }
                    else {
                        yield client.sock.sendMessage(BotsApp.chatId, { disappearingMessagesInChat: false }).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                    }
                    return;
                }
                if (chat.message.extendedTextMessage.contextInfo.expiration == 0) {
                    time = 7 * 24 * 60 * 60;
                }
                else {
                    time = false;
                }
                yield client.sock.sendMessage(BotsApp.chatId, { disappearingMessagesInChat: time }).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                return;
            }
            catch (err) {
                yield input_sanitization_1.default.handleError(err, client, BotsApp);
            }
        });
    },
};
