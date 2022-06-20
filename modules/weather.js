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
const https_1 = __importDefault(require("https"));
const config_1 = __importDefault(require("../config"));
const db_1 = __importDefault(require("../lib/db"));
const message_type_1 = require("../sidekick/message-type");
const string_format_1 = __importDefault(require("string-format"));
const WEATHER = db_1.default.weather;
const apiKey = config_1.default.WEATHER_API_KEY;
module.exports = {
    name: "weather",
    description: WEATHER.DESCRIPTION,
    extendedDescription: WEATHER.EXTENDED_DESCRIPTION,
    demo: {
        isEnabled: true,
        text: [
            ".weather New Delhi",
            ".weather New Delhi tomorrow",
            ".weather New Delhi tom",
        ],
    },
    handle(client, chat, BotsApp, args) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const weatherTypes = {
                    sunny: "sunny",
                    clear: "clear",
                    cloud: "cloud",
                    overcast: "overcast",
                    rain: "rain",
                    drizzle: "drizzle",
                    snow: "snow",
                    storm: "storm",
                    fog: "fog",
                    haze: "haze",
                    mist: "mist",
                };
                function result(imageUrl, weatherDataVariables, downloading) {
                    return __awaiter(this, void 0, void 0, function* () {
                        yield client.sendMessage(BotsApp.chatId, { url: imageUrl }, message_type_1.MessageType.image, {
                            caption: (0, string_format_1.default)(WEATHER.WEATHER_DATA, weatherDataVariables),
                        }).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                        yield client.deleteMessage(BotsApp.chatId, {
                            id: downloading.key.id,
                            remoteJid: BotsApp.chatId,
                            fromMe: true,
                        });
                    });
                }
                if (args.length < 1) {
                    client.sendMessage(BotsApp.chatId, WEATHER.CITY_NAME_REQUIRED, message_type_1.MessageType.text).catch(err => input_sanitization_1.default.handleError(err, client, BotsApp));
                    return;
                }
                else if (args[args.length - 1] === "tom" ||
                    args[args.length - 1] === "tomorrow") {
                    var downloading = yield client.sendMessage(BotsApp.chatId, WEATHER.DOWNLOADING, message_type_1.MessageType.text);
                    args[args.length - 1] = "";
                    var cityName = args.join(" ");
                    const unit = "metric";
                    const url = "https://api.openweathermap.org/data/2.5/forecast?q=" +
                        cityName +
                        "&appid=" +
                        apiKey +
                        "&units=" +
                        unit +
                        "&cnt=" +
                        8;
                    https_1.default.get(url, function (response) {
                        response.on("error", (err) => {
                            throw err;
                        });
                        response.on("data", function (data) {
                            try {
                                const weatherData = JSON.parse(data);
                                console.log(weatherData);
                                const tempInC = Number(weatherData.list[7].main.temp).toFixed(2);
                                const tempInF = (tempInC * 1.8 + 32).toFixed(2);
                                const minTempInC = Number(weatherData.list[7].main.temp_min).toFixed(2);
                                const minTempInF = (minTempInC * 1.8 + 32).toFixed(2);
                                const maxTempInC = Number(weatherData.list[7].main.temp_max).toFixed(2);
                                const maxTempInF = (maxTempInC * 1.8 + 32).toFixed(2);
                                const humidity = Number(weatherData.list[7].main.humidity).toFixed(2);
                                const windSpeedInkmph = (Number(weatherData.list[7].wind.speed) * 3.6).toFixed(2);
                                const windSpeedInmph = (windSpeedInkmph * 0.621371).toFixed(2);
                                const windDegree = weatherData.list[7].wind.deg.toFixed(2);
                                const sunriseTimeStamp = Number(weatherData.city.sunrise);
                                var sunriseDate = new Date(sunriseTimeStamp);
                                const sunriseTime = sunriseDate.getHours() +
                                    ":" +
                                    sunriseDate.getMinutes() +
                                    ":" +
                                    sunriseDate.getSeconds();
                                const sunsetTimeStamp = Number(weatherData.city.sunset);
                                var sunsetDate = new Date(sunsetTimeStamp);
                                const sunsetTime = sunsetDate.getHours() +
                                    ":" +
                                    sunsetDate.getMinutes() +
                                    ":" +
                                    sunsetDate.getSeconds();
                                var weatherDescription = weatherData.list[7].weather[0].description;
                                let imageName;
                                for (var type in weatherTypes) {
                                    if (weatherDescription.includes(weatherTypes[type])) {
                                        imageName = weatherTypes[type];
                                        break;
                                    }
                                    else {
                                        imageName = "fallback";
                                    }
                                }
                                weatherDescription =
                                    weatherDescription.toUpperCase();
                                cityName = weatherData.city.name;
                                const country = weatherData.city.country;
                                const timeOfRequest = weatherData.list[7].dt * 1000;
                                var date = new Date(timeOfRequest);
                                const dateAndTime = date.getDate() +
                                    "/" +
                                    (date.getMonth() + 1) +
                                    "/" +
                                    date.getFullYear() +
                                    " " +
                                    date.getHours() +
                                    ":" +
                                    date.getMinutes() +
                                    ":" +
                                    date.getSeconds();
                                const weatherDataVariables = {
                                    tempInC: tempInC,
                                    tempInF: tempInF,
                                    minTempInC: minTempInC,
                                    minTempInF: minTempInF,
                                    maxTempInC: maxTempInC,
                                    maxTempInF: maxTempInF,
                                    humidity: humidity,
                                    windSpeedInkmph: windSpeedInkmph,
                                    windSpeedInmph: windSpeedInmph,
                                    degree: windDegree,
                                    sunriseTime: sunriseTime,
                                    sunsetTime: sunsetTime,
                                    weatherDescription: weatherDescription,
                                    cityName: cityName,
                                    country: country,
                                    dateAndTime: dateAndTime,
                                };
                                const imageUrl = "https://raw.githubusercontent.com/Prince-Mendiratta/BotsApp-Resources/main/weather/" +
                                    imageName +
                                    ".jpg";
                                result(imageUrl, weatherDataVariables, downloading);
                            }
                            catch (err) {
                                client.deleteMessage(BotsApp.chatId, {
                                    id: downloading.key.id,
                                    remoteJid: BotsApp.chatId,
                                    fromMe: true,
                                });
                                input_sanitization_1.default.handleError(err, client, BotsApp, WEATHER.ERROR_OCCURED);
                                return;
                            }
                        });
                    });
                    return;
                }
                else {
                    var downloading = yield client.sendMessage(BotsApp.chatId, WEATHER.DOWNLOADING, message_type_1.MessageType.text);
                    var cityName = args.join(" ");
                    const unit = "metric";
                    const url = "https://api.openweathermap.org/data/2.5/weather?q=" +
                        cityName +
                        "&appid=" +
                        apiKey +
                        "&units=" +
                        unit;
                    https_1.default.get(url, function (response) {
                        response.on("error", (err) => {
                            throw err;
                        });
                        response.on("data", function (data) {
                            try {
                                const weatherData = JSON.parse(data);
                                const tempInC = Number(weatherData.main.temp).toFixed(2);
                                const tempInF = (tempInC * 1.8 + 32).toFixed(2);
                                const minTempInC = Number(weatherData.main.temp_min).toFixed(2);
                                const minTempInF = (minTempInC * 1.8 + 32).toFixed(2);
                                const maxTempInC = Number(weatherData.main.temp_max).toFixed(2);
                                const maxTempInF = (maxTempInC * 1.8 + 32).toFixed(2);
                                const humidity = Number(weatherData.main.humidity).toFixed(2);
                                const windSpeedInkmph = (Number(weatherData.wind.speed) * 3.6).toFixed(2);
                                const windSpeedInmph = (windSpeedInkmph * 0.621371).toFixed(2);
                                const windDegree = weatherData.wind.deg.toFixed(2);
                                const sunriseTimeStamp = Number(weatherData.sys.sunrise);
                                var sunriseDate = new Date(sunriseTimeStamp);
                                const sunriseTime = sunriseDate.getHours() +
                                    ":" +
                                    sunriseDate.getMinutes() +
                                    ":" +
                                    sunriseDate.getSeconds();
                                const sunsetTimeStamp = Number(weatherData.sys.sunset);
                                var sunsetDate = new Date(sunsetTimeStamp);
                                const sunsetTime = sunsetDate.getHours() +
                                    ":" +
                                    sunsetDate.getMinutes() +
                                    ":" +
                                    sunsetDate.getSeconds();
                                var weatherDescription = weatherData.weather[0].description;
                                let imageName;
                                for (var type in weatherTypes) {
                                    if (weatherDescription.includes(weatherTypes[type])) {
                                        imageName = weatherTypes[type];
                                        break;
                                    }
                                    else {
                                        imageName = "fallback";
                                    }
                                }
                                weatherDescription =
                                    weatherDescription.toUpperCase();
                                cityName = weatherData.name;
                                const country = weatherData.sys.country;
                                const timeOfRequest = weatherData.dt * 1000;
                                var date = new Date(timeOfRequest);
                                const dateAndTime = date.getDate() +
                                    "/" +
                                    (date.getMonth() + 1) +
                                    "/" +
                                    date.getFullYear() +
                                    " " +
                                    date.getHours() +
                                    ":" +
                                    date.getMinutes() +
                                    ":" +
                                    date.getSeconds();
                                const weatherDataVariables = {
                                    tempInC: tempInC,
                                    tempInF: tempInF,
                                    minTempInC: minTempInC,
                                    minTempInF: minTempInF,
                                    maxTempInC: maxTempInC,
                                    maxTempInF: maxTempInF,
                                    humidity: humidity,
                                    windSpeedInkmph: windSpeedInkmph,
                                    windSpeedInmph: windSpeedInmph,
                                    degree: windDegree,
                                    sunriseTime: sunriseTime,
                                    sunsetTime: sunsetTime,
                                    weatherDescription: weatherDescription,
                                    cityName: cityName,
                                    country: country,
                                    dateAndTime: dateAndTime,
                                };
                                const imageUrl = "https://raw.githubusercontent.com/Prince-Mendiratta/BotsApp-Resources/main/weather/" +
                                    imageName +
                                    ".jpg";
                                result(imageUrl, weatherDataVariables, downloading);
                            }
                            catch (err) {
                                client.deleteMessage(BotsApp.chatId, {
                                    id: downloading.key.id,
                                    remoteJid: BotsApp.chatId,
                                    fromMe: true,
                                });
                                input_sanitization_1.default.handleError(err, client, BotsApp, WEATHER.ERROR_OCCURED);
                                return;
                            }
                        });
                    });
                    return;
                }
            }
            catch (err) {
                input_sanitization_1.default.handleError(err, client, BotsApp, WEATHER.ERROR_OCCURED);
            }
        });
    },
};
