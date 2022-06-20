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
const jimp_1 = __importDefault(require("jimp"));
const fs_1 = __importDefault(require("fs"));
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const input_sanitization_1 = __importDefault(require("../sidekick/input-sanitization"));
const qrcode_reader_1 = __importDefault(require("qrcode-reader"));
const db_1 = __importDefault(require("../lib/db"));
const message_type_1 = require("../sidekick/message-type");
const baileys_1 = require("@adiwajshing/baileys");
const DECODE = db_1.default.decodeqr;
module.exports = {
    name: "dqr",
    description: DECODE.DESCRIPTION,
    extendedDescription: DECODE.EXTENDED_DESCRIPTION,
    demo: { isEnabled: false },
    handle(client, chat, BotsApp, args) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        return __awaiter(this, void 0, void 0, function* () {
            var processing;
            // Function to convert qr to text 
            const qrToText = (imagePath, processing) => __awaiter(this, void 0, void 0, function* () {
                var buffer = fs_1.default.readFileSync(imagePath);
                jimp_1.default.read(buffer, function (err, image) {
                    if (err) {
                        console.error(err);
                    }
                    let qrcode = new qrcode_reader_1.default();
                    qrcode.callback = function (err, value) {
                        return __awaiter(this, void 0, void 0, function* () {
                            if (err) {
                                console.error(err);
                                if (err.includes('enough finder patterns')) {
                                    yield client
                                        .sendMessage(BotsApp.chatId, db_1.default.decodeqr.INVALID_INPUT, message_type_1.MessageType.text);
                                }
                            }
                            else {
                                yield client
                                    .sendMessage(BotsApp.chatId, value.result, message_type_1.MessageType.text)
                                    .catch((err) => input_sanitization_1.default.handleError(err, client, BotsApp));
                            }
                        });
                    };
                    // Decoding the QR code
                    qrcode.decode(image.bitmap);
                });
                //Image and message deletion
                yield input_sanitization_1.default.deleteFiles(imagePath);
                return yield client
                    .deleteMessage(BotsApp.chatId, {
                    id: processing.key.id,
                    remoteJid: BotsApp.chatId,
                    fromMe: true,
                })
                    .catch((err) => input_sanitization_1.default.handleError(err, client, BotsApp));
            });
            // Function to convert sticker to image
            const convertToImage = (stickerId, replyChat, processing) => __awaiter(this, void 0, void 0, function* () {
                const fileName = "./tmp/convert_to_image-" + stickerId;
                const stream = yield (0, baileys_1.downloadContentFromMessage)(replyChat.message, replyChat.type);
                yield input_sanitization_1.default.saveBuffer(fileName, stream);
                const imagePath = "./tmp/image-" + stickerId + ".png";
                try {
                    (0, fluent_ffmpeg_1.default)(fileName)
                        .save(imagePath)
                        .on("error", function (err, stdout, stderr) {
                        return __awaiter(this, void 0, void 0, function* () {
                            input_sanitization_1.default.deleteFiles(fileName);
                            throw err;
                        });
                    })
                        .on("end", () => __awaiter(this, void 0, void 0, function* () {
                        input_sanitization_1.default.deleteFiles(fileName);
                        qrToText(imagePath, processing);
                    }));
                }
                catch (err) {
                    yield input_sanitization_1.default.handleError(err, client, BotsApp);
                }
            });
            try {
                if (!BotsApp.isTextReply || (BotsApp.isReplyAudio || BotsApp.isReplyVideo || BotsApp.isReplyAnimatedSticker)) {
                    yield client
                        .sendMessage(BotsApp.chatId, DECODE.INVALID_REPLY, message_type_1.MessageType.text)
                        .catch((err) => input_sanitization_1.default.handleError(err, client, BotsApp));
                    return;
                }
                else if (BotsApp.isReplySticker) {
                    processing = yield client
                        .sendMessage(BotsApp.chatId, DECODE.PROCESSING, message_type_1.MessageType.text);
                    var replyChatObject = {
                        message: (_d = (_c = (_b = (_a = chat.message) === null || _a === void 0 ? void 0 : _a.extendedTextMessage) === null || _b === void 0 ? void 0 : _b.contextInfo) === null || _c === void 0 ? void 0 : _c.quotedMessage) === null || _d === void 0 ? void 0 : _d.stickerMessage,
                        type: 'sticker'
                    };
                    var stickerId = (_g = (_f = (_e = chat.message) === null || _e === void 0 ? void 0 : _e.extendedTextMessage) === null || _f === void 0 ? void 0 : _f.contextInfo) === null || _g === void 0 ? void 0 : _g.stanzaId;
                    yield convertToImage(stickerId, replyChatObject, processing);
                }
                else if (BotsApp.isReplyImage) {
                    processing = yield client
                        .sendMessage(BotsApp.chatId, DECODE.PROCESSING, message_type_1.MessageType.text);
                    var imageId = (_k = (_j = (_h = chat === null || chat === void 0 ? void 0 : chat.message) === null || _h === void 0 ? void 0 : _h.extendedTextMessage) === null || _j === void 0 ? void 0 : _j.contextInfo) === null || _k === void 0 ? void 0 : _k.stanzaId;
                    const fileName = "./tmp/qr_pic" + imageId;
                    const stream = yield (0, baileys_1.downloadContentFromMessage)(chat.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage, 'image');
                    yield input_sanitization_1.default.saveBuffer(fileName, stream);
                    qrToText(fileName, processing);
                }
                else if (!BotsApp.isImage) {
                    yield client
                        .sendMessage(BotsApp.chatId, DECODE.INVALID_INPUT, message_type_1.MessageType.text)
                        .catch((err) => input_sanitization_1.default.handleError(err, client, BotsApp));
                    return;
                }
            }
            catch (err) {
                yield input_sanitization_1.default.handleError(err, client, BotsApp);
            }
        });
    },
};
