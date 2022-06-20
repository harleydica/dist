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
const yt_search_1 = __importDefault(require("yt-search"));
const input_sanitization_1 = __importDefault(require("../sidekick/input-sanitization"));
const db_1 = __importDefault(require("../lib/db"));
const message_type_1 = require("../sidekick/message-type");
const YT = db_1.default.yt;
module.exports = {
    name: "yt",
    description: YT.DESCRIPTION,
    extendedDescription: YT.EXTENDED_DESCRIPTION,
    demo: { isEnabled: true, text: ".yt BotsApp Deployment Tutorial" },
    handle(client, chat, BotsApp, args) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (args.length === 0) {
                    yield client.sendMessage(BotsApp.chatId, YT.ENTER_INPUT, message_type_1.MessageType.text).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                    return;
                }
                const keyword = yield (0, yt_search_1.default)(args.join(" "));
                const videos = keyword.videos.slice(0, 10);
                var topRequests = "";
                var num = 1;
                var reply = yield client.sendMessage(BotsApp.chatId, YT.REPLY, message_type_1.MessageType.text);
                videos.forEach(function (links) {
                    topRequests =
                        topRequests +
                            `*${num}.)* ${links.title} (${links.timestamp}) | *${links.author.name}* | ${links.url}\n\n`;
                    num++;
                });
                if (topRequests === "") {
                    client.sendMessage(BotsApp.chatId, YT.NO_VIDEOS, message_type_1.MessageType.text).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                    yield client.deleteMessage(BotsApp.chatId, {
                        id: reply.key.id,
                        remoteJid: BotsApp.chatId,
                        fromMe: true,
                    });
                    return;
                }
                yield client.sendMessage(BotsApp.chatId, topRequests, message_type_1.MessageType.text).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                yield client.deleteMessage(BotsApp.chatId, {
                    id: reply.key.id,
                    remoteJid: BotsApp.chatId,
                    fromMe: true,
                });
            }
            catch (err) {
                yield client.sendMessage(BotsApp.chatId, YT.NO_VIDEOS, message_type_1.MessageType.text).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                yield client.deleteMessage(BotsApp.chatId, {
                    id: reply.key.id,
                    remoteJid: BotsApp.chatId,
                    fromMe: true,
                });
                return;
            }
        });
    },
};
