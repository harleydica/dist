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
const form_data_1 = __importDefault(require("form-data"));
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = __importDefault(require("cheerio"));
const STOV = db_1.default.stov;
module.exports = {
    name: "stov",
    description: STOV.DESCRIPTION,
    extendedDescription: STOV.EXTENDED_DESCRIPTION,
    demo: { isEnabled: false },
    handle(client, chat, BotsApp, args) {
        return __awaiter(this, void 0, void 0, function* () {
            // Task starts here
            try {
                // Function to convert media to sticker
                const convertToVideo = (stickerId, replyChat) => __awaiter(this, void 0, void 0, function* () {
                    var downloading = yield client.sendMessage(BotsApp.chatId, STOV.DOWNLOADING, message_type_1.MessageType.text);
                    const fileName = "./tmp/convert_to_video-" + stickerId;
                    const stream = yield (0, baileys_1.downloadContentFromMessage)(replyChat.message, replyChat.type);
                    yield input_sanitization_1.default.saveBuffer(fileName, stream);
                    const videoPath = "./tmp/video-" + stickerId + ".mp4";
                    try {
                        let res = yield webp2mp4File(fileName, videoPath);
                        yield client.sendMessage(BotsApp.chatId, { url: res }, message_type_1.MessageType.video).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                    }
                    catch (err) {
                        throw err;
                    }
                });
                if (BotsApp.isReplySticker) {
                    var replyChatObject = {
                        message: chat.message.extendedTextMessage.contextInfo
                            .quotedMessage.stickerMessage,
                        type: 'sticker'
                    };
                    var stickerId = chat.message.extendedTextMessage.contextInfo.stanzaId;
                    convertToVideo(stickerId, replyChatObject);
                }
                else {
                    client.sendMessage(BotsApp.chatId, STOV.TAG_A_VALID_STICKER_MESSAGE, message_type_1.MessageType.text).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                }
                return;
            }
            catch (err) {
                yield input_sanitization_1.default.handleError(err, client, BotsApp, STOV.ERROR);
            }
        });
    },
};
function webp2mp4File(filePath, VideoPath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const bodyForm = new form_data_1.default();
            bodyForm.append('new-image-url', '');
            bodyForm.append('new-image', fs_1.default.createReadStream(filePath));
            let { data } = yield (0, axios_1.default)({
                method: 'post',
                url: 'https://s6.ezgif.com/webp-to-mp4',
                data: bodyForm,
                headers: {
                    'Content-Type': `multipart/form-data boundary=${bodyForm._boundary}`
                }
            });
            const bodyFormThen = new form_data_1.default();
            var $ = cheerio_1.default.load(data);
            const file = $('input[name="file"]').attr('value');
            const convert = $('input[name="file"]').attr('value');
            const gotdata = {
                file: file,
                convert: convert
            };
            bodyFormThen.append('file', gotdata.file);
            bodyFormThen.append('convert', gotdata.convert);
            let res = yield (0, axios_1.default)({
                method: 'post',
                url: 'https://ezgif.com/webp-to-mp4/' + gotdata.file,
                data: bodyFormThen,
                headers: {
                    'Content-Type': `multipart/form-data boundary=${bodyFormThen._boundary}`
                }
            });
            $ = cheerio_1.default.load(res.data);
            const result = 'https:' + $('div#output > p.outfile > video > source').attr('src');
            return result;
        }
        catch (err) {
            console.log(err);
        }
    });
}
