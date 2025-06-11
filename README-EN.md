# Miq-x API V4

English version
[here](https://github.com/Miq-x/miqx-api-doc/blob/main/README.md)

## What is this

**Miq-x** is an API that generates meme-style collage images. Although there are
many similar APIs, Miq-x was meticulously designed and developed with attention
to detail:

- **Rich Fonts**: Generate images using a wide variety of fonts
- **Versatile Parameters**: Icon color/inversion/text color, etc. Fine
  customization is possible
- **Exquisite Line Break Handling**: Automatically adjusts text layout at the
  pixel level
- **Overwhelming Generation Speed**: Incredibly fast image generation

Developed entirely in Rust, Miq-x boasts top-class performance.

## Getting Started

This API is provided with kindness based on **trust** ( ˙꒳​˙ )ིྀ\
For issues like garbled text, bugs, font additions, etc., please contact us via
[Issue](https://github.com/Miq-x/miqx-api-doc/issues).

> [!CAUTION]
> Prohibited Actions:
>
> - Distributing your API key to others
> - Modifying parameters (`name`, `mid`, `id`, `meta`, `stamp`)
> - Generating fake collage images by modifying the above (excluding development
>   testing)
> - Sending unauthorized requests to the API
> - Malicious attacks on the API server
> - Publishing the API server's IP address
> - Other actions that are commonly considered disruptive

## Obtaining an API Key

You can obtain an API key by requesting "Maguro" if you're lucky. Please contact
us for details.

## Miq-x (Make) Endpoint

Create a collage image with the specified icon

- **URL**: `https://api.miqx.jp/v1/make`
- **Method**: `POST`
- **Authentication**: Bearer Token

### Parameters

| Parameter | Description                         | Required |
| --------- | ----------------------------------- | -------- |
| `param`   | Parameter (e.g., "mono")            | ✅       |
| `name`    | Speaker's name                      | ✅       |
| `text`    | Speech                              | ✅       |
| `id`      | Unique identifier for the message   | ✅       |
| `mid`     | Unique identifier for the speaker   | ✅       |
| `img`     | Icon image (PNG/JPG, binary)        | ✅       |
| `meta`    | For drawing LINE emojis (see below) | ❌       |
| `stamp`   | For drawing LINE stamps (see below) | ❌       |

### Authentication Header

```
Authorization: Bearer YOUR_API_KEY
```

<details>
<summary>Functions Available Only on LINE</summary>

### Drawing LINE Emojis

Convert metadata to a string and make a request.

```python
emojiData    = eval(msg.contentMetadata["REPLACE"])
param["meta"] = str(emojiData["sticon"]["resources"])
```

### Drawing LINE Stamps (Single)

Convert metadata to a string and make a request.

```python
stamp_id       = msg.contentMetadata["STKID"]
stamp_pkg      = msg.contentMetadata["STKPKGID"]
param["stamp"] = f"{stamp_pkg}_{stamp_id}"
```

### Drawing LINE Stamps (Combination)

Convert metadata to a string and make a request.

```python
param["stamp"] = msg.contentMetadata["CSSTKID"]
```

### Drawing Animated Stamps/Emojis

If the stamp or emoji supports animation, `gif` is added to the response data.

```python
with open("res.gif", mode="wb") as f:
    f.write(base64.b64decode(res["gif"]))
```

GIF rendering behaves as follows:

- Correct all frame intervals to 10ms
- If a stamp/emoji has a long frame, wait for that interval

</details>

> [!WARNING]
> Please send all `value` as **String**.\
> Set `id` to a unique number that does not overlap for each message. (This
> helps during debugging)\
> Although it depends on the app, it is recommended to set `mid` to something
> like the user ID.

### Response

#### Success

The `gif` field is included only for LINE's animated stamps/emojis.

```json
{
    "status": "success",
    "message": "success",
    "image": "base64_encoded_image",
    "gif": "base64_encoded_gif"
}
```

#### Failure

```json
{
    "status": "error",
    "message": "A brief description of the error here",
    "image": ""
}
```

## Smash (Smash Bros. Participation) Endpoint

Create a Smash Bros. participation image with the specified icon

- **URL**: `https://api.miqx.jp/v1/smash`
- **Method**: `POST`
- **Authentication**: Bearer Token

### Parameters

| Parameter | Description                  | Required |
| --------- | ---------------------------- | -------- |
| `img`     | Icon image (PNG/JPG, binary) | ✅       |

### Authentication Header

```
Authorization: Bearer YOUR_API_KEY
```

> [!WARNING]
> Please send all `value` as **String**.

### Response

#### Success

```json
{
    "status": "success",
    "message": "success",
    "image": "base64_encoded_image"
}
```

#### Failure

```json
{
    "status": "error",
    "message": "A brief description of the error here",
    "image": ""
}
```

## List of Error Messages

| Error Message                                  | Description                                 |
| ---------------------------------------------- | ------------------------------------------- |
| `Invalid APIkey`                               | The API key is invalid                      |
| `Invalid Text`                                 | The speech text is missing                  |
| `Invalid Param`                                | The parameter is missing                    |
| `Invalid Name`                                 | The speaker's name is missing               |
| `Invalid Mid`                                  | The MID is missing                          |
| `Invalid Id`                                   | The ID is missing                           |
| `Invalid Metadata`                             | Failed to parse Meta data                   |
| `Id must contain only alphanumeric characters` | The ID contains non-alphanumeric characters |
| `Image not found`                              | No image provided                           |
| `Failed to generate Image`                     | Image generation failed                     |
| `A error occurred during image generation`     | An error occurred during image generation   |
| `Failed to execute image generation task`      | Failed to execute image generation task     |
