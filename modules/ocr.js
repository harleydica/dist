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
const ocr_space_api_wrapper_1 = __importDefault(require("ocr-space-api-wrapper"));
const db_js_1 = __importDefault(require("../lib/db.js"));
const config_1 = __importDefault(require("../config"));
const input_sanitization_1 = __importDefault(require("../sidekick/input-sanitization"));
const baileys_1 = require("@adiwajshing/baileys");
const message_type_1 = require("../sidekick/message-type");
const OCR = db_js_1.default.ocr;
module.exports = {
    name: "ocr",
    description: OCR.DESCRIPTION,
    extendedDescription: OCR.EXTENDED_DESCRIPTION,
    handle(client, chat, BotsApp, args) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (BotsApp.isImage) {
                    const processing = yield client.sendMessage(BotsApp.chatId, OCR.PROCESSING, message_type_1.MessageType.text);
                    var replyChatObject = {
                        message: chat.message.imageMessage,
                    };
                    var imageId = chat.key.id;
                    const fileName = "./tmp/img-" + imageId + '.png';
                    const stream = yield (0, baileys_1.downloadContentFromMessage)(replyChatObject.message, 'image');
                    yield input_sanitization_1.default.saveBuffer(fileName, stream);
                    try {
                        const text = yield (0, ocr_space_api_wrapper_1.default)(fileName, {
                            apiKey: config_1.default.OCR_API_KEY,
                        });
                        var Msg = text.ParsedResults[0].ParsedText;
                        if (Msg === "") {
                            client.sendMessage(BotsApp.chatId, OCR.NO_TEXT, message_type_1.MessageType.text);
                            return yield client.deleteMessage(BotsApp.chatId, {
                                id: processing.key.id,
                                remoteJid: BotsApp.chatId,
                                fromMe: true,
                            });
                        }
                        client.sendMessage(BotsApp.chatId, Msg, message_type_1.MessageType.text);
                    }
                    catch (error) {
                        throw error;
                    }
                    input_sanitization_1.default.deleteFiles(fileName);
                    return yield client.deleteMessage(BotsApp.chatId, {
                        id: processing.key.id,
                        remoteJid: BotsApp.chatId,
                        fromMe: true,
                    });
                }
                else if (BotsApp.isReplyImage) {
                    const processing = yield client.sendMessage(BotsApp.chatId, OCR.PROCESSING, message_type_1.MessageType.text);
                    var replyChatObject = {
                        message: chat.message.extendedTextMessage.contextInfo
                            .quotedMessage.imageMessage,
                    };
                    var imageId = chat.message.extendedTextMessage.contextInfo.stanzaId;
                    const fileName = "./tmp/img-" + imageId + '.png';
                    const stream = yield (0, baileys_1.downloadContentFromMessage)(replyChatObject.message, 'image');
                    yield input_sanitization_1.default.saveBuffer(fileName, stream);
                    try {
                        const text = yield (0, ocr_space_api_wrapper_1.default)(fileName, {
                            apiKey: config_1.default.OCR_API_KEY,
                        });
                        console.log(text);
                        var Msg = text.ParsedResults[0].ParsedText;
                        if (Msg === "") {
                            client.sendMessage(BotsApp.chatId, OCR.NO_TEXT, message_type_1.MessageType.text);
                            return yield client.deleteMessage(BotsApp.chatId, {
                                id: processing.key.id,
                                remoteJid: BotsApp.chatId,
                                fromMe: true,
                            });
                        }
                        client.sendMessage(BotsApp.chatId, Msg, message_type_1.MessageType.text);
                    }
                    catch (error) {
                        throw error;
                    }
                    input_sanitization_1.default.deleteFiles(fileName);
                    return yield client.deleteMessage(BotsApp.chatId, {
                        id: processing.key.id,
                        remoteJid: BotsApp.chatId,
                        fromMe: true,
                    });
                }
                else {
                    yield client.sendMessage(BotsApp.chatId, OCR.ERROR_MSG, message_type_1.MessageType.text);
                }
                setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    yield client.sendMessage(BotsApp.chatId, OCR.ERROR_MSG, message_type_1.MessageType.text);
                    return;
                }), 300000);
                return;
            }
            catch (err) {
                yield input_sanitization_1.default.handleError(err, client, BotsApp);
            }
        });
    },
};
