// ---- キャラクター一覧 ----

function getCharacterList() {
  const list = Array.isArray(window.NameList) ? window.NameList : [];
  const result = [];
  const seen = new Set();

  list.forEach((row) => {
    const normalized = Array.isArray(row) ? String(row[1] || "").trim() : "";
    if (!normalized || seen.has(normalized)) return;
    seen.add(normalized);
    result.push(normalized);
  });

  return result;
}

function getCharacterExpressionPrefix(char) {
  const list = window.ExpressionPrefixList || [];
  const entry = list.find(([name]) => name === char);
  return entry ? entry[1] : "";
}

// ---- ハイライト ----

function applyCharHighlight(el, value) {
  const map = window.CharHighlightMap || {};
  Object.values(map).forEach((cls) => el.classList.remove(cls));
  const cls = map[value];
  if (cls) el.classList.add(cls);
}

// ---- code セレクト ----

function fillCodeSelectOptions(select, currentCode = "") {
  select.innerHTML = "";
  const nullOption = document.createElement("option");
  nullOption.value = "";
  nullOption.textContent = "";
  select.appendChild(nullOption);

  const tags = window.CodeTags || [];
  tags.forEach((tag) => {
    const option = document.createElement("option");
    option.value = tag;
    option.textContent = tag;
    select.appendChild(option);
  });
  select.value = currentCode || "";
}

function makeCodeSelect(currentCode = "") {
  const select = document.createElement("select");
  select.className = "code-select";
  fillCodeSelectOptions(select, currentCode);
  select.addEventListener("change", () => scheduleAutoSave());
  return select;
}

// ---- 背景セレクト ----

function getBgOptionsWithCurrent(currentBg) {
  if (!currentBg || bgImageOptions.includes(currentBg)) {
    return bgImageOptions;
  }
  return [currentBg, ...bgImageOptions];
}

function fillBgSelectOptions(select, currentBg = "") {
  select.innerHTML = "";
  const nullOption = document.createElement("option");
  nullOption.value = "";
  nullOption.textContent = "";
  select.appendChild(nullOption);

  getBgOptionsWithCurrent(currentBg).forEach((bgName) => {
    const option = document.createElement("option");
    option.value = bgName;
    option.textContent = bgName;
    select.appendChild(option);
  });
  select.value = currentBg || "";
}

function refreshAllBgSelects() {
  tableBody.querySelectorAll("select.bg-select").forEach((select) => {
    const current = select.value;
    fillBgSelectOptions(select, current);
  });
}

function makeBgSelect(currentBg = "") {
  const select = document.createElement("select");
  select.className = "bg-select";
  fillBgSelectOptions(select, currentBg);
  select.addEventListener("change", () => scheduleAutoSave());
  return select;
}

// ---- BGMセレクト ----

function fillBgmSelectOptions(select, currentBgm = "") {
  select.innerHTML = "";
  const nullOption = document.createElement("option");
  nullOption.value = "";
  nullOption.textContent = "";
  select.appendChild(nullOption);

  const bgmList = window.AppConfig?.bgmList || [];
  bgmList.forEach((bgm) => {
    const option = document.createElement("option");
    option.value = bgm;
    option.textContent = bgm;
    select.appendChild(option);
  });
  select.value = currentBgm || "";
}

function refreshAllBgmSelects() {
  tableBody.querySelectorAll("select.bgm-select").forEach((select) => {
    const current = select.value;
    fillBgmSelectOptions(select, current);
  });
}

function makeBgmSelect(currentBgm = "") {
  const select = document.createElement("select");
  select.className = "bgm-select";
  fillBgmSelectOptions(select, currentBgm);
  select.addEventListener("change", () => scheduleAutoSave());
  return select;
}

// ---- 立ち絵セレクト ----

function makeExpressionCharSelect(currentChar = "", defaultName = "") {
  const select = document.createElement("select");
  select.className = "expression-char-select";
  select.style.width = "100%";
  select.style.marginBottom = "4px";

  const nullOption = document.createElement("option");
  nullOption.value = "";
  nullOption.textContent = "";
  select.appendChild(nullOption);

  getCharacterList().forEach((char) => {
    const option = document.createElement("option");
    option.value = char;
    option.textContent = char;
    select.appendChild(option);
  });

  select.value = currentChar || defaultName || "";
  applyCharHighlight(select, select.value);
  return select;
}

function fillExpressionSelectOptions(
  select,
  charName = "",
  currentExpression = "",
) {
  select.innerHTML = "";
  const nullOption = document.createElement("option");
  nullOption.value = "";
  nullOption.textContent = "";
  select.appendChild(nullOption);

  if (!charName) return;
  const prefix = getCharacterExpressionPrefix(charName);
  if (!prefix) return;

  const expressions = window.AppConfig.getExpressionsMap()[prefix] || [];
  expressions.forEach((expr) => {
    const option = document.createElement("option");
    option.value = expr;
    option.textContent = expr;
    select.appendChild(option);
  });
  select.value = currentExpression || "";
}

function makeExpressionSelect(charName = "", currentExpression = "") {
  const select = document.createElement("select");
  select.className = "expression-select";
  select.style.width = "100%";
  fillExpressionSelectOptions(select, charName, currentExpression);
  return select;
}

// ---- テキストエリア ----

function makeTextarea(value) {
  const ta = document.createElement("textarea");
  ta.className = "editable";
  ta.value = value;
  ta.rows = 3;
  ta.addEventListener("input", () => {
    autoResize(ta);
    scheduleAutoSave();
  });
  return ta;
}

function autoResize(ta) {
  ta.style.height = "auto";
  ta.style.height = ta.scrollHeight + "px";
}

// ---- 文字数カウント ----

function getLineCounts(text) {
  if (!text) return [];
  return text.split(/\r?\n/).map((line) => line.length);
}

function renderLineCounts(target, text) {
  const counts = getLineCounts(text);
  target.innerHTML = "";
  counts.forEach((count) => {
    const div = document.createElement("div");
    div.textContent = String(count);
    if (count > 26) div.classList.add("line-count-over");
    target.appendChild(div);
  });
}

// ---- テーブル ----

function updateEmptyHint() {
  emptyHint.style.display = tableBody.children.length === 0 ? "" : "none";
}

function addRow(
  code = "",
  start = false,
  reset = false,
  show = false,
  bg = "",
  bgm = "",
  expressionChar = "",
  expression = "",
  name = "",
  dialogue = "",
) {
  const tr = document.createElement("tr");

  const tdCode = document.createElement("td");
  tdCode.appendChild(makeCodeSelect(code));

  const tdStart = document.createElement("td");
  tdStart.className = "td-checkbox";
  const startCheckbox = document.createElement("input");
  startCheckbox.type = "checkbox";
  startCheckbox.checked = start === true || start === "true";
  startCheckbox.addEventListener("change", () => scheduleAutoSave());
  tdStart.appendChild(startCheckbox);

  const tdReset = document.createElement("td");
  tdReset.className = "td-checkbox";
  const resetCheckbox = document.createElement("input");
  resetCheckbox.type = "checkbox";
  resetCheckbox.checked = reset === true || reset === "true";
  resetCheckbox.addEventListener("change", () => scheduleAutoSave());
  tdReset.appendChild(resetCheckbox);

  const tdShow = document.createElement("td");
  tdShow.className = "td-checkbox";
  const showCheckbox = document.createElement("input");
  showCheckbox.type = "checkbox";
  showCheckbox.checked = show === true || show === "true";
  showCheckbox.addEventListener("change", () => scheduleAutoSave());
  tdShow.appendChild(showCheckbox);

  const tdBg = document.createElement("td");
  tdBg.appendChild(makeBgSelect(bg));

  const tdBgm = document.createElement("td");
  tdBgm.appendChild(makeBgmSelect(bgm));

  const tdExpression = document.createElement("td");
  const effectiveExpressionChar = expressionChar || name;
  const expressionCharSelect = makeExpressionCharSelect(expressionChar, name);
  const expressionSelect = makeExpressionSelect(
    effectiveExpressionChar,
    expression,
  );

  expressionCharSelect.addEventListener("change", () => {
    const selectedChar = expressionCharSelect.value;
    fillExpressionSelectOptions(expressionSelect, selectedChar, "");
    applyCharHighlight(expressionCharSelect, selectedChar);
    scheduleAutoSave();
  });
  expressionSelect.addEventListener("change", () => scheduleAutoSave());

  tdExpression.appendChild(expressionCharSelect);
  tdExpression.appendChild(document.createElement("br"));
  tdExpression.appendChild(expressionSelect);

  const tdName = document.createElement("td");
  tdName.className = "col-name";
  const nameInput = makeTextarea(name);
  applyCharHighlight(nameInput, name);
  nameInput.addEventListener("input", () => {
    applyCharHighlight(nameInput, nameInput.value.trim());
  });
  tdName.appendChild(nameInput);

  const tdDialogue = document.createElement("td");
  const dialogueInput = makeTextarea(dialogue);
  tdDialogue.appendChild(dialogueInput);

  const tdCount = document.createElement("td");
  tdCount.className = "line-count";
  renderLineCounts(tdCount, dialogue);
  dialogueInput.addEventListener("input", () => {
    renderLineCounts(tdCount, dialogueInput.value);
  });

  tr.appendChild(tdCode);
  tr.appendChild(tdStart);
  tr.appendChild(tdReset);
  tr.appendChild(tdShow);
  tr.appendChild(tdBg);
  tr.appendChild(tdBgm);
  tr.appendChild(tdExpression);
  tr.appendChild(tdName);
  tr.appendChild(tdDialogue);
  tr.appendChild(tdCount);
  tableBody.appendChild(tr);
  autoResize(nameInput);
  autoResize(dialogueInput);
}

function renderTable(rows) {
  tableBody.innerHTML = "";
  rows.forEach((row) =>
    addRow(
      row.code ?? "",
      row.start ?? false,
      row.reset ?? false,
      row.show ?? false,
      row.bg ?? "",
      row.bgm ?? "",
      row.expression_char ?? row.name ?? "",
      row.expression ?? "",
      row.name ?? "",
      row.dialogue ?? "",
    ),
  );
  updateEmptyHint();
}
