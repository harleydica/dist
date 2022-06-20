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
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const fs_1 = __importDefault(require("fs"));
const input_sanitization_1 = __importDefault(require("../sidekick/input-sanitization"));
const message_type_1 = require("../sidekick/message-type");
const db_1 = __importDefault(require("../lib/db"));
const baileys_1 = require("@adiwajshing/baileys");
const STICKER = db_1.default.sticker;
module.exports = {
    name: "sticker",
    description: STICKER.DESCRIPTION,
    extendedDescription: STICKER.EXTENDED_DESCRIPTION,
    demo: { isEnabled: false },
    handle(client, chat, BotsApp, args) {
        return __awaiter(this, void 0, void 0, function* () {
            // Task starts here
            try {
                // Function to convert media to sticker
                const convertToSticker = (imageId, replyChat) => __awaiter(this, void 0, void 0, function* () {
                    var downloading = yield client.sendMessage(BotsApp.chatId, STICKER.DOWNLOADING, message_type_1.MessageType.text);
                    const fileName = "./tmp/convert_to_sticker-" + imageId;
                    const stream = yield (0, baileys_1.downloadContentFromMessage)(replyChat.message, replyChat.type);
                    yield input_sanitization_1.default.saveBuffer(fileName, stream);
                    const stickerPath = "./tmp/st-" + imageId + ".webp";
                    // If is an image
                    if (BotsApp.type === "image" || BotsApp.isReplyImage) {
                        (0, fluent_ffmpeg_1.default)(fileName)
                            .outputOptions(["-y", "-vcodec libwebp"])
                            .videoFilters("scale=2000:2000:flags=lanczos:force_original_aspect_ratio=decrease,format=rgba,pad=2000:2000:(ow-iw)/2:(oh-ih)/2:color=#00000000,setsar=1")
                            .save(stickerPath)
                            .on("end", () => __awaiter(this, void 0, void 0, function* () {
                            yield client.sendMessage(BotsApp.chatId, fs_1.default.readFileSync(stickerPath), message_type_1.MessageType.sticker).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                            input_sanitization_1.default.deleteFiles(fileName, stickerPath);
                            yield client.deleteMessage(BotsApp.chatId, {
                                id: downloading.key.id,
                                remoteJid: BotsApp.chatId,
                                fromMe: true,
                            }).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                        }))
                            .on('error', (err) => __awaiter(this, void 0, void 0, function* () {
                            input_sanitization_1.default.handleError(err, client, BotsApp);
                            yield client.deleteMessage(BotsApp.chatId, {
                                id: downloading.key.id,
                                remoteJid: BotsApp.chatId,
                                fromMe: true,
                            }).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                        }));
                        return;
                    }
                    // If is a video
                    (0, fluent_ffmpeg_1.default)(fileName)
                        .duration(8)
                        .outputOptions([
                        "-y",
                        "-vcodec libwebp",
                        "-lossless 1",
                        "-qscale 1",
                        "-preset default",
                        "-loop 0",
                        "-an",
                        "-vsync 0",
                        "-s 600x600",
                    ])
                        .videoFilters("scale=600:600:flags=lanczos:force_original_aspect_ratio=decrease,format=rgba,pad=600:600:(ow-iw)/2:(oh-ih)/2:color=#00000000,setsar=1")
                        .save(stickerPath)
                        .on("end", (err) => __awaiter(this, void 0, void 0, function* () {
                        yield client.sendMessage(BotsApp.chatId, fs_1.default.readFileSync(stickerPath), message_type_1.MessageType.sticker).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                        input_sanitization_1.default.deleteFiles(fileName, stickerPath);
                        yield client.deleteMessage(BotsApp.chatId, {
                            id: downloading.key.id,
                            remoteJid: BotsApp.chatId,
                            fromMe: true,
                        }).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                    }))
                        .on('error', (err) => __awaiter(this, void 0, void 0, function* () {
                        input_sanitization_1.default.handleError(err, client, BotsApp);
                        yield client.deleteMessage(BotsApp.chatId, {
                            id: downloading.key.id,
                            remoteJid: BotsApp.chatId,
                            fromMe: true,
                        }).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                    }));
                    return;
                });
                // User sends media message along with command in caption
                if (BotsApp.isImage || BotsApp.isGIF || BotsApp.isVideo) {
                    var replyChatObject = {
                        message: (BotsApp.type === 'image' ? chat.message.imageMessage : chat.message.videoMessage),
                        type: BotsApp.type
                    };
                    var imageId = chat.key.id;
                    convertToSticker(imageId, replyChatObject);
                }
                // Replied to an image , gif or video
                else if (BotsApp.isReplyImage ||
                    BotsApp.isReplyGIF ||
                    BotsApp.isReplyVideo) {
                    var replyChatObject = {
                        message: (BotsApp.isReplyImage ? chat.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage : chat.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage),
                        type: (BotsApp.isReplyImage ? 'image' : 'video')
                    };
                    var imageId = chat.message.extendedTextMessage.contextInfo.stanzaId;
                    convertToSticker(imageId, replyChatObject);
                }
                else {
                    client.sendMessage(BotsApp.chatId, STICKER.TAG_A_VALID_MEDIA_MESSAGE, message_type_1.MessageType.text).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                }
                return;
            }
            catch (err) {
                yield input_sanitization_1.default.handleError(err, client, BotsApp, STICKER.TAG_A_VALID_MEDIA_MESSAGE);
            }
        });
    },
};
