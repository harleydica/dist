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
const greeting_1 = __importDefault(require("../database/greeting"));
const message_type_1 = require("../sidekick/message-type");
const GOODBYE = db_1.default.goodbye;
module.exports = {
    name: "goodbye",
    description: GOODBYE.DESCRIPTION,
    extendedDescription: GOODBYE.EXTENDED_DESCRIPTION,
    demo: {
        isEnabled: true,
        text: [".goodbye", ".goodbye off", ".goodbye delete"],
    },
    handle(client, chat, BotsApp, args) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!BotsApp.isGroup) {
                    client.sendMessage(BotsApp.chatId, GOODBYE.NOT_A_GROUP, message_type_1.MessageType.text);
                    return;
                }
                if (args.length == 0) {
                    yield client.getGroupMetaData(BotsApp.chatId, BotsApp);
                    var Msg = yield greeting_1.default.getMessage(BotsApp.chatId, "goodbye");
                    try {
                        var enabled = yield greeting_1.default.checkSettings(BotsApp.chatId, "goodbye");
                        if (enabled === false || enabled === undefined) {
                            client.sendMessage(BotsApp.chatId, GOODBYE.SET_GOODBYE_FIRST, message_type_1.MessageType.text);
                            return;
                        }
                        else if (enabled === "OFF") {
                            yield client.sendMessage(BotsApp.chatId, GOODBYE.CURRENTLY_DISABLED, message_type_1.MessageType.text);
                            yield client.sendMessage(BotsApp.chatId, Msg.message, message_type_1.MessageType.text);
                            return;
                        }
                        yield client.sendMessage(BotsApp.chatId, GOODBYE.CURRENTLY_ENABLED, message_type_1.MessageType.text);
                        yield client.sendMessage(BotsApp.chatId, Msg.message, message_type_1.MessageType.text);
                    }
                    catch (err) {
                        throw err;
                    }
                }
                else {
                    try {
                        if (args[0] === "OFF" ||
                            args[0] === "off" ||
                            args[0] === "Off") {
                            let switched = "OFF";
                            yield greeting_1.default.changeSettings(BotsApp.chatId, switched);
                            client.sendMessage(BotsApp.chatId, GOODBYE.GREETINGS_UNENABLED, message_type_1.MessageType.text);
                            return;
                        }
                        if (args[0] === "ON" ||
                            args[0] === "on" ||
                            args[0] === "On") {
                            let switched = "ON";
                            yield greeting_1.default.changeSettings(BotsApp.chatId, switched);
                            client.sendMessage(BotsApp.chatId, GOODBYE.GREETINGS_ENABLED, message_type_1.MessageType.text);
                            return;
                        }
                        if (args[0] === "delete") {
                            var Msg = yield greeting_1.default.deleteMessage(BotsApp.chatId, "goodbye");
                            if (Msg === false || Msg === undefined) {
                                client.sendMessage(BotsApp.chatId, GOODBYE.SET_GOODBYE_FIRST, message_type_1.MessageType.text);
                                return;
                            }
                            yield client.sendMessage(BotsApp.chatId, GOODBYE.GOODBYE_DELETED, message_type_1.MessageType.text);
                            return;
                        }
                        let text = BotsApp.body.replace(BotsApp.body[0] + BotsApp.commandName + " ", "");
                        var Msg = yield greeting_1.default.getMessage(BotsApp.chatId, "goodbye");
                        if (Msg === false || Msg === undefined) {
                            yield greeting_1.default.setGoodbye(BotsApp.chatId, text);
                            yield client.sendMessage(BotsApp.chatId, GOODBYE.GOODBYE_UPDATED, message_type_1.MessageType.text);
                            return;
                        }
                        else {
                            yield greeting_1.default.deleteMessage(BotsApp.chatId, "goodbye");
                            yield greeting_1.default.setGoodbye(BotsApp.chatId, text);
                            yield client.sendMessage(BotsApp.chatId, GOODBYE.GOODBYE_UPDATED, message_type_1.MessageType.text);
                            return;
                        }
                    }
                    catch (err) {
                        throw err;
                    }
                }
            }
            catch (err) {
                yield input_sanitization_1.default.handleError(err, client, BotsApp);
            }
        });
    },
};
