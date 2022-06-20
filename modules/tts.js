"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const string_format_1 = __importDefault(require("string-format"));
const googleTTS = __importStar(require("google-tts-api"));
const db_js_1 = __importDefault(require("../lib/db.js"));
const message_type_1 = require("../sidekick/message-type");
const tts = db_js_1.default.tts;
module.exports = {
    name: "tts",
    description: tts.DESCRIPTION,
    extendedDescription: tts.EXTENDED_DESCRIPTION,
    demo: { isEnabled: true, text: ['.tts Hello, how are you?', '.tts Hello, how are you? | ja'] },
    handle(client, chat, BotsApp, args) {
        return __awaiter(this, void 0, void 0, function* () {
            let text = '';
            let langCode = "en";
            if (BotsApp.isTextReply && BotsApp.replyMessage) {
                text = BotsApp.replyMessage;
            }
            else if (BotsApp.isTextReply) {
                yield client.sendMessage(BotsApp.chatId, tts.INCORRECT_REPLY, message_type_1.MessageType.text);
                return;
            }
            else {
                for (var i = 0; i < args.length; i++) {
                    if (args[i] == '|') {
                        langCode = args[i + 1];
                        break;
                    }
                    text += args[i] + " ";
                }
            }
            const proccessing = yield client.sendMessage(BotsApp.chatId, tts.PROCESSING, message_type_1.MessageType.text);
            if (text === "") {
                yield client.sendMessage(BotsApp.chatId, tts.NO_INPUT, message_type_1.MessageType.text);
                return yield client.deleteMessage(BotsApp.chatId, { id: proccessing.key.id, remoteJid: BotsApp.chatId, fromMe: true });
            }
            if (text.length > 200) {
                yield client.sendMessage(BotsApp.chatId, (0, string_format_1.default)(tts.TOO_LONG, text.length.toString()), message_type_1.MessageType.text);
            }
            else {
                try {
                    const url = googleTTS.getAudioUrl(text, {
                        lang: langCode,
                        slow: false,
                        host: 'https://translate.google.com',
                    });
                    yield client.sendMessage(BotsApp.chatId, { url: url }, message_type_1.MessageType.audio);
                }
                catch (err) {
                    console.log(err);
                }
            }
            return yield client.deleteMessage(BotsApp.chatId, { id: proccessing.key.id, remoteJid: BotsApp.chatId, fromMe: true });
        });
    }
};
