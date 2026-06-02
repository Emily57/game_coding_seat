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

// ---- カテゴリ（/の前の部分）ヘルパー ----

function getExpressionCategories(charName) {
  if (!charName) return [];
  const prefix = getCharacterExpressionPrefix(charName);
  if (!prefix) return [];
  const expressions = window.AppConfig.getExpressionsMap()[prefix] || [];
  const seen = new Set();
  const categories = [];
  expressions.forEach((expr) => {
    const slashIdx = expr.indexOf("/");
    if (slashIdx !== -1) {
      const cat = expr.slice(0, slashIdx);
      if (!seen.has(cat)) {
        seen.add(cat);
        categories.push(cat);
      }
    }
  });
  return categories;
}

function getSubExpressions(charName, category) {
  if (!charName || !category) return [];
  const prefix = getCharacterExpressionPrefix(charName);
  if (!prefix) return [];
  const expressions = window.AppConfig.getExpressionsMap()[prefix] || [];
  const catPrefix = category + "/";
  const subs = [];
  expressions.forEach((expr) => {
    if (expr.startsWith(catPrefix)) {
      subs.push(expr.slice(catPrefix.length));
    }
  });
  return subs;
}

function fillExpressionCategoryOptions(select, charName, currentCategory) {
  select.innerHTML = "";
  const nullOption = document.createElement("option");
  nullOption.value = "";
  nullOption.textContent = "";
  select.appendChild(nullOption);

  getExpressionCategories(charName).forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    select.appendChild(option);
  });
  select.value = currentCategory || "";
}

function makeExpressionCategorySelect(charName, currentCategory) {
  const select = document.createElement("select");
  select.className = "expression-category-select";
  select.style.width = "100%";
  select.style.marginBottom = "4px";
  fillExpressionCategoryOptions(select, charName, currentCategory || "");
  return select;
}

// ---- 表情セレクト（/ 以降の部分） ----

function fillExpressionSelectOptions(
  select,
  charName,
  category,
  currentExpression,
) {
  select.innerHTML = "";
  const nullOption = document.createElement("option");
  nullOption.value = "";
  nullOption.textContent = "";
  select.appendChild(nullOption);

  if (!charName || !category) return;

  getSubExpressions(charName, category).forEach((sub) => {
    const option = document.createElement("option");
    option.value = sub;
    option.textContent = sub;
    select.appendChild(option);
  });
  select.value = currentExpression || "";
}

function makeExpressionSelect(charName, category, currentExpression) {
  const select = document.createElement("select");
  select.className = "expression-select";
  select.style.width = "100%";
  fillExpressionSelectOptions(
    select,
    charName || "",
    category || "",
    currentExpression || "",
  );
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

// ---- テーブル部品 ----

function updateEmptyHint() {
  emptyHint.style.display = tableBody.children.length === 0 ? "" : "none";
}

function makeTdCheckbox(checked) {
  const td = document.createElement("td");
  td.className = "td-checkbox";
  const cb = document.createElement("input");
  cb.type = "checkbox";
  cb.checked = checked === true || checked === "true";
  cb.addEventListener("change", () => scheduleAutoSave());
  td.appendChild(cb);
  return td;
}

function makeTdExpression(expressionChar, expression, name) {
  const td = document.createElement("td");
  const effectiveChar = expressionChar || name;

  let currentCategory = "";
  let currentSub = "";
  if (expression) {
    const slashIdx = expression.indexOf("/");
    if (slashIdx !== -1) {
      currentCategory = expression.slice(0, slashIdx);
      currentSub = expression.slice(slashIdx + 1);
    } else {
      currentCategory = expression;
    }
  }

  const charSelect = makeExpressionCharSelect(expressionChar, name);
  const categorySelect = makeExpressionCategorySelect(
    effectiveChar,
    currentCategory,
  );
  const exprSelect = makeExpressionSelect(
    effectiveChar,
    currentCategory,
    currentSub,
  );

  charSelect.addEventListener("change", () => {
    const selected = charSelect.value;
    fillExpressionCategoryOptions(categorySelect, selected, "");
    const categories = getExpressionCategories(selected);
    if (categories.includes("normal")) {
      categorySelect.value = "normal";
    }
    fillExpressionSelectOptions(
      exprSelect,
      selected,
      categorySelect.value,
      "",
    );
    applyCharHighlight(charSelect, selected);
    scheduleAutoSave();
  });
  categorySelect.addEventListener("change", () => {
    fillExpressionSelectOptions(
      exprSelect,
      charSelect.value,
      categorySelect.value,
      "",
    );
    scheduleAutoSave();
  });
  exprSelect.addEventListener("change", () => scheduleAutoSave());

  td.appendChild(charSelect);
  td.appendChild(categorySelect);
  td.appendChild(exprSelect);
  return td;
}

// ---- テーブル行 ----

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

  const tdBg = document.createElement("td");
  tdBg.appendChild(makeBgSelect(bg));

  const tdBgm = document.createElement("td");
  tdBgm.appendChild(makeBgmSelect(bgm));

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
  tr.appendChild(makeTdCheckbox(start));
  tr.appendChild(makeTdCheckbox(reset));
  tr.appendChild(makeTdCheckbox(show));
  tr.appendChild(tdBg);
  tr.appendChild(tdBgm);
  tr.appendChild(makeTdExpression(expressionChar, expression, name));
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
