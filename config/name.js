// ---- キャラクター定義（単一の管理元） ----
// name: 正規化名
// prefix: 表情JSのプレフィックス
// windowId: 表示ウィンドウID
// highlightClass: 文字色ハイライト用CSSクラス（省略可）
// aliases: 入力ゆれ（省略可）
window.CharacterDefinitions = [
  {
    name: "真田 火山",
    prefix: "sanada",
    windowId: "sanada_window",
    highlightClass: "char-highlight-sanada",
    aliases: ["真田", "火山"],
  },
  {
    name: "実兎 美土",
    prefix: "mito",
    windowId: "mito_window",
    highlightClass: "char-highlight-mito",
    aliases: ["実兎"],
  },
  {
    name: "味摘 林檎",
    prefix: "ringo",
    windowId: "ringo_window",
    highlightClass: "char-highlight-ringo",
    aliases: ["味摘林檎", "林檎"],
  },
  {
    name: "一吟 風雅",
    prefix: "ichigin",
    windowId: "ichigin_window",
    highlightClass: "char-highlight-ichigin",
    aliases: ["一吟"],
  },
  {
    name: "路賀 水狐",
    prefix: "roga",
    windowId: "roga_window",
    highlightClass: "char-highlight-roga",
    aliases: ["路賀"],
  },
  {
    name: "原久保 結子",
    prefix: "harakubo",
    windowId: "harakubo_window",
    highlightClass: "char-highlight-harakubo",
    aliases: ["原久保"],
  },
  {
    name: "天吏 杏樹",
    prefix: "amari",
    windowId: "amari_window",
    highlightClass: "char-highlight-amari",
    aliases: ["杏樹", "天吏"],
  },
  {
    name: "案内人",
    prefix: "guide",
    windowId: "guide_window",
    aliases: [],
  },
  {
    name: "other",
    prefix: "other",
    windowId: "other_window",
    highlightClass: "",
    aliases: [],
  },
];

// ---- 互換エクスポート（既存コード向け） ----
// [正規化名, 表情JSのプレフィックス]
window.ExpressionPrefixList = window.CharacterDefinitions.map((c) => [
  c.name,
  c.prefix,
]);

// キャラクター名 -> ハイライトCSSクラス
window.CharHighlightMap = window.CharacterDefinitions.reduce((acc, c) => {
  if (c.highlightClass) acc[c.name] = c.highlightClass;
  return acc;
}, {});

// [入力表記, 正規化名, ウィンドウID]
window.NameList = window.CharacterDefinitions.flatMap((c) => {
  const rows = [[c.name, c.name, c.windowId]];
  (c.aliases || []).forEach((alias) => {
    rows.push([alias, c.name, c.windowId]);
  });
  return rows;
});
