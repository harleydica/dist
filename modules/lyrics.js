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
const message_type_1 = require("../sidekick/message-type");
const got_1 = __importDefault(require("got"));
const input_sanitization_1 = __importDefault(require("../sidekick/input-sanitization"));
const db_1 = __importDefault(require("../lib/db"));
const songlyrics = require("songlyrics").default;
module.exports = {
    name: "lyrics",
    description: db_1.default.lyrics.DESCRIPTION,
    extendedDescription: db_1.default.lyrics.EXTENDED_DESCRIPTION,
    demo: { isEnabled: true, text: ".lyrics Stairway to heaven" },
    handle(client, chat, BotsApp, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const processing = yield client.sendMessage(BotsApp.chatId, db_1.default.lyrics.PROCESSING, message_type_1.MessageType.text);
            try {
                var song = "";
                if (BotsApp.isTextReply) {
                    song = BotsApp.replyMessage;
                }
                else if (args.length == 0) {
                    client.sendMessage(BotsApp.chatId, db_1.default.lyrics.NO_ARG, message_type_1.MessageType.text);
                    return;
                }
                else {
                    song = args.join(" ");
                }
                let Response = yield (0, got_1.default)(`https://some-random-api.ml/lyrics/?title=${song}`);
                let data = JSON.parse(Response.body);
                let caption = "*Title :* " +
                    data.title +
                    "\n*Author :* " +
                    data.author +
                    "\n*Lyrics :*\n" +
                    data.lyrics;
                try {
                    yield client.sendMessage(BotsApp.chatId, { url: data.thumbnail.genius }, message_type_1.MessageType.image, {
                        caption: caption,
                    });
                }
                catch (err) {
                    client.sendMessage(BotsApp.chatId, caption, message_type_1.MessageType.text);
                }
                yield client.deleteMessage(BotsApp.chatId, {
                    id: processing.key.id,
                    remoteJid: BotsApp.chatId,
                    fromMe: true,
                });
                // return;
            }
            catch (err) {
                try {
                    let data = yield songlyrics(song);
                    let caption = "*Title :* " +
                        song +
                        "\n*Source :* " +
                        data.source.link +
                        "\n*Lyrics :*\n" +
                        data.lyrics;
                    yield client.sendMessage(BotsApp.chatId, caption, message_type_1.MessageType.text);
                    yield client.deleteMessage(BotsApp.chatId, {
                        id: processing.key.id,
                        remoteJid: BotsApp.chatId,
                        fromMe: true,
                    });
                }
                catch (err) {
                    yield input_sanitization_1.default.handleError(err, client, BotsApp, db_1.default.lyrics.NOT_FOUND);
                    return yield client.deleteMessage(BotsApp.chatId, {
                        id: processing.key.id,
                        remoteJid: BotsApp.chatId,
                        fromMe: true,
                    });
                }
            }
        });
    },
};
