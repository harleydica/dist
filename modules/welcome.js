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
const greeting_1 = __importDefault(require("../database/greeting"));
const input_sanitization_1 = __importDefault(require("../sidekick/input-sanitization"));
const db_1 = __importDefault(require("../lib/db"));
const message_type_1 = require("../sidekick/message-type");
const WELCOME = db_1.default.welcome;
module.exports = {
    name: "welcome",
    description: WELCOME.DESCRIPTION,
    extendedDescription: WELCOME.EXTENDED_DESCRIPTION,
    demo: {
        isEnabled: true,
        text: [".welcome", ".welcome off", ".welcome delete"],
    },
    handle(client, chat, BotsApp, args) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!BotsApp.isGroup) {
                    client.sendMessage(BotsApp.chatId, WELCOME.NOT_A_GROUP, message_type_1.MessageType.text).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                    return;
                }
                yield client.getGroupMetaData(BotsApp.chatId, BotsApp);
                var Msg = yield greeting_1.default.getMessage(BotsApp.chatId, "welcome");
                if (args.length == 0) {
                    var enabled = yield greeting_1.default.checkSettings(BotsApp.chatId, "welcome");
                    try {
                        if (enabled === false || enabled === undefined) {
                            client.sendMessage(BotsApp.chatId, WELCOME.SET_WELCOME_FIRST, message_type_1.MessageType.text).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                            return;
                        }
                        else if (enabled === "OFF") {
                            yield client.sendMessage(BotsApp.chatId, WELCOME.CURRENTLY_DISABLED, message_type_1.MessageType.text).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                            yield client.sendMessage(BotsApp.chatId, Msg.message, message_type_1.MessageType.text).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                            return;
                        }
                        yield client.sendMessage(BotsApp.chatId, WELCOME.CURRENTLY_ENABLED, message_type_1.MessageType.text).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                        yield client.sendMessage(BotsApp.chatId, Msg.message, message_type_1.MessageType.text).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
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
                            client.sendMessage(BotsApp.chatId, WELCOME.GREETINGS_UNENABLED, message_type_1.MessageType.text).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                            return;
                        }
                        if (args[0] === "ON" ||
                            args[0] === "on" ||
                            args[0] === "On") {
                            let switched = "ON";
                            yield greeting_1.default.changeSettings(BotsApp.chatId, switched);
                            client.sendMessage(BotsApp.chatId, WELCOME.GREETINGS_ENABLED, message_type_1.MessageType.text).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                            return;
                        }
                        if (args[0] === "delete") {
                            var Msg = yield greeting_1.default.deleteMessage(BotsApp.chatId, "welcome");
                            if (Msg === false || Msg === undefined) {
                                client.sendMessage(BotsApp.chatId, WELCOME.SET_WELCOME_FIRST, message_type_1.MessageType.text).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                                return;
                            }
                            yield client.sendMessage(BotsApp.chatId, WELCOME.WELCOME_DELETED, message_type_1.MessageType.text).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                            return;
                        }
                        let text = BotsApp.body.replace(BotsApp.body[0] + BotsApp.commandName + " ", "");
                        if (Msg === false || Msg === undefined) {
                            yield greeting_1.default.setWelcome(BotsApp.chatId, text);
                            yield client.sendMessage(BotsApp.chatId, WELCOME.WELCOME_UPDATED, message_type_1.MessageType.text).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                            return;
                        }
                        else {
                            yield greeting_1.default.deleteMessage(BotsApp.chatId, "welcome");
                            yield greeting_1.default.setWelcome(BotsApp.chatId, text);
                            yield client.sendMessage(BotsApp.chatId, WELCOME.WELCOME_UPDATED, message_type_1.MessageType.text).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                            return;
                        }
                    }
                    catch (err) {
                        throw err;
                    }
                }
            }
            catch (err) {
                input_sanitization_1.default.handleError(err, client, BotsApp);
                return;
            }
        });
    },
};
