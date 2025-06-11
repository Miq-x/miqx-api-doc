// miq.ts

// Miqx API V4 Sample
// Powered by MaguRo 2024

import axios, { AxiosResponse } from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import FormData from 'form-data';

interface ApiResponse {
    status: string;
    message?: string;
    image?: string;
    gif?: string;
}

async function main() {
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

    const form = new FormData();
    for (const [key, value] of Object.entries(params)) {
        form.append(key, value);
    }

    try {
        const fileStream = fs.createReadStream(imagePath);
        form.append('img', fileStream, path.basename(imagePath));
    } catch (err) {
        console.error(`Error: Unable to read image file '${imagePath}':`, err);
        process.exit(1);
    }

    try {
        const response: AxiosResponse<ApiResponse> = await axios.post(ENDPOINT, form, {
            headers: {
                ...form.getHeaders(),
                'Authorization': `Bearer ${API_KEY}`
            },
            timeout: 60000, // 60 seconds
        });

        const res = response.data;

        if (res.status === "error") {
            console.error(`Error: ${res.message || 'An unknown error occurred.'}`);
        } else {
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
    } catch (error: any) {
        if (error.code === 'ECONNABORTED') {
            console.error("Error: The request timed out.");
        } else if (error.response) {
            console.error(`Error: An error occurred during the request: ${error.message}`);
        } else {
            console.error(`Error: An error occurred during the request: ${error.message}`);
        }
        process.exit(1);
    }
}

main();
