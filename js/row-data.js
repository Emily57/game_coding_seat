// ---- 行データの読み取り（DOM → オブジェクト） ----

function getRowElements(tr) {
  const codeSelect = tr.querySelector("select.code-select");
  const checkboxes = tr.querySelectorAll("input[type='checkbox']");
  const bgSelect = tr.querySelector("select.bg-select");
  const bgmSelect = tr.querySelector("select.bgm-select");
  const expressionCharSelect = tr.querySelector(
    "select.expression-char-select",
  );
  const expressionCategorySelect = tr.querySelector(
    "select.expression-category-select",
  );
  const expressionSelect = tr.querySelector("select.expression-select");
  const textareas = tr.querySelectorAll("textarea");
  return {
    codeSelect,
    checkboxes,
    bgSelect,
    bgmSelect,
    expressionCharSelect,
    expressionCategorySelect,
    expressionSelect,
    textareas,
  };
}

function readRowData(tr) {
  const els = getRowElements(tr);
  const code = els.codeSelect ? els.codeSelect.value.trim() : "";
  const start = els.checkboxes[0] ? els.checkboxes[0].checked : false;
  const reset = els.checkboxes[1] ? els.checkboxes[1].checked : false;
  const show = els.checkboxes[2] ? els.checkboxes[2].checked : false;
  const bg = els.bgSelect ? els.bgSelect.value.trim() : "";
  const bgm = els.bgmSelect ? els.bgmSelect.value.trim() : "";
  const expressionChar = els.expressionCharSelect
    ? els.expressionCharSelect.value.trim()
    : "";
  const expressionCategory = els.expressionCategorySelect
    ? els.expressionCategorySelect.value.trim()
    : "";
  const expressionSub = els.expressionSelect
    ? els.expressionSelect.value.trim()
    : "";
  const expression =
    expressionCategory && expressionSub
      ? expressionCategory + "/" + expressionSub
      : "";
  const name = els.textareas[0] ? els.textareas[0].value.trim() : "";
  const dialogue = els.textareas[1] ? els.textareas[1].value.trim() : "";
  return {
    code,
    start,
    reset,
    show,
    bg,
    bgm,
    expressionChar,
    expression,
    name,
    dialogue,
  };
}
