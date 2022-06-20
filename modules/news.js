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
const message_type_1 = require("../sidekick/message-type");
const input_sanitization_1 = __importDefault(require("../sidekick/input-sanitization"));
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("../config"));
const NEWS = db_js_1.default.news;
module.exports = {
    name: "news",
    description: NEWS.DESCRIPTION,
    extendedDescription: NEWS.EXTENDED_DESCRIPTION,
    demo: {
        isEnabled: true,
        text: [
            ".news search The Times",
            ".news fetch The Hindu"
        ]
    },
    handle(client, chat, BotsApp, args) {
        return __awaiter(this, void 0, void 0, function* () {
            /*******************************************
             *
             *
             * Functions
             *
             *
             ********************************************/
            const checkPub = (newsList, requestedPub) => __awaiter(this, void 0, void 0, function* () {
                for (let i = 0; i < newsList.length; i++) {
                    if (newsList[i].toUpperCase == requestedPub.toUpperCase) {
                        return newsList[i];
                    }
                    return;
                }
            });
            /*******************************************
             *
             *
             * Actions
             *
             *
             ********************************************/
            if (args.length === 0) {
                yield client
                    .sendMessage(BotsApp.chatId, NEWS.NO_COMMMAND, message_type_1.MessageType.text)
                    .catch((err) => input_sanitization_1.default.handleError(err, client, BotsApp));
                return;
            }
            if (args[0] == "help") {
                yield client
                    .sendMessage(BotsApp.chatId, NEWS.EXTENDED_DESCRIPTION, message_type_1.MessageType.text)
                    .catch((err) => input_sanitization_1.default.handleError(err, client, BotsApp));
                return;
            }
            if (args[0] == "search") {
                args.shift();
                var searchTerm = args.join(" ");
                let searchResponse;
                try {
                    yield axios_1.default.get(config_1.default.NEWS_API_URL + "news-list?searchTerm=" + searchTerm)
                        .then((res) => {
                        searchResponse = res.data;
                    })
                        .catch((error) => {
                        console.error(error);
                    });
                }
                catch (error) {
                    throw error;
                }
                for (let i = 0; i < searchResponse.length; i++) {
                    searchResponse[i] = `${i + 1}` + ".)  " + `${searchResponse[i]}`;
                }
                let message = "```The following publications are available with the term ``` *" + searchTerm + "* ``` in it:``` \n\n" + searchResponse.join("\n\n");
                if (searchResponse.length < 1) {
                    message = "```Sorry, no publication found by that name!```";
                }
                yield client
                    .sendMessage(BotsApp.chatId, message, message_type_1.MessageType.text)
                    .catch((err) => input_sanitization_1.default.handleError(err, client, BotsApp));
                return;
            }
            if (args[0] == "fetch") {
                args.shift();
                var searchTerm = args.join(" ");
                if (!searchTerm) {
                    yield client
                        .sendMessage(BotsApp.chatId, NEWS.NO_PUB_NAME, message_type_1.MessageType.text)
                        .catch((err) => input_sanitization_1.default.handleError(err, client, BotsApp));
                    return;
                }
                let searchResponse;
                try {
                    yield axios_1.default.get(config_1.default.NEWS_API_URL + "news-list?searchTerm=" + searchTerm)
                        .then((res) => {
                        searchResponse = res.data;
                    })
                        .catch((error) => {
                        console.error(error);
                    });
                }
                catch (error) {
                    throw error;
                }
                let foundPub = yield checkPub(searchResponse, searchTerm);
                let message = "```Your requested publication``` *" +
                    foundPub +
                    "* ```is being fetched by BotsApp, this may take some time, please be patient!```";
                if (!foundPub) {
                    message = "```Sorry, no publication found by that name!```";
                    yield client
                        .sendMessage(BotsApp.chatId, message, message_type_1.MessageType.text)
                        .catch((err) => input_sanitization_1.default.handleError(err, client, BotsApp));
                    return;
                }
                yield client
                    .sendMessage(BotsApp.chatId, {
                    url: config_1.default.NEWS_API_URL + "news?pubName=" + foundPub + "&format=epub",
                }, message_type_1.MessageType.document, {
                    mimetype: "application/epub",
                    filename: foundPub + ".epub",
                    caption: message,
                })
                    .catch((err) => input_sanitization_1.default.handleError(err, client, BotsApp));
                message = "```Your requested publication fetched by BotsApp``` ☝️";
                yield client
                    .sendMessage(BotsApp.chatId, message, message_type_1.MessageType.text)
                    .catch((err) => input_sanitization_1.default.handleError(err, client, BotsApp));
                return;
            }
        });
    },
};
