# -*- coding: utf-8 -*-

import base64
import requests
import os

# Miqx API V4 Sample
# Powered by MaguRo 2024

# Set API key and endpoint
API_KEY = ""
ENDPOINT = "https://api.miqx.jp/v1/make"  # Replace with the correct endpoint URL

# Params
params = {
    "param": "make2",
    "name": "justin tuner🐟",
    "text": "Hi, Tuna",
    "id": "0001112222",
    "mid": "u66aa785c06415da8850a19a6e16c223f12345",
    "meta": "None",
    "stamp": "None",
}

# Headers for authentication
headers = {
    "Authorization": f"Bearer {API_KEY}"
}

# icon-path (jpg/png)
image_path = "../req.jpg"


if not os.path.isfile(image_path):
    print(f"Error: Image file '{image_path}' not found. Please provide a valid path.")
    exit(1)

file = {"img": open(image_path, "rb")}

# Send the request
try:
    response = requests.post(ENDPOINT, data=params, files=file, headers=headers, timeout=60)
    response.raise_for_status()
    res = response.json()
except requests.exceptions.Timeout:
    print("Error: The request timed out.")
    exit(1)
except requests.exceptions.RequestException as e:
    print(f"Error: An error occurred during the request: {e}")
    exit(1)
finally:
    file["img"].close()

if res.get("status") == "error":
    print(f"Error: {res.get('message', 'An unknown error occurred.')}")
else:
    # Save image result
    if "image" in res:
        with open("res.png", "wb") as f:
            f.write(base64.b64decode(res["image"]))
        print("Image 'res.png' has been saved.")

    # Save GIF result
    if "gif" in res:
        with open("res.gif", "wb") as f:
            f.write(base64.b64decode(res["gif"]))
        print("GIF 'res.gif' has been saved.")

# For debug
# print(res)
