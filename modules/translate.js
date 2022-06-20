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
const google_translate_api_1 = __importDefault(require("@vitalets/google-translate-api"));
const input_sanitization_1 = __importDefault(require("../sidekick/input-sanitization"));
const db_1 = __importDefault(require("../lib/db"));
const string_format_1 = __importDefault(require("string-format"));
const message_type_1 = require("../sidekick/message-type");
module.exports = {
    name: "tr",
    description: db_1.default.tr.DESCRIPTION,
    extendedDescription: db_1.default.tr.EXTENDED_DESCRIPTION,
    demo: {
        isEnabled: true,
        text: [
            ".tr やめてください",
            ".tr how are you | hindi",
            ".tr how are you | hi",
        ],
    },
    handle(client, chat, BotsApp, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const processing = yield client.sendMessage(BotsApp.chatId, db_1.default.tr.PROCESSING, message_type_1.MessageType.text);
            try {
                var text = "";
                var language = "";
                if (args.length == 0) {
                    yield client.sendMessage(BotsApp.chatId, db_1.default.tr.EXTENDED_DESCRIPTION, message_type_1.MessageType.text).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                    return yield client.deleteMessage(BotsApp.chatId, {
                        id: processing.key.id,
                        remoteJid: BotsApp.chatId,
                        fromMe: true,
                    });
                }
                if (!BotsApp.isTextReply) {
                    try {
                        var body = BotsApp.body.split("|");
                        text = body[0].replace(BotsApp.body[0] + BotsApp.commandName + " ", "");
                        var i = 0;
                        while (body[1].split(" ")[i] == "") {
                            i++;
                        }
                        language = body[1].split(" ")[i];
                    }
                    catch (err) {
                        if (err instanceof TypeError) {
                            text = BotsApp.body.replace(BotsApp.body[0] + BotsApp.commandName + " ", "");
                            language = "English";
                        }
                    }
                }
                else if (BotsApp.replyMessage) {
                    text = BotsApp.replyMessage;
                    language = args[0];
                }
                else {
                    yield client.sendMessage(BotsApp.chatId, db_1.default.tr.INVALID_REPLY, message_type_1.MessageType.text).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                    return yield client.deleteMessage(BotsApp.chatId, {
                        id: processing.key.id,
                        remoteJid: BotsApp.chatId,
                        fromMe: true,
                    });
                }
                if (text.length > 4000) {
                    yield client.sendMessage(BotsApp.chatId, (0, string_format_1.default)(db_1.default.tr.TOO_LONG, String(text.length)), message_type_1.MessageType.text).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                    return yield client.deleteMessage(BotsApp.chatId, {
                        id: processing.key.id,
                        remoteJid: BotsApp.chatId,
                        fromMe: true,
                    });
                }
                yield (0, google_translate_api_1.default)(text, {
                    to: language,
                })
                    .then((res) => {
                    client.sendMessage(BotsApp.chatId, (0, string_format_1.default)(db_1.default.tr.SUCCESS, res.from.language.iso, language, res.text), message_type_1.MessageType.text);
                })
                    .catch((err) => {
                    input_sanitization_1.default.handleError(err, client, BotsApp, db_1.default.tr.LANGUAGE_NOT_SUPPORTED);
                });
                return yield client.deleteMessage(BotsApp.chatId, {
                    id: processing.key.id,
                    remoteJid: BotsApp.chatId,
                    fromMe: true,
                });
            }
            catch (err) {
                input_sanitization_1.default.handleError(err, client, BotsApp);
            }
        });
    },
};
