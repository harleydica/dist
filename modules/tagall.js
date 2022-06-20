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
    name: "tagall",
    description: db_js_1.default.tagall.DESCRIPTION,
    extendedDescription: db_js_1.default.tagall.EXTENDED_DESCRIPTION,
    demo: {
        isEnabled: true,
        text: [
            ".tagall",
            ".tagall Hey everyone! You have been tagged in this message hehe.",
        ],
    },
    handle(client, chat, BotsApp, args) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (BotsApp.chatId === "917838204238-1632576208@g.us") {
                    return; // Disable this for Spam Chat
                }
                if (!BotsApp.isGroup) {
                    client.sendMessage(BotsApp.chatId, db_js_1.default.general.NOT_A_GROUP, message_type_1.MessageType.text).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                    return;
                }
                yield client.getGroupMetaData(BotsApp.chatId, BotsApp);
                console.log(BotsApp);
                let members = [];
                for (var i = 0; i < BotsApp.groupMembers.length; i++) {
                    members[i] = BotsApp.groupMembers[i].id;
                }
                if (BotsApp.isTextReply) {
                    client.sendMessage(BotsApp.chatId, db_js_1.default.tagall.TAG_MESSAGE, message_type_1.MessageType.text, {
                        contextInfo: {
                            stanzaId: BotsApp.replyMessageId,
                            participant: BotsApp.replyParticipant,
                            quotedMessage: {
                                conversation: BotsApp.replyMessage,
                            },
                            mentionedJid: members,
                        },
                    }).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                    return;
                }
                if (args.length) {
                    client.sendMessage(BotsApp.chatId, args.join(" "), message_type_1.MessageType.text, {
                        contextInfo: {
                            mentionedJid: members,
                        },
                    }).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                    return;
                }
                client.sendMessage(BotsApp.chatId, db_js_1.default.tagall.TAG_MESSAGE, message_type_1.MessageType.text, {
                    contextInfo: {
                        mentionedJid: members,
                    },
                }).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
            }
            catch (err) {
                yield input_sanitization_1.default.handleError(err, client, BotsApp);
            }
            return;
        });
    },
};
