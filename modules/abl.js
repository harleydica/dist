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
const blacklist_1 = __importDefault(require("../database/blacklist"));
const message_type_1 = require("../sidekick/message-type");
const abl = db_1.default.abl;
module.exports = {
    name: "abl",
    description: abl.DESCRIPTION,
    extendedDescription: abl.EXTENDED_DESCRIPTION,
    demo: { isEnabled: true, text: ".abl" },
    handle(client, chat, BotsApp, args) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (BotsApp.isPm && BotsApp.fromMe) {
                    let PersonToBlacklist = BotsApp.chatId;
                    blacklist_1.default.addBlacklistUser(PersonToBlacklist, "");
                    client.sendMessage(BotsApp.chatId, (0, string_format_1.default)(abl.PM_ACKNOWLEDGEMENT, PersonToBlacklist.substring(0, PersonToBlacklist.indexOf("@"))), message_type_1.MessageType.text);
                    return;
                }
                else {
                    yield client.getGroupMetaData(BotsApp.chatId, BotsApp);
                    if (args.length > 0) {
                        let PersonToBlacklist = yield input_sanitization_1.default.getCleanedContact(args, client, BotsApp);
                        if (PersonToBlacklist === undefined)
                            return;
                        PersonToBlacklist += "@s.whatsapp.net";
                        if (BotsApp.owner === PersonToBlacklist) {
                            client.sendMessage(BotsApp.chatId, abl.CAN_NOT_BLACKLIST_BOT, message_type_1.MessageType.text);
                            return;
                        }
                        blacklist_1.default.addBlacklistUser(PersonToBlacklist, BotsApp.chatId);
                        client.sendMessage(BotsApp.chatId, (0, string_format_1.default)(abl.GRP_ACKNOWLEDGEMENT, PersonToBlacklist.substring(0, PersonToBlacklist.indexOf("@"))), message_type_1.MessageType.text);
                        return;
                    }
                    else if (BotsApp.isTextReply) {
                        let PersonToBlacklist = BotsApp.replyParticipant;
                        if (BotsApp.owner === PersonToBlacklist) {
                            client.sendMessage(BotsApp.chatId, abl.CAN_NOT_BLACKLIST_BOT, message_type_1.MessageType.text);
                            return;
                        }
                        blacklist_1.default.addBlacklistUser(PersonToBlacklist, BotsApp.chatId);
                        client.sendMessage(BotsApp.chatId, (0, string_format_1.default)(abl.GRP_ACKNOWLEDGEMENT, PersonToBlacklist.substring(0, PersonToBlacklist.indexOf("@"))), message_type_1.MessageType.text);
                        return;
                    }
                    else {
                        blacklist_1.default.addBlacklistUser("", BotsApp.chatId);
                        client.sendMessage(BotsApp.chatId, (0, string_format_1.default)(abl.GRP_BAN, BotsApp.groupName), message_type_1.MessageType.text);
                        return;
                    }
                }
            }
            catch (err) {
                yield input_sanitization_1.default.handleError(err, client, BotsApp);
            }
        });
    },
};
