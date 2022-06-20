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
const fs_1 = __importDefault(require("fs"));
const input_sanitization_1 = __importDefault(require("../sidekick/input-sanitization"));
const db_1 = __importDefault(require("../lib/db"));
const baileys_1 = require("@adiwajshing/baileys");
const message_type_1 = require("../sidekick/message-type");
const jsdom_1 = require("jsdom");
const { window } = new jsdom_1.JSDOM();
const rename = db_1.default.rename;
module.exports = {
    name: "rename",
    description: rename.DESCRIPTION,
    extendedDescription: rename.EXTENDED_DESCRIPTION,
    demo: { isEnabled: false },
    handle(client, chat, BotsApp, args) {
        return __awaiter(this, void 0, void 0, function* () {
            // Task starts here
            try {
                var startTime = window.performance.now();
                // Function to convert media to sticker
                const changeName = (replyChat, mediaType, mimetype, title) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        let mediaKey = mediaType.substring(0, mediaType.indexOf("Message"));
                        var downloading = yield client
                            .sendMessage(BotsApp.chatId, rename.DOWNLOADING, message_type_1.MessageType.text);
                        const updatedName = args.join(" ");
                        const fileName = "./tmp/" + updatedName;
                        const stream = yield (0, baileys_1.downloadContentFromMessage)(replyChat.message[mediaType], mediaKey);
                        yield input_sanitization_1.default.saveBuffer(fileName, stream);
                        var endTime = window.performance.now();
                        const time = ((endTime - startTime) / 1000).toFixed(2);
                        yield client
                            .sendMessage(BotsApp.chatId, fs_1.default.readFileSync(fileName), message_type_1.MessageType.document, {
                            mimetype: mimetype,
                            filename: updatedName,
                            caption: `BotsApp changed file name from ${title} to ${updatedName} in ${time} second(s).`,
                        })
                            .catch((err) => input_sanitization_1.default.handleError(err, client, BotsApp));
                        input_sanitization_1.default.deleteFiles(fileName);
                        return client
                            .deleteMessage(BotsApp.chatId, {
                            id: downloading.key.id,
                            remoteJid: BotsApp.chatId,
                            fromMe: true,
                        })
                            .catch((err) => input_sanitization_1.default.handleError(err, client, BotsApp));
                    }
                    catch (err) {
                        yield client.sendMessage(BotsApp.chatId, rename.VALID_REPLY, message_type_1.MessageType.text);
                        return;
                    }
                });
                if (BotsApp.isTextReply) {
                    if (args.length < 1) {
                        yield client.sendMessage(BotsApp.chatId, rename.PROVIDE_NEW_NAME, message_type_1.MessageType.text);
                        return;
                    }
                    else if (chat.message.extendedTextMessage.contextInfo.quotedMessage.conversation) {
                        yield client.sendMessage(BotsApp.chatId, rename.VALID_REPLY, message_type_1.MessageType.text);
                        return;
                    }
                    let replyChat = {
                        message: chat.message.extendedTextMessage.contextInfo
                            .quotedMessage,
                    };
                    let mediaType = Object.keys(replyChat.message)[0];
                    let title = replyChat.message[mediaType].title || '-no name-';
                    let mimetype = replyChat.message[mediaType].mimetype;
                    changeName(replyChat, mediaType, mimetype, title);
                }
                else {
                    client.sendMessage(BotsApp.chatId, rename.REPLY_TO_DOCUMENT, message_type_1.MessageType.text);
                    return;
                }
            }
            catch (err) {
                yield input_sanitization_1.default.handleError(err, client, BotsApp, rename.ERROR);
            }
        });
    },
};
