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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sudoCommands = exports.adminCommands = void 0;
const config_1 = __importDefault(require("../config"));
const fs_1 = __importDefault(require("fs"));
const chalk_1 = __importDefault(require("chalk"));
const jsdom_1 = require("jsdom");
const db_1 = __importDefault(require("../lib/db"));
const string_format_1 = __importDefault(require("string-format"));
const promises_1 = require("fs/promises");
const message_type_1 = require("../sidekick/message-type");
const { window } = new jsdom_1.JSDOM();
const ERROR_TEMPLATE = db_1.default.general.ERROR_TEMPLATE;
const getCleanedContact = (args, client, BotsApp) => __awaiter(void 0, void 0, void 0, function* () {
    var jidNumber = '';
    var countryCode = config_1.default.COUNTRY_CODE;
    if (parseInt(args[0]) === NaN || args[0][0] === "+" || args[0][0] === "@") {
        if (args[0][0] === "@" || args[0][0] === "+") {
            jidNumber = args[0].substring(1, args[0].length + 1);
        }
        else {
            client.sendMessage(BotsApp.chatId, "*Enter valid contact number.* Approved Syntax:\n```1. XXXXXXXXXX``` \n```2. Tag the person``` \n```3. +(YYY)XXXXXXXXXX.``` \n_(YY- Country Code, without zeros)_", message_type_1.MessageType.text);
            return undefined;
        }
    }
    else {
        jidNumber = args[0];
    }
    if (jidNumber.length < 8 || jidNumber.length > 13) {
        client.sendMessage(BotsApp.chatId, "*Enter valid contact number.* Approved Syntax:\n```1. XXXXXXXXXX``` \n```2. Tag the person``` \n```3. +(YYY)XXXXXXXXXX.``` \n_(YY- Country Code, without zeros)_", message_type_1.MessageType.text);
        return undefined;
    }
    else if (jidNumber.length === 10) {
        jidNumber = countryCode + jidNumber;
    }
    console.log(jidNumber);
    var isOnWhatsApp = yield client.sock.onWhatsApp(jidNumber);
    if (isOnWhatsApp === undefined) {
        throw "NumberInvalid";
    }
    // isOnWhatsApp is not working
    return jidNumber;
});
const deleteFiles = (...locations) => __awaiter(void 0, void 0, void 0, function* () {
    for (let location of locations) {
        fs_1.default.unlink(location, (err) => {
            if (err)
                console.log(err);
            else {
                // console.log("\nDeleted file at: " + location);
            }
        });
    }
});
// const performanceTime = async (startTime) => {
//     var endTime = window.performance.now();
//     console.log(
//         `-----------\nExecution time: ${
//             (endTime - startTime) / 1000
//         } seconds\n----------`
//     );
// }
const isMember = (chatId, groupMembers) => __awaiter(void 0, void 0, void 0, function* () {
    var isMember = false;
    if (!(chatId === undefined)) {
        for (const index in groupMembers) {
            if (chatId == groupMembers[index].id.split("@")[0]) {
                isMember = true;
            }
        }
    }
    return isMember;
});
const handleError = (err, client, BotsApp, customMessage = "```Something went wrong. The error has been logged in log chats```") => __awaiter(void 0, void 0, void 0, function* () {
    console.log(chalk_1.default.redBright.bold("[ERROR] " + err));
    let data = {
        commandName: BotsApp.commandName,
        fromMe: BotsApp.fromMe,
        isReply: BotsApp.isReply,
        isGroup: BotsApp.isGroup,
        isPm: BotsApp.isPm,
        isImage: BotsApp.isImage,
        isBotGroupAdmin: BotsApp.isBotGroupAdmin,
        isSenderGroupAdmin: BotsApp.isSenderGroupAdmin,
        isSenderSudo: BotsApp.isSenderSUDO,
        err: err
    };
    client.sendMessage(BotsApp.chatId, customMessage, message_type_1.MessageType.text);
    client.sendMessage(BotsApp.logGroup, format(ERROR_TEMPLATE, data), MessageType.text);
});
const saveBuffer = (fileName, stream) => { var stream_1, stream_1_1; return __awaiter(void 0, void 0, void 0, function* () {
    var e_1, _a;
    let buffer = Buffer.from([]);
    try {
        for (stream_1 = __asyncValues(stream); stream_1_1 = yield stream_1.next(), !stream_1_1.done;) {
            const chunk = stream_1_1.value;
            buffer = Buffer.concat([buffer, chunk]);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (stream_1_1 && !stream_1_1.done && (_a = stream_1.return)) yield _a.call(stream_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    yield (0, promises_1.writeFile)(fileName, buffer);
}); };
const inputSanitization = {
    handleError: handleError,
    deleteFiles: deleteFiles,
    saveBuffer: saveBuffer,
    getCleanedContact: getCleanedContact,
    isMember: isMember
};
exports.default = inputSanitization;
exports.adminCommands = [
    "add",
    "demote",
    "invite",
    "mute",
    "promote",
    "remove",
    "unmute",
    "welcome",
    "disappear",
    "goodbye",
    "setdp",
    "tagall",
    "abl",
    "rbl"
];
exports.sudoCommands = ["block", "unblock"];
