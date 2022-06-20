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
const chalk_1 = __importDefault(require("chalk"));
const config_1 = __importDefault(require("../config"));
const input_sanitization_1 = require("../sidekick/input-sanitization");
const db_1 = __importDefault(require("../lib/db"));
const user_1 = __importDefault(require("../database/user"));
const string_format_1 = __importDefault(require("string-format"));
const message_type_1 = require("../sidekick/message-type");
const GENERAL = db_1.default.general;
const clearance = (BotsApp, client, isBlacklist) => __awaiter(void 0, void 0, void 0, function* () {
    if (isBlacklist) {
        if (BotsApp.isGroup) {
            yield client.getGroupMetaData(BotsApp.chatId, BotsApp);
            if ((!BotsApp.fromMe && !BotsApp.isSenderSUDO && !BotsApp.isSenderGroupAdmin)) {
                return false;
            }
        }
        else if ((!BotsApp.fromMe && !BotsApp.isSenderSUDO)) {
            console.log(chalk_1.default.blueBright.bold(`[INFO] Blacklisted Chat or User.`));
            return false;
        }
    }
    else if ((BotsApp.chatId === "917838204238-1634977991@g.us" || BotsApp.chatId === "120363020858647962@g.us" || BotsApp.chatId === "120363023294554225@g.us")) {
        console.log(chalk_1.default.blueBright.bold(`[INFO] Bot disabled in Support Groups.`));
        return false;
    }
    if (BotsApp.isCmd && (!BotsApp.fromMe && !BotsApp.isSenderSUDO)) {
        if (config_1.default.WORK_TYPE.toLowerCase() === "public") {
            if (BotsApp.isGroup) {
                yield client.getGroupMetaData(BotsApp.chatId, BotsApp);
                if (input_sanitization_1.adminCommands.indexOf(BotsApp.commandName) >= 0 && !BotsApp.isSenderGroupAdmin) {
                    console.log(chalk_1.default.redBright.bold(`[INFO] admin commmand `), chalk_1.default.greenBright.bold(`${BotsApp.commandName}`), chalk_1.default.redBright.bold(`not executed in public Work Type.`));
                    yield client.sendMessage(BotsApp.chatId, GENERAL.ADMIN_PERMISSION, message_type_1.MessageType.text);
                    return false;
                }
                else if (input_sanitization_1.sudoCommands.indexOf(BotsApp.commandName) >= 0 && !BotsApp.isSenderSUDO) {
                    console.log(chalk_1.default.redBright.bold(`[INFO] sudo commmand `), chalk_1.default.greenBright.bold(`${BotsApp.commandName}`), chalk_1.default.redBright.bold(`not executed in public Work Type.`));
                    let messageSent = yield user_1.default.getUser(BotsApp.chatId);
                    if (messageSent) {
                        console.log(chalk_1.default.blueBright.bold("[INFO] Promo message had already been sent to " + BotsApp.chatId));
                        return false;
                    }
                    else {
                        yield client.sendMessage(BotsApp.chatId, (0, string_format_1.default)(GENERAL.SUDO_PERMISSION, { worktype: "public", groupName: BotsApp.groupName ? BotsApp.groupName : "private chat", commandName: BotsApp.commandName }), message_type_1.MessageType.text);
                        yield user_1.default.addUser(BotsApp.chatId);
                        return false;
                    }
                }
                else {
                    return true;
                }
            }
            else if (BotsApp.isPm) {
                return true;
            }
        }
        else if (config_1.default.WORK_TYPE.toLowerCase() != "public" && !BotsApp.isSenderSUDO) {
            console.log(chalk_1.default.redBright.bold(`[INFO] commmand `), chalk_1.default.greenBright.bold(`${BotsApp.commandName}`), chalk_1.default.redBright.bold(`not executed in private Work Type.`));
            //             let messageSent = await Users.getUser(BotsApp.chatId);
            //             if(messageSent){
            //                 console.log(chalk.blueBright.bold("[INFO] Promo message had already been sent to " + BotsApp.chatId))
            //                 return false;
            //             }
            //             else{
            //                 await client.sendMessage(
            //                     BotsApp.chatId,
            //                     GENERAL.SUDO_PERMISSION.format({ worktype: "private", groupName: BotsApp.groupName ? BotsApp.groupName : "private chat", commandName: BotsApp.commandName }),
            //                     MessageType.text,
            //                     {
            //                         contextInfo: {
            //                             stanzaId: BotsApp.chatId,
            //                             participant: BotsApp.sender,
            //                             quotedMessage: {
            //                                 conversation: BotsApp.body,
            //                             },
            //                         },
            //                     }
            //                 );
            //                 await Users.addUser(BotsApp.chatId)
            //                 return false;
            //             }
        }
    }
    else {
        return true;
    }
});
module.exports = clearance;
