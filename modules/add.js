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
const db_js_1 = __importDefault(require("../lib/db.js"));
const input_sanitization_1 = __importDefault(require("../sidekick/input-sanitization"));
const config_1 = __importDefault(require("../config"));
const message_type_1 = require("../sidekick/message-type");
const string_format_1 = __importDefault(require("string-format"));
const ADD = db_js_1.default.add;
module.exports = {
    name: "add",
    description: ADD.DESCRIPTION,
    extendedDescription: ADD.EXTENDED_DESCRIPTION,
    demo: { isEnabled: false },
    handle(client, chat, BotsApp, args) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!BotsApp.isGroup) {
                    client.sendMessage(BotsApp.chatId, db_js_1.default.general.NOT_A_GROUP, message_type_1.MessageType.text).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                    return;
                }
                yield client.getGroupMetaData(BotsApp.chatId, BotsApp);
                if (!BotsApp.isBotGroupAdmin) {
                    client.sendMessage(BotsApp.chatId, db_js_1.default.general.BOT_NOT_ADMIN, message_type_1.MessageType.text).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                    return;
                }
                if (!args[0]) {
                    client.sendMessage(BotsApp.chatId, ADD.NO_ARG_ERROR, message_type_1.MessageType.text).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                    return;
                }
                let number;
                if (parseInt(args[0]) === NaN || args[0][0] === "+" || args[0].length < 10) {
                    client.sendMessage(BotsApp.chatId, ADD.NUMBER_SYNTAX_ERROR, message_type_1.MessageType.text).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                    return;
                }
                if (args[0].length == 10 && !(parseInt(args[0]) === NaN)) {
                    number = config_1.default.COUNTRY_CODE + args[0];
                }
                else {
                    number = args[0];
                }
                const [exists] = yield client.sock.onWhatsApp(number + "@s.whatsapp.net");
                if (!(exists)) {
                    client.sendMessage(BotsApp.chatId, (0, string_format_1.default)(ADD.NOT_ON_WHATSAPP, number), message_type_1.MessageType.text).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                    return;
                }
                const response = yield client.sock.groupParticipantsUpdate(BotsApp.chatId, [number + "@s.whatsapp.net"], 'add');
                // if (response[number + "@c.us"] == 408) {
                //     client.sendMessage(
                //         BotsApp.chatId,
                //         ADD.NO_24HR_BAN,
                //         MessageType.text
                //     ).catch(err => inputSanitization.handleError(err, client, BotsApp));
                //     return;
                // } else if (response[number + "@c.us"] == 403) {
                //     for (const index in response.participants) {
                //         if ((number + "@c.us") in response.participants[index]) {
                //             var code = response.participants[index][number + "@c.us"].invite_code;
                //             var tom = response.participants[index][number + "@c.us"].invite_code_exp;
                //         }
                //     }
                //     var invite = {
                //         caption: "```Hi! You have been invited to join this WhatsApp group by BotsApp!```\n\n🔗https://mybotsapp.com",
                //         groupJid: BotsApp.groupId,
                //         groupName: BotsApp.groupName,
                //         inviteCode: code,
                //         inviteExpiration: tom,
                //         jpegThumbnail: fs.readFileSync('./images/BotsApp_invite.jpeg')
                //     }
                //     await client.sendMessage(
                //         number + "@s.whatsapp.net",
                //         invite,
                //         MessageType.groupInviteMessage
                //     );
                //     client.sendMessage(
                //         BotsApp.chatId,
                //         ADD.PRIVACY,
                //         MessageType.text
                //     ).catch(err => inputSanitization.handleError(err, client, BotsApp));
                //     return;
                // } else if (response[number + "@c.us"] == 409) {
                //     client.sendMessage(
                //         BotsApp.chatId,
                //         ADD.ALREADY_MEMBER,
                //         MessageType.text
                //     ).catch(err => inputSanitization.handleError(err, client, BotsApp));
                //     return;
                // }
                client.sendMessage(BotsApp.chatId, "```" + number + ADD.SUCCESS + "```", message_type_1.MessageType.text);
            }
            catch (err) {
                if (err.status == 400) {
                    yield input_sanitization_1.default.handleError(err, client, BotsApp, ADD.NOT_ON_WHATSAPP).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                }
                yield input_sanitization_1.default.handleError(err, client, BotsApp);
            }
            return;
        });
    },
};
