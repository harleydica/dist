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
const db_1 = __importDefault(require("../lib/db"));
const input_sanitization_1 = __importDefault(require("../sidekick/input-sanitization"));
const google_dictionary_api_1 = __importDefault(require("google-dictionary-api"));
const string_format_1 = __importDefault(require("string-format"));
const message_type_1 = require("../sidekick/message-type");
const MEANING = db_1.default.meaning;
module.exports = {
    name: "meaning",
    description: MEANING.DESCRIPTION,
    extendedDescription: MEANING.EXTENDED_DESCRIPTION,
    demo: { isEnabled: true, text: ".meaning meaning" },
    handle(client, chat, BotsApp, args) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var word = "";
                if (BotsApp.isTextReply) {
                    word = BotsApp.replyMessage;
                }
                else if (args.length === 0) {
                    client.sendMessage(BotsApp.chatId, MEANING.NO_ARG, message_type_1.MessageType.text);
                    return;
                }
                else {
                    word = args.join(" ");
                }
                google_dictionary_api_1.default
                    .search(word)
                    .then((results) => {
                    let mean = "";
                    for (let key in results[0].meaning) {
                        mean += "\n\n";
                        mean += "*[" + key + "]* : ";
                        mean += results[0].meaning[key][0].definition;
                    }
                    const msg = "*Word :* " + results[0].word + "\n\n*Meaning :*" + mean;
                    client
                        .sendMessage(BotsApp.chatId, msg, message_type_1.MessageType.text)
                        .catch((err) => input_sanitization_1.default.handleError(err, client, BotsApp));
                })
                    .catch(() => {
                    client
                        .sendMessage(BotsApp.chatId, (0, string_format_1.default)(MEANING.NOT_FOUND, word), message_type_1.MessageType.text)
                        .catch((err) => input_sanitization_1.default.handleError(err, client, BotsApp));
                });
            }
            catch (err) {
                yield input_sanitization_1.default.handleError(err, client, BotsApp);
            }
        });
    },
};
