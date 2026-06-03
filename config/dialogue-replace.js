// ---- セリフ内の文字列置換ルール ----
// 自動修正ボタン押下時、セリフ欄に含まれる from を to に変換する。
// ひらがな等の表記ゆれは対象外のため、完全一致のもののみ定義すること。
window.DialogueReplacements = [
  { from: "林檎", to: "[ringo]" },
  { from: "リンリン", to: "[rinrin]" },
];
