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
const string_format_1 = __importDefault(require("string-format"));
const input_sanitization_1 = __importDefault(require("../sidekick/input-sanitization"));
const config_1 = __importDefault(require("../config"));
const message_type_1 = require("../sidekick/message-type");
const HELP = db_1.default.help;
module.exports = {
    name: "help",
    description: HELP.DESCRIPTION,
    extendedDescription: HELP.EXTENDED_DESCRIPTION,
    demo: { isEnabled: false },
    handle(client, chat, BotsApp, args, commandHandler) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var prefixRegex = new RegExp(config_1.default.PREFIX, "g");
                var prefixes = /\/\^\[(.*)+\]\/\g/g.exec(prefixRegex)[1];
                let helpMessage;
                if (!args[0]) {
                    helpMessage = HELP.HEAD;
                    commandHandler.forEach(element => {
                        helpMessage += (0, string_format_1.default)(HELP.TEMPLATE, prefixes[0] + element.name, element.description);
		    })
		    helpMessage += HELP.BOTTOM;
		    ;
                    client.sendMessage(BotsApp.chatId, helpMessage, message_type_1.MessageType.text).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                    return;
                }
                helpMessage = HELP.COMMAND_INTERFACE;
                var command = commandHandler.get(args[0]);
                if (command) {
                    var triggers = " | ";
                    prefixes.split("").forEach(prefix => {
                        triggers += prefix + command.name + " | ";
                    });
                    if (command.demo?.isEnabled) {
                        var buttons = [];
                        helpMessage += (0, string_format_1.default)(HELP.COMMAND_INTERFACE_TEMPLATE, triggers, command.extendedDescription) + HELP.FOOTER;
                        if (command.demo.text instanceof Array) {
                            for (var i in command.demo.text) {
                                var button = {
                                    buttonId: 'id' + i,
                                    buttonText: { displayText: command.demo.text[i] },
                                    type: 1
                                };
                                buttons.push(button);
                            }
                        }
                        else {
                            buttons.push({ buttonId: 'id1', buttonText: { displayText: command.demo.text }, type: 1 });
                        }
                        const buttonMessage = {
                            text: helpMessage,
                            buttons: buttons,
                            headerType: 1
                        };
                        yield client.sendMessage(BotsApp.chatId, buttonMessage, message_type_1.MessageType.buttonsMessage).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                        return;
                    }
                    helpMessage += (0, string_format_1.default)(HELP.COMMAND_INTERFACE_TEMPLATE, triggers, command.extendedDescription);
                    client.sendMessage(BotsApp.chatId, helpMessage, message_type_1.MessageType.text).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                    return;
                }
                client.sendMessage(BotsApp.chatId, HELP.COMMAND_INTERFACE + "```Invalid Command. Check the correct name from```  *.help*  ```command list.```", message_type_1.MessageType.text).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
            }
            catch (err) {
                yield input_sanitization_1.default.handleError(err, client, BotsApp);
            }
        });
    },
};
