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
    name: "remove",
    description: db_js_1.default.remove.DESCRIPTION,
    extendedDescription: db_js_1.default.remove.EXTENDED_DESCRIPTION,
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
                let owner;
                for (const index in BotsApp.groupMembers) {
                    if (BotsApp.groupMembers[index].admin === 'superadmin') {
                        owner = BotsApp.groupMembers[index].id.split("@")[0];
                    }
                }
                if (BotsApp.isTextReply) {
                    let PersonToRemove = chat.message.extendedTextMessage.contextInfo.participant;
                    if (PersonToRemove === owner + "@s.whatsapp.net") {
                        client.sendMessage(BotsApp.chatId, "*" + owner + " is the owner of the group*", message_type_1.MessageType.text).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                        return;
                    }
                    if (PersonToRemove === BotsApp.owner) {
                        client.sendMessage(BotsApp.chatId, "```Why man, why?! Why would you use my powers to remove myself from the group?!🥺```\n*Request Rejected.* 😤", message_type_1.MessageType.text).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                        return;
                    }
                    var isMember = input_sanitization_1.default.isMember(PersonToRemove, BotsApp.groupMembers);
                    if (!isMember) {
                        client.sendMessage(BotsApp.chatId, "*person is not in the group*", message_type_1.MessageType.text).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                    }
                    try {
                        if (PersonToRemove) {
                            yield client.sock.groupParticipantsUpdate(BotsApp.chatId, [PersonToRemove], 'remove').catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                            return;
                        }
                    }
                    catch (err) {
                        throw err;
                    }
                    return;
                }
                if (!args[0]) {
                    client.sendMessage(BotsApp.chatId, db_js_1.default.remove.INPUT_ERROR, message_type_1.MessageType.text).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                    return;
                }
                if (args[0][0] == "@") {
                    const number = args[0].substring(1);
                    if (parseInt(args[0]) === NaN) {
                        client.sendMessage(BotsApp.chatId, db_js_1.default.remove.INPUT_ERROR, message_type_1.MessageType.text).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                        return;
                    }
                    if ((number + "@s.whatsapp.net") === BotsApp.owner) {
                        client.sendMessage(BotsApp.chatId, "```Why man, why?! Why would you use my powers to remove myself from the group?!🥺```\n*Request Rejected.* 😤", message_type_1.MessageType.text).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                        return;
                    }
                    if (!(number === owner)) {
                        yield client.sock.groupParticipantsUpdate(BotsApp.chatId, [number + "@s.whatsapp.net"], 'remove').catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                        return;
                    }
                    else {
                        client.sendMessage(BotsApp.chatId, "*" + owner + " is the owner of the group*", message_type_1.MessageType.text).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                        return;
                    }
                }
                client.sendMessage(BotsApp.chatId, db_js_1.default.remove.INPUT_ERROR, message_type_1.MessageType.text).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
            }
            catch (err) {
                yield input_sanitization_1.default.handleError(err, client, BotsApp);
                return;
            }
        });
    },
};
