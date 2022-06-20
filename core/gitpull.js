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
const git = require('simple-git')();
const chalk_1 = __importDefault(require("chalk"));
const child_process_1 = require("child_process");
const gitPull = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(chalk_1.default.yellowBright.bold("[INFO] Checking for updates..."));
    yield git.fetch();
    let newCommits = yield git.log(['main..origin/main']);
    if (newCommits.total) {
        console.log(chalk_1.default.blueBright("[INFO] New Update pending, updating..."));
        yield git.pull("origin", "main", (err, update) => {
            if (update && update.summary.changes) {
                if (update.files.includes('package.json')) {
                    (0, child_process_1.exec)('npm install').stderr.pipe(process.stderr);
                }
                console.log(chalk_1.default.greenBright.bold("[INFO] Updated the bot with latest changes."));
            }
            else if (err) {
                console.log(chalk_1.default.redBright.bold("[ERROR] Could not pull latest changes!"));
                console.log(err);
            }
        });
    }
    else {
        console.log(chalk_1.default.greenBright.bold("[INFO] Bot is already working on latest version."));
    }
});
module.exports = gitPull;
