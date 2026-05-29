# セリフ編集ツール

ビジュアルノベル・ADV 向けのシナリオ（CSV）を、ブラウザで快適に編集するためのツールです。

## 使い方

公開ページ: https://emily57.github.io/game_coding_seat/

上記 URL にアクセスすることで、実際にこのツールを試せます。

このプロジェクトは自由に clone して構いません。  
clone 後は、用途に合わせて好きにカスタマイズしてください。

※ プルリクエストは受け付けていません。

1. まず「sample.csv をダウンロード」をクリックすると、サンプルCSVを取得できます
2. 「edit.csv を開く」ボタンから、編集したい `.csv` を選択します（sample.csv でも可）
3. テーブル上でセリフ・立ち絵・背景・BGM を編集します
4. 自動保存されるので、保存ボタンは不要です
5. 「テキスト出力」ボタンで、ゲームエンジン用テキストを生成します

> **注意**: 行の削除は、CSV ファイルを直接編集してページをリロードしてください。

## カスタマイズ

**このツールは自分のゲーム・プロジェクト向けに自由に改造して使うことを想定しています。**
`config/` 配下のファイルを編集するだけで、大半の設定変更が完結します。

| ファイル                    | 設定できる内容                                                               |
| --------------------------- | ---------------------------------------------------------------------------- |
| `config/name.js`            | キャラクター定義（名前・ウィンドウ・表情プレフィックス・ハイライト色・別名） |
| `config/tags.js`            | 背景画像・BGM・コードタグ（`[sepia_start]` など）の候補リスト                |
| `config/expression/*.js`    | 各キャラの立ち絵パターン一覧                                                 |
| `config/char-highlight.css` | キャラ名ハイライトの色定義                                                   |
| `config/index.js`           | config 配下の読み込みリスト（ファイルを追加したらここに追記）                |

## CSV フォーマット

区切り文字は `・`（中黒）。列の順は以下の通りです。

```
code・start・reset・show・bg・bgm・expression_char・expression・name・dialogue
```

| 列              | 内容                                       |
| --------------- | ------------------------------------------ |
| code            | `[sepia_start]` などのコードタグ（省略可） |
| start           | シーン開始フラグ（`true` / `false`）       |
| reset           | 立ち絵リセットフラグ                       |
| show            | 立ち絵表示フラグ                           |
| bg              | 背景画像ファイル名（拡張子なし）           |
| bgm             | BGM ファイル名（拡張子なし）               |
| expression_char | 立ち絵を表示するキャラ名                   |
| expression      | 立ち絵パターン（例: `normal/normal`）      |
| name            | 話者名                                     |
| dialogue        | セリフ（改行は `[r]`）                     |

## ファイル構成

```
index.html          # エントリポイント
styles.css          # スタイル
csv-utils.js        # CSV パースユーティリティ
config/
  index.js          # config 読み込みローダー
  name.js           # キャラクター定義（単一管理元）
  tags.js           # タグ候補（BG / BGM / コードタグ）
  config.js         # AppConfig（name.js / tags.js を参照）
  char-highlight.css # ハイライト色定義
  expression/       # キャラごとの立ち絵パターン
js/
  db.js             # IndexedDB ヘルパー
  ui.js             # UI 描画
  scenario.js       # テキスト生成
  app.js            # 状態管理・イベント・起動処理
edit/               # 編集中の CSV（gitignore 済み）
archive/            # バックアップ用（gitignore 済み）
```
