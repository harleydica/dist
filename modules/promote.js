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
const REPLY = db_js_1.default.promote;
module.exports = {
    name: "promote",
    description: REPLY.DESCRIPTION,
    extendedDescription: REPLY.EXTENDED_DESCRIPTION,
    handle(client, chat, BotsApp, args) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!BotsApp.isGroup) {
                    client.sendMessage(BotsApp.chatId, REPLY.NOT_A_GROUP, message_type_1.MessageType.text);
                    return;
                }
                yield client.getGroupMetaData(BotsApp.chatId, BotsApp);
                if (!BotsApp.isBotGroupAdmin) {
                    client.sendMessage(BotsApp.chatId, REPLY.BOT_NOT_ADMIN, message_type_1.MessageType.text);
                    return;
                }
                if (!BotsApp.isTextReply && typeof args[0] == "undefined") {
                    client.sendMessage(BotsApp.chatId, REPLY.MESSAGE_NOT_TAGGED, message_type_1.MessageType.text);
                    return;
                }
                const reply = chat.message.extendedTextMessage;
                if (BotsApp.isTextReply) {
                    var contact = reply.contextInfo.participant.split("@")[0];
                }
                else {
                    var contact = yield input_sanitization_1.default.getCleanedContact(args, client, BotsApp);
                }
                var admin = false;
                var isMember = yield input_sanitization_1.default.isMember(contact, BotsApp.groupMembers);
                for (const index in BotsApp.groupMembers) {
                    if (contact == BotsApp.groupMembers[index].id.split("@")[0]) {
                        admin = BotsApp.groupMembers[index].admin != undefined;
                    }
                }
                if (isMember) {
                    if (!admin) {
                        const arr = [contact + "@s.whatsapp.net"];
                        yield client.sock.groupParticipantsUpdate(BotsApp.chatId, arr, 'promote');
                        client.sendMessage(BotsApp.chatId, "*" + contact + " promoted to admin*", message_type_1.MessageType.text);
                    }
                    else {
                        client.sendMessage(BotsApp.chatId, "*" + contact + " is already an admin*", message_type_1.MessageType.text);
                    }
                }
                if (!isMember) {
                    if (contact === undefined) {
                        return;
                    }
                    client.sendMessage(BotsApp.chatId, REPLY.PERSON_NOT_IN_GROUP, message_type_1.MessageType.text);
                    return;
                }
            }
            catch (err) {
                if (err === "NumberInvalid") {
                    yield input_sanitization_1.default.handleError(err, client, BotsApp, "```Invalid number ```" + args[0]);
                }
                else {
                    yield input_sanitization_1.default.handleError(err, client, BotsApp);
                }
            }
        });
    },
};
