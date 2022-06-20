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
const qrcode_1 = require("@nuintun/qrcode");
const fs_1 = __importDefault(require("fs"));
const message_type_1 = require("../sidekick/message-type");
const QR = db_1.default.qr;
module.exports = {
    name: "qr",
    description: QR.DESCRIPTION,
    extendedDescription: QR.EXTENDED_DESCRIPTION,
    demo: { isEnabled: true, text: ".qr Hey, I am TOPEK-BOT." },
    handle(client, chat, BotsApp, args) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (args.length === 0 && !BotsApp.isTextReply) {
                    yield client
                        .sendMessage(BotsApp.chatId, QR.INVALID_INPUT, message_type_1.MessageType.text)
                        .catch((err) => input_sanitization_1.default.handleError(err, client, BotsApp));
                    return;
                }
                let message;
                if (!BotsApp.isTextReply) {
                    message = args.join(" ");
                }
                else {
                    message = BotsApp.replyMessage;
                }
                const qrcode = new qrcode_1.Encoder();
                qrcode.setEncodingHint(true);
                qrcode.setErrorCorrectionLevel(qrcode_1.ErrorCorrectionLevel.Q);
                qrcode.write(new qrcode_1.QRByte(message));
                qrcode.make();
                const output = qrcode.toDataURL().split(",")[1];
                const imagePath = "./tmp/qr.png";
                fs_1.default.writeFileSync(imagePath, output, { encoding: "base64" });
                yield client.sendMessage(BotsApp.chatId, fs_1.default.readFileSync(imagePath), message_type_1.MessageType.image, {
                    caption: QR.IMAGE_CAPTION,
                }).catch((err) => input_sanitization_1.default.handleError(err, client, BotsApp));
                input_sanitization_1.default.deleteFiles(imagePath);
                return;
            }
            catch (err) {
                yield input_sanitization_1.default.handleError(err, client, BotsApp);
            }
        });
    }
};
