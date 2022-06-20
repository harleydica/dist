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
const ytdl_core_1 = __importDefault(require("ytdl-core"));
const yt_search_1 = __importDefault(require("yt-search"));
const input_sanitization_1 = __importDefault(require("../sidekick/input-sanitization"));
const db_js_1 = __importDefault(require("../lib/db.js"));
const message_type_1 = require("../sidekick/message-type");
const SONG = db_js_1.default.song;
module.exports = {
    name: "song",
    description: SONG.DESCRIPTION,
    extendedDescription: SONG.EXTENDED_DESCRIPTION,
    demo: {
        isEnabled: true,
        text: [
            ".song love of my life",
            ".song https://www.youtube.com/watch?v=0Gc3nvmMQP0",
            ".song https://youtu.be/pWiI9gabW9k",
        ],
    },
    handle(client, chat, BotsApp, args) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (args.length === 0) {
                    yield client.sendMessage(BotsApp.chatId, SONG.ENTER_SONG, message_type_1.MessageType.text).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                    return;
                }
                var reply = yield client.sendMessage(BotsApp.chatId, SONG.DOWNLOADING, message_type_1.MessageType.text);
                var Id = " ";
                if (args[0].includes("youtu")) {
                    Id = args[0];
                    try {
                        if (args[0].includes("watch?v=")) {
                            var songId = args[0].split("watch?v=")[1];
                        }
                        else {
                            var songId = args[0].split("/")[3];
                        }
                        const video = yield (0, yt_search_1.default)({ videoId: songId });
                    }
                    catch (err) {
                        throw err;
                    }
                }
                else {
                    var song = yield (0, yt_search_1.default)(args.join(" "));
                    song = song.all;
                    if (song.length < 1) {
                        client.sendMessage(BotsApp.chatId, SONG.SONG_NOT_FOUND, message_type_1.MessageType.text).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                        return;
                    }
                    Id = song[0].url;
                }
                try {
                    var stream = (0, ytdl_core_1.default)(Id, {
                        quality: "highestaudio",
                    });
                    (0, fluent_ffmpeg_1.default)(stream)
                        .audioBitrate(320)
                        .toFormat("ipod")
                        .saveToFile(`tmp/${chat.key.id}.mp3`)
                        .on("end", () => __awaiter(this, void 0, void 0, function* () {
                        var upload = yield client.sendMessage(BotsApp.chatId, SONG.UPLOADING, message_type_1.MessageType.text);
                        yield client.sendMessage(BotsApp.chatId, fs_1.default.readFileSync(`tmp/${chat.key.id}.mp3`), message_type_1.MessageType.audio).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                        input_sanitization_1.default.deleteFiles(`tmp/${chat.key.id}.mp3`);
                        client.deleteMessage(BotsApp.chatId, {
                            id: reply.key.id,
                            remoteJid: BotsApp.chatId,
                            fromMe: true,
                        });
                        client.deleteMessage(BotsApp.chatId, {
                            id: upload.key.id,
                            remoteJid: BotsApp.chatId,
                            fromMe: true,
                        });
                    }));
                }
                catch (err) {
                    throw err;
                }
            }
            catch (err) {
                yield input_sanitization_1.default.handleError(err, client, BotsApp, SONG.SONG_NOT_FOUND);
            }
        });
    },
};
