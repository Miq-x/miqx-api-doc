// Miqx API V4 Sample
// Powered by MaguRo 2024

use std::fs::File;
use std::io::{self, Write};
use std::path::Path;
use std::process;
use std::time::Duration;

use base64::{engine::general_purpose::STANDARD, *};
use reqwest::blocking::multipart;
use reqwest::blocking::Client;
use serde::Deserialize;

#[derive(Deserialize)]
struct Response {
    status: String,
    message: Option<String>,
    image: Option<String>,
    gif: Option<String>,
}

fn main() {
    // Set API key and endpoint
    const API_KEY: &str = "";
    const ENDPOINT: &str = "https://api.miqx.jp/v1/make"; // Replace with the correct endpoint URL

    // Params
    let params = vec![
        ("param", "make2"),
        ("name", "justin tuner🐟"),
        ("text", "Hi, Tuna"),
        ("id", "0001112222"),
        ("mid", "u66aa785c06415da8850a19a6e16c223f12345"),
        ("meta", "None"),
        ("stamp", ""),
    ];

    // icon-path (jpg/png)
    let image_path = "../req.jpg";

    if !Path::new(image_path).is_file() {
        eprintln!(
            "Error: Image file '{}' not found. Please provide a valid path.",
            image_path
        );
        process::exit(1);
    }

    let mut form = multipart::Form::new();

    for (key, value) in &params {
        form = form.text(key.to_string(), value.to_string());
    }

    form = match form.file("img", image_path) {
        Ok(f) => f,
        Err(e) => {
            eprintln!("Error: Failed to attach image file: {}", e);
            process::exit(1);
        }
    };

    let client = Client::builder().timeout(Duration::from_secs(60)).build();

    let client = match client {
        Ok(c) => c,
        Err(e) => {
            eprintln!("Error: Failed to build HTTP client: {}", e);
            process::exit(1);
        }
    };

    let response = client
        .post(ENDPOINT)
        .header("Authorization", format!("Bearer {}", API_KEY))
        .multipart(form)
        .send();

    let response = match response {
        Ok(resp) => resp,
        Err(e) => {
            if e.is_timeout() {
                eprintln!("Error: The request timed out.");
            } else {
                eprintln!("Error: An error occurred during the request: {}", e);
            }
            process::exit(1);
        }
    };

    let res: Response = match response.json() {
        Ok(r) => r,
        Err(e) => {
            eprintln!("Error: Failed to parse response: {}", e);
            process::exit(1);
        }
    };

    if res.status == "error" {
        eprintln!(
            "Error: {}",
            res.message
                .unwrap_or_else(|| "An unknown error occurred.".to_string())
        );
    } else {
        // Save image result
        if let Some(image) = res.image {
            let image_data = match STANDARD.decode(&image) {
                Ok(data) => data,
                Err(e) => {
                    eprintln!("Error: Failed to decode image data: {}", e);
                    process::exit(1);
                }
            };
            if let Err(e) = File::create("res.png").and_then(|mut f| f.write_all(&image_data)) {
                eprintln!("Error: Failed to save image 'res.png': {}", e);
                process::exit(1);
            }
            println!("Image 'res.png' has been saved.");
        }

        // Save GIF result
        if let Some(gif) = res.gif {
            let gif_data = match STANDARD.decode(&gif) {
                Ok(data) => data,
                Err(e) => {
                    eprintln!("Error: Failed to decode GIF data: {}", e);
                    process::exit(1);
                }
            };
            if let Err(e) = File::create("res.gif").and_then(|mut f| f.write_all(&gif_data)) {
                eprintln!("Error: Failed to save GIF 'res.gif': {}", e);
                process::exit(1);
            }
            println!("GIF 'res.gif' has been saved.");
        }
    }

    // For debug
    // println!("{:?}", res);
}
