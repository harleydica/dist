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
const input_sanitization_1 = __importDefault(require("../sidekick/input-sanitization"));
const db_1 = __importDefault(require("../lib/db"));
const got_1 = __importDefault(require("got"));
const message_type_1 = require("../sidekick/message-type");
module.exports = {
    name: "github",
    description: db_1.default.github.DESCRIPTION,
    extendedDescription: db_1.default.github.EXTENDED_DESCRIPTION,
    demo: { isEnabled: true, text: ".github Prince-Mendiratta" },
    handle(client, chat, BotsApp, args) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let user_name = "";
                if (BotsApp.isTextReply) {
                    user_name = BotsApp.replyMessage;
                }
                else {
                    if (args.length == 0) {
                        client.sendMessage(BotsApp.chatId, db_1.default.github.NO_ARG_ERROR, message_type_1.MessageType.text);
                        return;
                    }
                    user_name = args[0];
                }
                var fetching = yield client.sendMessage(BotsApp.chatId, db_1.default.github.FETCHING, message_type_1.MessageType.text);
                let userResponse = yield (0, got_1.default)("https://api.github.com/users/" + user_name);
                let user = JSON.parse(userResponse.body);
                Object.keys(user).forEach(function (key) {
                    if (user[key] === null || user[key] === "") {
                        user[key] = "N/A";
                    }
                });
                let caption = "*👤 Name :* " +
                    user.name +
                    "\n*💻 Link :* " +
                    user.html_url +
                    "\n*🔧 Type :* " +
                    user.type +
                    "\n*🏢 Company :* " +
                    user.company +
                    "\n*🔭 Blog :* " +
                    user.blog +
                    "\n*📍 Location :* " +
                    user.location +
                    "\n*📝 Bio :* " +
                    user.bio +
                    "\n*❤️ Followers :* " +
                    user.followers +
                    "\n*👁️ Following :* " +
                    user.following +
                    "\n*📊 Public Repos :* " +
                    user.public_repos +
                    "\n*📄 Public Gists :* " +
                    user.public_gists +
                    "\n*🔗 Profile Created :* " +
                    user.created_at +
                    "\n*✏️ Profile Updated :* " +
                    user.updated_at;
                if (user.public_repos > 0) {
                    let reposResponse = yield (0, got_1.default)(user.repos_url);
                    let reposData = JSON.parse(reposResponse.body);
                    let repos = reposData[0].name;
                    for (let i = 1; i < reposData.length && i < 5; i++) {
                        repos += " | " + reposData[i].name;
                    }
                    caption += "\n*🔍 Some Repos :* " + repos;
                }
                try {
                    yield client.sendMessage(BotsApp.chatId, {
                        url: user.avatar_url,
                    }, message_type_1.MessageType.image, {
                        caption: caption,
                    });
                }
                catch (err) {
                    client.sendMessage(BotsApp.chatId, caption, message_type_1.MessageType.text);
                }
                return yield client.deleteMessage(BotsApp.chatId, {
                    id: fetching.key.id,
                    remoteJid: BotsApp.chatId,
                    fromMe: true,
                });
            }
            catch (err) {
                yield input_sanitization_1.default.handleError(err, client, BotsApp, db_1.default.github.ERROR_MSG);
                return yield client.deleteMessage(BotsApp.chatId, {
                    id: fetching.key.id,
                    remoteJid: BotsApp.chatId,
                    fromMe: true,
                });
            }
        });
    },
};
