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
const config_1 = __importDefault(require("../config"));
const chalk_1 = __importDefault(require("chalk"));
const sidekick_1 = __importDefault(require("../sidekick/sidekick"));
const resolve = function (messageInstance, client) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26;
    return __awaiter(this, void 0, void 0, function* () {
        var BotsApp = new sidekick_1.default();
        var prefix = config_1.default.PREFIX + '\\w+';
        var prefixRegex = new RegExp(prefix, 'g');
        var SUDOstring = config_1.default.SUDO;
        try {
            var jsonMessage = JSON.stringify(messageInstance);
        }
        catch (err) {
            console.log(chalk_1.default.redBright("[ERROR] Something went wrong. ", err));
        }
        BotsApp.chatId = messageInstance.key.remoteJid;
        BotsApp.fromMe = messageInstance.key.fromMe;
        BotsApp.owner = client.user.id.replace(/:.*@/g, '@');
        BotsApp.mimeType = messageInstance.message ? (Object.keys(messageInstance.message)[0] === 'senderKeyDistributionMessage' ? Object.keys(messageInstance.message)[2] : Object.keys(messageInstance.message)[0]) : null;
        BotsApp.type = BotsApp.mimeType === 'imageMessage' ? 'image' : (BotsApp.mimeType === 'videoMessage') ? 'video' : (BotsApp.mimeType === 'conversation' || BotsApp.mimeType == 'extendedTextMessage') ? 'text' : (BotsApp.mimeType === 'audioMessage') ? 'audio' : (BotsApp.mimeType === 'stickerMessage') ? 'sticker' : (BotsApp.mimeType === 'senderKeyDistributionMessage' && ((_b = (_a = messageInstance.message) === null || _a === void 0 ? void 0 : _a.senderKeyDistributionMessage) === null || _b === void 0 ? void 0 : _b.groupId) === 'status@broadcast') ? 'status' : null;
        BotsApp.isTextReply = (BotsApp.mimeType === 'extendedTextMessage' && ((_e = (_d = (_c = messageInstance.message) === null || _c === void 0 ? void 0 : _c.extendedTextMessage) === null || _d === void 0 ? void 0 : _d.contextInfo) === null || _e === void 0 ? void 0 : _e.stanzaId)) ? true : false;
        BotsApp.replyMessageId = (_h = (_g = (_f = messageInstance.message) === null || _f === void 0 ? void 0 : _f.extendedTextMessage) === null || _g === void 0 ? void 0 : _g.contextInfo) === null || _h === void 0 ? void 0 : _h.stanzaId;
        BotsApp.replyParticipant = messageInstance.message?.extendedTextMessage?.contextInfo?.participant.replace(/:.*@/g, '@');;
        BotsApp.replyMessage = (_q = (_p = (_o = (_m = messageInstance.message) === null || _m === void 0 ? void 0 : _m.extendedTextMessage) === null || _o === void 0 ? void 0 : _o.contextInfo) === null || _p === void 0 ? void 0 : _p.quotedMessage) === null || _q === void 0 ? void 0 : _q.conversation;
        BotsApp.body = BotsApp.mimeType === 'conversation' ? (_r = messageInstance.message) === null || _r === void 0 ? void 0 : _r.conversation : (BotsApp.mimeType == 'imageMessage') ? (_s = messageInstance.message) === null || _s === void 0 ? void 0 : _s.imageMessage.caption : (BotsApp.mimeType == 'videoMessage') ? (_t = messageInstance.message) === null || _t === void 0 ? void 0 : _t.videoMessage.caption : (BotsApp.mimeType == 'extendedTextMessage') ? (_v = (_u = messageInstance.message) === null || _u === void 0 ? void 0 : _u.extendedTextMessage) === null || _v === void 0 ? void 0 : _v.text : (BotsApp.mimeType == 'buttonsResponseMessage') ? (_w = messageInstance.message) === null || _w === void 0 ? void 0 : _w.buttonsResponseMessage.selectedDisplayText : null;
        BotsApp.isCmd = prefixRegex.test(BotsApp.body);
        BotsApp.commandName = BotsApp.isCmd ? BotsApp.body.slice(1).trim().split(/ +/).shift().toLowerCase() : null;
        BotsApp.isImage = BotsApp.type === "image";
        BotsApp.isReplyImage = ((_0 = (_z = (_y = (_x = messageInstance.message) === null || _x === void 0 ? void 0 : _x.extendedTextMessage) === null || _y === void 0 ? void 0 : _y.contextInfo) === null || _z === void 0 ? void 0 : _z.quotedMessage) === null || _0 === void 0 ? void 0 : _0.imageMessage) ? true : false;
        BotsApp.imageCaption = BotsApp.isImage ? (_1 = messageInstance.message) === null || _1 === void 0 ? void 0 : _1.imageMessage.caption : null;
        BotsApp.isGIF = (BotsApp.type === 'video' && ((_3 = (_2 = messageInstance.message) === null || _2 === void 0 ? void 0 : _2.videoMessage) === null || _3 === void 0 ? void 0 : _3.gifPlayback));
        BotsApp.isReplyGIF = ((_8 = (_7 = (_6 = (_5 = (_4 = messageInstance.message) === null || _4 === void 0 ? void 0 : _4.extendedTextMessage) === null || _5 === void 0 ? void 0 : _5.contextInfo) === null || _6 === void 0 ? void 0 : _6.quotedMessage) === null || _7 === void 0 ? void 0 : _7.videoMessage) === null || _8 === void 0 ? void 0 : _8.gifPlayback) ? true : false;
        BotsApp.isSticker = BotsApp.type === 'sticker';
        BotsApp.isReplySticker = ((_12 = (_11 = (_10 = (_9 = messageInstance.message) === null || _9 === void 0 ? void 0 : _9.extendedTextMessage) === null || _10 === void 0 ? void 0 : _10.contextInfo) === null || _11 === void 0 ? void 0 : _11.quotedMessage) === null || _12 === void 0 ? void 0 : _12.stickerMessage) ? true : false;
        BotsApp.isReplyAnimatedSticker = (_17 = (_16 = (_15 = (_14 = (_13 = messageInstance.message) === null || _13 === void 0 ? void 0 : _13.extendedTextMessage) === null || _14 === void 0 ? void 0 : _14.contextInfo) === null || _15 === void 0 ? void 0 : _15.quotedMessage) === null || _16 === void 0 ? void 0 : _16.stickerMessage) === null || _17 === void 0 ? void 0 : _17.isAnimated;
        BotsApp.isVideo = (BotsApp.type === 'video' && !((_19 = (_18 = messageInstance.message) === null || _18 === void 0 ? void 0 : _18.videoMessage) === null || _19 === void 0 ? void 0 : _19.gifPlayback));
        BotsApp.isReplyVideo = BotsApp.isTextReply ? (jsonMessage.indexOf("videoMessage") !== -1 && !((_21 = (_20 = messageInstance.message) === null || _20 === void 0 ? void 0 : _20.extendedTextMessage) === null || _21 === void 0 ? void 0 : _21.contextInfo.quotedMessage.videoMessage.gifPlayback)) : false;
        BotsApp.isAudio = BotsApp.type === 'audio';
        BotsApp.isReplyAudio = ((_25 = (_24 = (_23 = (_22 = messageInstance.message) === null || _22 === void 0 ? void 0 : _22.extendedTextMessage) === null || _23 === void 0 ? void 0 : _23.contextInfo) === null || _24 === void 0 ? void 0 : _24.quotedMessage) === null || _25 === void 0 ? void 0 : _25.audioMessage) ? true : false;
        BotsApp.logGroup = client.user.id.replace(/:.*@/g, '@');
        ;
        BotsApp.isGroup = BotsApp.chatId.endsWith('@g.us');
        BotsApp.isPm = !BotsApp.isGroup;
	BotsApp.sender = (BotsApp.isGroup && messageInstance.message && BotsApp.fromMe) ? BotsApp.owner : (BotsApp.isGroup && messageInstance.message) ? messageInstance.key.participant.replace(/:.*@/g, '@') : (!BotsApp.isGroup) ? BotsApp.chatId : null;
        BotsApp.isSenderSUDO = SUDOstring.includes((_26 = BotsApp.sender) === null || _26 === void 0 ? void 0 : _26.substring(0, BotsApp.sender.indexOf("@")));
        return BotsApp;
    });
};
module.exports = resolve;
