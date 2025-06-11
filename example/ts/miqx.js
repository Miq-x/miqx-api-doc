"use strict";
// miq.ts
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
// Miqx API V4 Sample
// Powered by MaguRo 2024
const axios_1 = __importDefault(require("axios"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const form_data_1 = __importDefault(require("form-data"));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // Set API key and endpoint
        const API_KEY = "";
        const ENDPOINT = "https://api.miqx.jp/v1/make"; // Replace with the correct endpoint URL
        // Params
        const params = {
            param: "make2",
            name: "justin tuner🐟",
            text: "Hi, Tuna",
            id: "0001112222",
            mid: "u66aa785c06415da8850a19a6e16c223f12345",
            meta: "None",
            stamp: "None",
        };
        // icon-path (jpg/png)
        const imagePath = "../req.jpg";
        if (!fs.existsSync(imagePath)) {
            console.error(`Error: Image file '${imagePath}' not found. Please provide a valid path.`);
            process.exit(1);
        }
        const form = new form_data_1.default();
        for (const [key, value] of Object.entries(params)) {
            form.append(key, value);
        }
        try {
            const fileStream = fs.createReadStream(imagePath);
            form.append('img', fileStream, path.basename(imagePath));
        }
        catch (err) {
            console.error(`Error: Unable to read image file '${imagePath}':`, err);
            process.exit(1);
        }
        try {
            const response = yield axios_1.default.post(ENDPOINT, form, {
                headers: Object.assign(Object.assign({}, form.getHeaders()), { 'Authorization': `Bearer ${API_KEY}` }),
                timeout: 60000, // 60 seconds
            });
            const res = response.data;
            if (res.status === "error") {
                console.error(`Error: ${res.message || 'An unknown error occurred.'}`);
            }
            else {
                // Save image result
                if (res.image) {
                    const imageBuffer = Buffer.from(res.image, 'base64');
                    fs.writeFileSync('res.png', imageBuffer);
                    console.log("Image 'res.png' has been saved.");
                }
                // Save GIF result
                if (res.gif) {
                    const gifBuffer = Buffer.from(res.gif, 'base64');
                    fs.writeFileSync('res.gif', gifBuffer);
                    console.log("GIF 'res.gif' has been saved.");
                }
            }
            // For debug
            // console.log(res);
        }
        catch (error) {
            if (error.code === 'ECONNABORTED') {
                console.error("Error: The request timed out.");
            }
            else if (error.response) {
                console.error(`Error: An error occurred during the request: ${error.message}`);
            }
            else {
                console.error(`Error: An error occurred during the request: ${error.message}`);
            }
            process.exit(1);
        }
    });
}
main();
