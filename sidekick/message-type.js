"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageType = void 0;
/** Set of message types that are supported by the library */
var MessageType;
(function (MessageType) {
    MessageType["text"] = "conversation";
    MessageType["extendedText"] = "extendedTextMessage";
    MessageType["contact"] = "contactMessage";
    MessageType["contactsArray"] = "contactsArrayMessage";
    MessageType["groupInviteMessage"] = "groupInviteMessage";
    MessageType["listMessage"] = "listMessage";
    MessageType["buttonsMessage"] = "buttonsMessage";
    MessageType["location"] = "locationMessage";
    MessageType["liveLocation"] = "liveLocationMessage";
    MessageType["image"] = "imageMessage";
    MessageType["video"] = "videoMessage";
    MessageType["sticker"] = "stickerMessage";
    MessageType["document"] = "documentMessage";
    MessageType["audio"] = "audioMessage";
    MessageType["product"] = "productMessage";
})(MessageType = exports.MessageType || (exports.MessageType = {}));
