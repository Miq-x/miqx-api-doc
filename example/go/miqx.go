// Miqx API V4 Sample
// Powered by MaguRo 2024

package main

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"time"
)

type Response struct {
	Status  string `json:"status"`
	Message string `json:"message"`
	Image   string `json:"image"`
	Gif     string `json:"gif,omitempty"`
}

func main() {
	// Set API key and endpoint
	const API_KEY = ""
	const ENDPOINT = "https://api.miqx.jp/v1/make" // Replace with the correct endpoint URL

	// Params
	params := map[string]string{
		"param": "make2",
		"name":  "justin tuner🐟",
		"text":  "Hi, Tuna",
		"id":    "0001112222",
		"mid":   "u66aa785c06415da8850a19a6e16c223f12345",
		"meta":  "None",
		"stamp": "None",
	}

	// icon-path (jpg/png)
	imagePath := "../req.jpg"

	if _, err := os.Stat(imagePath); os.IsNotExist(err) {
		fmt.Printf("Error: Image file '%s' not found. Please provide a valid path.\n", imagePath)
		os.Exit(1)
	}

	file, err := os.Open(imagePath)
	if err != nil {
		fmt.Printf("Error: Unable to open image file '%s': %v\n", imagePath, err)
		os.Exit(1)
	}
	defer file.Close()

	var requestBody bytes.Buffer
	writer := multipart.NewWriter(&requestBody)

	for key, val := range params {
		if err := writer.WriteField(key, val); err != nil {
			fmt.Printf("Error: Failed to write field '%s': %v\n", key, err)
			os.Exit(1)
		}
	}

	part, err := writer.CreateFormFile("img", filepath.Base(imagePath))
	if err != nil {
		fmt.Printf("Error: Failed to create form file: %v\n", err)
		os.Exit(1)
	}
	if _, err := io.Copy(part, file); err != nil {
		fmt.Printf("Error: Failed to copy file data: %v\n", err)
		os.Exit(1)
	}

	if err := writer.Close(); err != nil {
		fmt.Printf("Error: Failed to close writer: %v\n", err)
		os.Exit(1)
	}

	client := &http.Client{
		Timeout: 60 * time.Second,
	}

	req, err := http.NewRequest("POST", ENDPOINT, &requestBody)
	if err != nil {
		fmt.Printf("Error: Failed to create request: %v\n", err)
		os.Exit(1)
	}
	req.Header.Set("Content-Type", writer.FormDataContentType())
	req.Header.Set("Authorization", "Bearer "+API_KEY)

	resp, err := client.Do(req)
	if err != nil {
		if os.IsTimeout(err) {
			fmt.Println("Error: The request timed out.")
		} else {
			fmt.Printf("Error: An error occurred during the request: %v\n", err)
		}
		os.Exit(1)
	}
	defer resp.Body.Close()

	var res Response
	if err := json.NewDecoder(resp.Body).Decode(&res); err != nil {
		fmt.Printf("Error: Failed to parse response: %v\n", err)
		os.Exit(1)
	}

	if res.Status == "error" {
		fmt.Printf("Error: %s\n", res.Message)
	} else {
		// Save image result
		if res.Image != "" {
			imageData, err := base64.StdEncoding.DecodeString(res.Image)
			if err != nil {
				fmt.Printf("Error: Failed to decode image data: %v\n", err)
				os.Exit(1)
			}
			if err := os.WriteFile("res.png", imageData, 0644); err != nil {
				fmt.Printf("Error: Failed to save image 'res.png': %v\n", err)
				os.Exit(1)
			}
			fmt.Println("Image 'res.png' has been saved.")
		}

		// Save GIF result
		if res.Gif != "" {
			gifData, err := base64.StdEncoding.DecodeString(res.Gif)
			if err != nil {
				fmt.Printf("Error: Failed to decode GIF data: %v\n", err)
				os.Exit(1)
			}
			if err := os.WriteFile("res.gif", gifData, 0644); err != nil {
				fmt.Printf("Error: Failed to save GIF 'res.gif': %v\n", err)
				os.Exit(1)
			}
			fmt.Println("GIF 'res.gif' has been saved.")
		}
	}

	// For debug
	// fmt.Printf("%+v\n", res)
}
