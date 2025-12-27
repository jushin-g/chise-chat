# chise-chat

## 概要

VoiSona のキャラクター「知声」とチャットができる Web アプリケーションです。

Google の Gemini API を使用してキャラクターとしての応答を生成し、VoiSona Talk API を通じて知声の声で発話を行うことができます。

### 主な機能

- Gemini API を利用した、キャラクター設定に基づいた応答生成
- VoiSona Talk API を利用した音声合成

## 導入方法

以下の手順でアプリケーションをセットアップおよび起動してください。

1. **リポジトリのクローンとディレクトリ移動**

   ```bash
   git clone <repository-url>
   cd chise-chat
   ```

2. **依存関係のインストール**

   ```bash
   npm i
   ```

3. **環境変数の設定**
   プロジェクトのルートディレクトリに `.env` ファイルを作成し、以下の環境変数を設定してください。

   GEMINI API の API key は [Google AI Studio](https://aistudio.google.com/) で取得できます。

   VOISONA Talk API の各値については[公式 Docs](https://manual.voisona.com/space/VMTJ/111869967/REST+API+%E3%83%81%E3%83%A5%E3%83%BC%E3%83%88%E3%83%AA%E3%82%A2%E3%83%AB#REST-API%E3%81%AE%E6%9C%89%E5%8A%B9%E5%8C%96) を参照してください。

   ```env
   GEMINI_API_KEY=your_gemini_api_key
   VOISONA_TALK_USERNAME=your_voisona_username
   VOISONA_TALK_PASSWORD=your_voisona_password
   VOISONA_TALK_API_ORIGIN=http://localhost:{port}
   ```

4. **アプリケーションの起動**

   ```bash
   npm run dev
   ```

   VoiSona Talk ソフトウェア自体も起動しておく必要があります。

5. **動作確認**
   ブラウザで `http://localhost:3000` にアクセスしてください。
