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
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const fs_1 = __importDefault(require("fs"));
const input_sanitization_1 = __importDefault(require("../sidekick/input-sanitization"));
const db_1 = __importDefault(require("../lib/db"));
const baileys_1 = require("@adiwajshing/baileys");
const message_type_1 = require("../sidekick/message-type");
const STOI = db_1.default.stoi;
module.exports = {
    name: "stoi",
    description: STOI.DESCRIPTION,
    extendedDescription: STOI.EXTENDED_DESCRIPTION,
    demo: { isEnabled: false },
    handle(client, chat, BotsApp, args) {
        return __awaiter(this, void 0, void 0, function* () {
            // Task starts here
            try {
                // Function to convert media to sticker
                const convertToImage = (stickerId, replyChat) => __awaiter(this, void 0, void 0, function* () {
                    var downloading = yield client.sendMessage(BotsApp.chatId, STOI.DOWNLOADING, message_type_1.MessageType.text);
                    const fileName = "./tmp/convert_to_image-" + stickerId;
                    const stream = yield (0, baileys_1.downloadContentFromMessage)(replyChat.message, replyChat.type);
                    yield input_sanitization_1.default.saveBuffer(fileName, stream);
                    const imagePath = "./tmp/image-" + stickerId + ".png";
                    try {
                        (0, fluent_ffmpeg_1.default)(fileName)
                            .save(imagePath)
                            .on("error", function (err, stdout, stderr) {
                            input_sanitization_1.default.deleteFiles(fileName);
                            client.deleteMessage(BotsApp.chatId, {
                                id: downloading.key.id,
                                remoteJid: BotsApp.chatId,
                                fromMe: true,
                            });
                            throw err;
                        })
                            .on("end", () => __awaiter(this, void 0, void 0, function* () {
                            yield client.sendMessage(BotsApp.chatId, fs_1.default.readFileSync(imagePath), message_type_1.MessageType.image).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                            input_sanitization_1.default.deleteFiles(fileName, imagePath);
                            return yield client.deleteMessage(BotsApp.chatId, {
                                id: downloading.key.id,
                                remoteJid: BotsApp.chatId,
                                fromMe: true,
                            }).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                        }));
                    }
                    catch (err) {
                        throw err;
                    }
                });
                if (BotsApp.isReplySticker && !BotsApp.isReplyAnimatedSticker) {
                    var replyChatObject = {
                        message: chat.message.extendedTextMessage.contextInfo
                            .quotedMessage.stickerMessage,
                        type: 'sticker'
                    };
                    var stickerId = chat.message.extendedTextMessage.contextInfo.stanzaId;
                    convertToImage(stickerId, replyChatObject);
                }
                else if (BotsApp.isReplyAnimatedSticker) {
                    client.sendMessage(BotsApp.chatId, STOI.TAG_A_VALID_STICKER_MESSAGE, message_type_1.MessageType.text).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                    return;
                }
                else {
                    client.sendMessage(BotsApp.chatId, STOI.TAG_A_VALID_STICKER_MESSAGE, message_type_1.MessageType.text).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                }
                return;
            }
            catch (err) {
                yield input_sanitization_1.default.handleError(err, client, BotsApp, STOI.ERROR);
            }
        });
    },
};
