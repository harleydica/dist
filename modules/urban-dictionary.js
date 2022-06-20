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
const input_sanitization_1 = __importDefault(require("../sidekick/input-sanitization"));
const db_1 = __importDefault(require("../lib/db"));
const string_format_1 = __importDefault(require("string-format"));
const message_type_1 = require("../sidekick/message-type");
const urban_dictionary_1 = __importDefault(require("urban-dictionary"));
module.exports = {
    name: "ud",
    description: db_1.default.ud.DESCRIPTION,
    extendedDescription: db_1.default.ud.EXTENDED_DESCRIPTION,
    demo: { isEnabled: true, text: ".ud bruh" },
    handle(client, chat, BotsApp, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const processing = yield client.sendMessage(BotsApp.chatId, db_1.default.ud.PROCESSING, message_type_1.MessageType.text);
            try {
                var text = "";
                if (args.length == 0) {
                    client.sendMessage(BotsApp.chatId, db_1.default.ud.NO_ARG, message_type_1.MessageType.text).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                    return;
                }
                else {
                    text = args.join(" ");
                }
                let Response = yield urban_dictionary_1.default.define(text);
                console.log(Response);
                let result = Response.reduce(function (prev, current) {
                    return prev.thumbs_up + prev.thumbs_down >
                        current.thumbs_up + current.thumbs_down
                        ? prev
                        : current;
                });
                result.definition = result.definition.replace(/\[/g, "_");
                result.definition = result.definition.replace(/\]/g, "_");
                result.example = result.example.replace(/\[/g, "_");
                result.example = result.example.replace(/\]/g, "_");
                let msg = "*Word :* " +
                    result.word +
                    "\n\n*Meaning :*\n" +
                    result.definition +
                    "\n\n*Example:*\n" +
                    result.example +
                    "\n〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️〰️\n👍" +
                    result.thumbs_up +
                    "  👎" +
                    result.thumbs_down;
                yield client.deleteMessage(BotsApp.chatId, {
                    id: processing.key.id,
                    remoteJid: BotsApp.chatId,
                    fromMe: true,
                });
                yield client.sendMessage(BotsApp.chatId, msg, message_type_1.MessageType.text).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
            }
            catch (err) {
                yield input_sanitization_1.default.handleError(err, client, BotsApp, (0, string_format_1.default)(db_1.default.ud.NOT_FOUND, text));
                return yield client.deleteMessage(BotsApp.chatId, {
                    id: processing.key.id,
                    remoteJid: BotsApp.chatId,
                    fromMe: true,
                });
            }
            return;
        });
    },
};
