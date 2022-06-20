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
Object.defineProperty(exports, "__esModule", { value: true });
const db_js_1 = __importDefault(require("../lib/db.js"));
const Carbon = __importStar(require("unofficial-carbon-now"));
const input_sanitization_1 = __importDefault(require("../sidekick/input-sanitization"));
const string_format_1 = __importDefault(require("string-format"));
const message_type_1 = require("../sidekick/message-type");
const CARBON = db_js_1.default.carbon;
module.exports = {
    name: "carbon",
    description: CARBON.DESCRIPTION,
    extendedDescription: CARBON.EXTENDED_DESCRIPTION,
    demo: {
        isEnabled: true,
        text: [
            ".carbon Hi! Welcome to BotsApp.",
            '.carbon #include <iostream> \nint main() \n{\n   std::cout << "Hello BotsApp!"; \n   return 0;\n} -t yeti',
            ".carbon -t",
        ],
    },
    handle(client, chat, BotsApp, args) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let themes = [
                    "3024 night",
                    "a11y dark",
                    "blackboard",
                    "base 16 (dark)",
                    "base 16 (light)",
                    "cobalt",
                    "duotone",
                    "hopscotch",
                    "lucario",
                    "material",
                    "monokai",
                    "night owl",
                    "nord",
                    "oceanic next",
                    "one light",
                    "one dark",
                    "panda",
                    "paraiso",
                    "seti",
                    "shades of purple",
                    "solarized (dark)",
                    "solarized (light)",
                    "synthwave '84",
                    "twilight",
                    "verminal",
                    "vscode",
                    "yeti",
                    "zenburn",
                ];
                let code = "";
                let themeInput;
                if (args[0] == null && !BotsApp.isTextReply) {
                    yield client.sendMessage(BotsApp.chatId, CARBON.NO_INPUT, message_type_1.MessageType.text).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                    return;
                }
                else if (BotsApp.isTextReply && !BotsApp.replyMessage) {
                    yield client.sendMessage(BotsApp.chatId, CARBON.INVALID_REPLY, message_type_1.MessageType.text).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                    return;
                }
                else if (BotsApp.isTextReply) {
                    code = BotsApp.replyMessage;
                    themeInput = themes[Math.floor(Math.random() * themes.length)];
                }
                else {
                    try {
                        let text = BotsApp.body.replace(BotsApp.body[0] + BotsApp.commandName + " ", "");
                        if (text[0] === "-" && text[1] === "t") {
                            if (text[2] == null) {
                                let counter = 1;
                                let message = 'Available themes: ';
                                themes.forEach((theme) => {
                                    message += `\n${counter}. ${theme}`;
                                    counter += 1;
                                });
                                yield client.sendMessage(BotsApp.chatId, "```" + message + "```", message_type_1.MessageType.text);
                                return;
                            }
                            else {
                                yield client.sendMessage(BotsApp.chatId, CARBON.NO_INPUT, message_type_1.MessageType.text).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                                return;
                            }
                        }
                        let body = BotsApp.body.split("-t");
                        code = body[0].replace(BotsApp.body[0] + BotsApp.commandName + " ", "");
                        themeInput = body[1].substring(1);
                        if (!themes.includes(themeInput)) {
                            yield client.sendMessage(BotsApp.chatId, CARBON.INVALID_THEME, message_type_1.MessageType.text).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                            return;
                        }
                    }
                    catch (err) {
                        if (err instanceof TypeError) {
                            code = BotsApp.body.replace(BotsApp.body[0] + BotsApp.commandName + " ", "");
                            themeInput =
                                themes[Math.floor(Math.random() * themes.length)];
                        }
                    }
                }
                try {
                    const processing = yield client.sendMessage(BotsApp.chatId, CARBON.CARBONIZING, message_type_1.MessageType.text);
                    const carbon = new Carbon.createCarbon()
                        .setCode(code)
                        .setPrettify(true)
                        .setTheme(themeInput);
                    const output = yield Carbon.generateCarbon(carbon);
                    yield client.sendMessage(BotsApp.chatId, output, message_type_1.MessageType.image, {
                        caption: (0, string_format_1.default)(CARBON.OUTPUT, themeInput),
                    }).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                    return yield client.deleteMessage(BotsApp.chatId, {
                        id: processing.key.id,
                        remoteJid: BotsApp.chatId,
                        fromMe: true,
                    });
                }
                catch (err) {
                    throw err;
                }
            }
            catch (err) {
                yield input_sanitization_1.default.handleError(err, client, BotsApp);
            }
        });
    },
};
