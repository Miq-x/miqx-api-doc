# Miq-x API V4

English version
[here](https://github.com/Miq-x/miqx-api-doc/blob/main/README-EN.md)

## なにこれ

**Miq-x**
は名言風のコラ画像を生成するAPIです。類似のAPIは多数存在しますが、Miq-xは細部にまでこだわりデザイン/開発されました：

- **豊富なフォント**：多種多様なフォントから生成可能
- **多彩なパラメーター**：アイコンの色/反転/文字の色 etc...
  細かなカスタマイズが可能
- **絶妙な改行処理**：テキストのレイアウトをピクセル単位で自動調整
- **圧倒的な生成スピード**：ありえないほど迅速な画像生成

全てがRustで開発されたMiq-xはトップクラスのパフォーマンスを誇ります。

## はじめに

このAPIは**信頼のもとに親切心で提供**されています( ˙꒳​˙ )ིྀ\
文字化け・バグ・フォント追加等の要望は[Issue](https://github.com/Miq-x/miqx-api-doc/issues)にてご連絡ください。

> [!CAUTION]
> 禁止事項：
>
> - APIキーを他者に配布すること
> - パラメーター（`name`, `mid`, `id`, `meta`, `stamp`）の改変
> - 上記の改変による偽のコラ画像生成（開発段階の動作テストを除く）
> - APIへの不正リクエストの送信
> - APIサーバーへの悪意ある攻撃
> - APIサーバーのIPアドレスの公開
> - その他、常識的に考えて迷惑になる行為

## APIキーの取得

APIキーは運が良ければ「まぐろ」に依頼することで取得できます。詳細はお問い合わせください。

## Miq-x (めいく) エンドポイント

指定したアイコンでコラ画を作成

- **URL**: `https://api.miqx.jp/v1/make`
- **Method**: `POST`
- **認証**: Bearer Token

### パラメーター

| パラメーター | 説明                              | 必須 |
| ------------ | --------------------------------- | ---- |
| `param`      | パラメーター（例："mono"）        | ✅   |
| `name`       | 発言者の名前                      | ✅   |
| `text`       | 発言                              | ✅   |
| `id`         | そのメッセージの固有識別子        | ✅   |
| `mid`        | 発言者の固有識別子                | ✅   |
| `img`        | アイコン画像（PNG/JPG、バイナリ） | ✅   |
| `meta`       | LINE絵文字描画用(後述)            | ❌   |
| `stamp`      | LINEスタンプ描画用(後述)          | ❌   |

### 認証ヘッダー

```
Authorization: Bearer YOUR_API_KEY
```

<details>
<summary>LINEでのみ使用可能な機能はこちら</summary>

### LINE絵文字の描画

Metaデータを文字列に変換してリクエストします。

```python
emojiData    = eval(msg.contentMetadata["REPLACE"])
param["meta"] = str(emojiData["sticon"]["resources"])
```

### LINEスタンプ（単体）の描画

Metaデータを文字列に変換してリクエストします。

```python
stamp_id       = msg.contentMetadata["STKID"]
stamp_pkg      = msg.contentMetadata["STKPKGID"]
param["stamp"] = f"{stamp_pkg}_{stamp_id}"
```

### LINEスタンプ（組み合わせ）の描画

Metaデータを文字列に変換してリクエストします。

```python
param["stamp"] = msg.contentMetadata["CSSTKID"]
```

### アニメーションスタンプ/絵文字の描画

アニメーションに対応したスタンプや絵文字の場合、レスポンスデータに`gif`が追加されます。

```python
with open("res.gif", mode="wb") as f:
    f.write(base64.b64decode(res["gif"]))
```

GIFの描画動作は以下の通りです：

- 全てのフレーム間隔を10msに補正
- フレームが長いスタンプ/絵文字があれば、その間隔分待機

</details>

> [!WARNING]
> 全ての`value`は**String**として送信してください。\
> idはメッセージごとに被らない固有の数字を設定してください。(デバッグ時に助かります)\
> midはアプリによるとは思いますが、ユーザーIDなどを設定することをおすすめします。

### レスポンス

#### 成功

gifフィールドはLineの動くスタンプ/絵文字の場合のみ含まれます

```json
{
    "status": "success",
    "message": "success",
    "image": "base64_encoded_image",
    "gif": "base64_encoded_gif"
}
```

#### 失敗

```json
{
    "status": "error",
    "message": "ここにエラーの簡単な説明",
    "image": ""
}
```

## 参戦（スマブラ参戦）エンドポイント

スマブラで見慣れた参戦画像を指定したアイコンで作成

- **URL**: `https://api.miqx.jp/v1/smash`
- **Method**: `POST`
- **認証**: Bearer Token

### パラメーター

| パラメーター | 説明                              | 必須 |
| ------------ | --------------------------------- | ---- |
| `img`        | アイコン画像（PNG/JPG、バイナリ） | ✅   |

### 認証ヘッダー

```
Authorization: Bearer YOUR_API_KEY
```

> [!WARNING]
> 全ての`value`は**String**として送信してください。

### レスポンス

#### 成功

```json
{
    "status": "success",
    "message": "success",
    "image": "base64_encoded_image"
}
```

#### 失敗

```json
{
    "status": "error",
    "message": "ここにエラーの簡単な説明",
    "image": ""
}
```

## エラーメッセージ一覧

| エラーメッセージ                               | 説明                       |
| ---------------------------------------------- | -------------------------- |
| `Invalid APIkey`                               | APIキーが無効              |
| `Invalid Text`                                 | 発言が空である             |
| `Invalid Param`                                | パラメーターが空である     |
| `Invalid Name`                                 | 発言者名が空である         |
| `Invalid Mid`                                  | MIDが空である              |
| `Invalid Id`                                   | IDが空である               |
| `Invalid Metadata`                             | Metaデータの解析に失敗     |
| `Id must contain only alphanumeric characters` | IDに英数字以外が含まれている |
| `Image not found`                              | 画像がない                 |
| `Failed to generate Image`                     | 画像生成に失敗             |
| `A error occurred during image generation`     | 画像生成中にエラーが発生   |
| `Failed to execute image generation task`      | 画像生成タスクの実行に失敗 |
