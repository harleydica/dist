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
const rbl = db_1.default.rbl;
module.exports = {
    name: "rbl",
    description: rbl.DESCRIPTION,
    extendedDescription: rbl.EXTENDED_DESCRIPTION,
    demo: { isEnabled: true, text: ".rbl" },
    handle(client, chat, BotsApp, args) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (BotsApp.isPm && BotsApp.fromMe) {
                    let PersonToRemoveFromBlacklist = BotsApp.chatId;
                    if (!(yield blacklist_1.default.getBlacklistUser(PersonToRemoveFromBlacklist, ""))) {
                        client.sendMessage(BotsApp.chatId, (0, string_format_1.default)(rbl.NOT_IN_BLACKLIST, PersonToRemoveFromBlacklist.substring(0, PersonToRemoveFromBlacklist.indexOf("@"))), message_type_1.MessageType.text);
                        return;
                    }
                    blacklist_1.default.removeBlacklistUser(PersonToRemoveFromBlacklist, "");
                    client.sendMessage(BotsApp.chatId, (0, string_format_1.default)(rbl.PM_ACKNOWLEDGEMENT, PersonToRemoveFromBlacklist.substring(0, PersonToRemoveFromBlacklist.indexOf("@"))), message_type_1.MessageType.text);
                    return;
                }
                else {
                    yield client.getGroupMetaData(BotsApp.chatId, BotsApp);
                    if (args.length > 0) {
                        let PersonToRemoveFromBlacklist = yield input_sanitization_1.default.getCleanedContact(args, client, BotsApp);
                        if (PersonToRemoveFromBlacklist === undefined)
                            return;
                        PersonToRemoveFromBlacklist += "@s.whatsapp.net";
                        if (!(yield blacklist_1.default.getBlacklistUser(PersonToRemoveFromBlacklist, BotsApp.chatId))) {
                            client.sendMessage(BotsApp.chatId, (0, string_format_1.default)(rbl.NOT_IN_BLACKLIST, PersonToRemoveFromBlacklist.substring(0, PersonToRemoveFromBlacklist.indexOf("@"))), message_type_1.MessageType.text);
                            return;
                        }
                        blacklist_1.default.removeBlacklistUser(PersonToRemoveFromBlacklist, BotsApp.chatId);
                        client.sendMessage(BotsApp.chatId, (0, string_format_1.default)(rbl.GRP_ACKNOWLEDGEMENT, PersonToRemoveFromBlacklist.substring(0, PersonToRemoveFromBlacklist.indexOf("@"))), message_type_1.MessageType.text);
                        return;
                    }
                    else if (BotsApp.isTextReply) {
                        let PersonToRemoveFromBlacklist = BotsApp.replyParticipant;
                        if (!(yield blacklist_1.default.getBlacklistUser(PersonToRemoveFromBlacklist, BotsApp.chatId))) {
                            client.sendMessage(BotsApp.chatId, (0, string_format_1.default)(rbl.NOT_IN_BLACKLIST, PersonToRemoveFromBlacklist.substring(0, PersonToRemoveFromBlacklist.indexOf("@"))), message_type_1.MessageType.text);
                            return;
                        }
                        blacklist_1.default.removeBlacklistUser(PersonToRemoveFromBlacklist, BotsApp.chatId);
                        client.sendMessage(BotsApp.chatId, (0, string_format_1.default)(rbl.GRP_ACKNOWLEDGEMENT, PersonToRemoveFromBlacklist.substring(0, PersonToRemoveFromBlacklist.indexOf("@"))), message_type_1.MessageType.text);
                        return;
                    }
                    else {
                        if (!(yield blacklist_1.default.getBlacklistUser("", BotsApp.chatId))) {
                            client.sendMessage(BotsApp.chatId, (0, string_format_1.default)(rbl.NOT_IN_BLACKLIST, BotsApp.groupName), message_type_1.MessageType.text);
                            return;
                        }
                        blacklist_1.default.removeBlacklistUser("", BotsApp.chatId);
                        client.sendMessage(BotsApp.chatId, (0, string_format_1.default)(rbl.GRP_BAN, BotsApp.groupName), message_type_1.MessageType.text);
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
