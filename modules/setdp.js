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
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const input_sanitization_1 = __importDefault(require("../sidekick/input-sanitization"));
const db_js_1 = __importDefault(require("../lib/db.js"));
const baileys_1 = require("@adiwajshing/baileys");
const message_type_1 = require("../sidekick/message-type");
const REPLY = db_js_1.default.setdp;
module.exports = {
    name: "setdp",
    description: REPLY.DESCRIPTION,
    extendedDescription: REPLY.EXTENDED_DESCRIPTION,
    demo: { isEnabled: false },
    handle(client, chat, BotsApp, args) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!BotsApp.isGroup) {
                    yield client.sendMessage(BotsApp.chatId, REPLY.NOT_A_GROUP, message_type_1.MessageType.text).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                    return;
                }
                if (!BotsApp.isImage && !BotsApp.isReplyImage) {
                    yield client.sendMessage(BotsApp.chatId, REPLY.NOT_AN_IMAGE, message_type_1.MessageType.text).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                    return;
                }
                var update = yield client.sendMessage(BotsApp.chatId, REPLY.ICON_CHANGED, message_type_1.MessageType.text);
                var imageId = chat.key.id;
                const fileName = "./tmp/change_pic" + imageId;
                if (BotsApp.isImage) {
                    const stream = yield (0, baileys_1.downloadContentFromMessage)(chat.message.imageMessage, 'image');
                    yield input_sanitization_1.default.saveBuffer(fileName, stream);
                }
                else {
                    const stream = yield (0, baileys_1.downloadContentFromMessage)(chat.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage, 'image');
                    yield input_sanitization_1.default.saveBuffer(fileName, stream);
                }
                const imagePath = "./tmp/image-" + imageId + ".png";
                (0, fluent_ffmpeg_1.default)(fileName)
                    .outputOptions(["-y", "-vcodec png", "-s 500x500"])
                    .videoFilters("scale=2000:2000:flags=lanczos:force_original_aspect_ratio=decrease:eval=frame,format=rgba,pad=2000:2000:(ow-iw)/2:(oh-ih)/2,setsar=1:1")
                    .save(imagePath)
                    .on("end", () => __awaiter(this, void 0, void 0, function* () {
                    client.sock.updateProfilePicture(BotsApp.chatId, fs_1.default.readFileSync(imagePath)).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                    //Image and message deletion
                    input_sanitization_1.default.deleteFiles(fileName, imagePath);
                    return yield client.deleteMessage(BotsApp.chatId, {
                        id: update.key.id,
                        remoteJid: BotsApp.chatId,
                        fromMe: true,
                    }).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                }));
            }
            catch (err) {
                yield input_sanitization_1.default.handleError(err, client, BotsApp);
            }
            return;
        });
    },
};
