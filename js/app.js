// ---- DOM参照 ----
var openArea = document.getElementById("open-area");
var toolbar = document.getElementById("toolbar");
var tableWrapper = document.getElementById("table-wrapper");
var tableBody = document.getElementById("table-body");
var emptyHint = document.getElementById("empty-hint");
var fileNameLabel = document.getElementById("filename-label");
var saveStatus = document.getElementById("save-status");
var outputWrapper = document.getElementById("output-wrapper");
var outputText = document.getElementById("output-text");
var copyOutputBtn = document.getElementById("copy-output-btn");

// ---- 共有状態 ----
var fileHandle = null;
var nameMap = new Map();
var windowMap = new Map();
var bgImageOptions = [];
var saveTimer = null;

// ---- ファイル読み込み ----

function parseBgImageList(text) {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("#"));
}

async function loadBgImages() {
  if (window.AppConfig && Array.isArray(window.AppConfig.bgImages)) {
    bgImageOptions = window.AppConfig.bgImages.slice();
    return;
  }
  throw new Error("config/config.js が読み込まれていません");
}

async function loadNameMap() {
  if (!Array.isArray(window.NameList)) {
    throw new Error("config/name.js が読み込まれていません");
  }
  nameMap = new Map();
  windowMap = new Map();
  for (const [from, normalized, windowId] of window.NameList) {
    if (!from || !normalized) continue;
    nameMap.set(from, normalized);
    if (windowId) {
      windowMap.set(from, windowId);
      windowMap.set(normalized, windowId);
    }
  }
}

// ---- 表示切り替え ----

function showOpenArea(msg) {
  if (msg) document.getElementById("open-msg").textContent = msg;
  openArea.style.display = "";
  toolbar.style.display = "none";
  tableWrapper.style.display = "none";
}

async function loadFromHandle() {
  const file = await fileHandle.getFile();
  fileNameLabel.textContent = file.name;
  const text = await file.text();
  try {
    await loadBgImages();
  } catch (e) {
    bgImageOptions = [];
  }
  renderTable(window.CsvUtils.parseText(text));
  openArea.style.display = "none";
  toolbar.style.display = "";
  tableWrapper.style.display = "";
}

// ---- 起動時に自動読み込み ----

async function tryAutoLoad() {
  const handle = await loadHandle("editcsv").catch(() => null);
  if (!handle) {
    showOpenArea();
    return;
  }

  const perm = await handle.queryPermission({ mode: "readwrite" });
  if (perm === "granted") {
    fileHandle = handle;
    try {
      await loadFromHandle();
    } catch (e) {
      fileHandle = null;
      await deleteHandle("editcsv").catch(() => {});
      showOpenArea(
        "edit.csv が見つからないため、もう一度ファイルを選択してください。",
      );
    }
  } else {
    fileHandle = handle;
    showOpenArea(
      "edit.csv への権限が必要です。\nボタンを押して許可してください。",
    );
  }
}

// ---- 自動保存（debounce 800ms） ----

function scheduleAutoSave() {
  clearTimeout(saveTimer);
  saveStatus.textContent = "編集中…";
  saveTimer = setTimeout(autoSave, 800);
}

async function autoSave() {
  if (!fileHandle) return;

  const rows = Array.from(tableBody.querySelectorAll("tr")).map((tr) => {
    const codeSelect = tr.querySelector("select.code-select");
    const checkboxes = tr.querySelectorAll("input[type='checkbox']");
    const bgSelect = tr.querySelector("select.bg-select");
    const bgmSelect = tr.querySelector("select.bgm-select");
    const expressionCharSelect = tr.querySelector(
      "select.expression-char-select",
    );
    const expressionSelect = tr.querySelector("select.expression-select");
    const textareas = tr.querySelectorAll("textarea");

    const code = codeSelect
      ? window.CsvUtils.encodeInlineBreaks(codeSelect.value.trim())
      : "";
    const start = checkboxes[0]
      ? checkboxes[0].checked
        ? "true"
        : "false"
      : "false";
    const reset = checkboxes[1]
      ? checkboxes[1].checked
        ? "true"
        : "false"
      : "false";
    const show = checkboxes[2]
      ? checkboxes[2].checked
        ? "true"
        : "false"
      : "false";
    const bg = bgSelect
      ? window.CsvUtils.encodeInlineBreaks(bgSelect.value.trim())
      : "";
    const bgm = bgmSelect
      ? window.CsvUtils.encodeInlineBreaks(bgmSelect.value.trim())
      : "";
    const expressionChar = expressionCharSelect
      ? window.CsvUtils.encodeInlineBreaks(expressionCharSelect.value.trim())
      : "";
    const expression = expressionSelect
      ? window.CsvUtils.encodeInlineBreaks(expressionSelect.value.trim())
      : "";
    const name = window.CsvUtils.encodeInlineBreaks(textareas[0].value.trim());
    const dialogue = window.CsvUtils.encodeInlineBreaks(
      textareas[1].value.trim(),
    );

    const parts = [
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
    ];
    return parts.join("・");
  });

  const content = rows.join("\n") + "\n";
  try {
    const writable = await fileHandle.createWritable();
    await writable.write(content);
    await writable.close();
    saveStatus.textContent = "保存済み ✓";
    setTimeout(() => {
      saveStatus.textContent = "";
    }, 2000);
  } catch (e) {
    saveStatus.textContent = "保存失敗";
  }
}

// ---- テキスト出力 ----

function renderOutputText(content) {
  outputText.value = content;
  outputWrapper.style.display = "";
  outputText.focus();
  outputText.setSelectionRange(0, outputText.value.length);
}

async function copyOutputText() {
  const text = outputText.value;
  if (!text) {
    saveStatus.textContent = "コピー対象なし";
    return;
  }
  try {
    await navigator.clipboard.writeText(text);
    saveStatus.textContent = "コピー完了";
  } catch (e) {
    outputText.focus();
    outputText.select();
    const ok = document.execCommand("copy");
    saveStatus.textContent = ok ? "コピー完了" : "コピー失敗";
  }
}

// ---- イベントハンドラ ----

document.getElementById("open-btn").addEventListener("click", async () => {
  try {
    if (fileHandle) {
      const perm = await fileHandle.requestPermission({ mode: "readwrite" });
      if (perm === "granted") {
        try {
          await loadFromHandle();
          return;
        } catch (e) {
          fileHandle = null;
          await deleteHandle("editcsv").catch(() => {});
        }
      }
    }
    [fileHandle] = await window.showOpenFilePicker({
      types: [
        { description: "CSV/Text", accept: { "text/plain": [".csv", ".txt"] } },
      ],
      multiple: false,
    });
    await saveHandle("editcsv", fileHandle);
    await loadFromHandle();
  } catch (e) {
    if (e.name !== "AbortError")
      alert("ファイルを開けませんでした: " + e.message);
  }
});

document.getElementById("add-row-btn").addEventListener("click", () => {
  addRow();
  updateEmptyHint();
  scheduleAutoSave();
});

document
  .getElementById("export-txt-btn")
  .addEventListener("click", async () => {
    try {
      await loadNameMap();
    } catch (e) {
      saveStatus.textContent = "config/name.js 読み込み失敗";
      return;
    }
    renderOutputText(buildScenarioText());
    saveStatus.textContent = "テキスト生成完了";
  });

copyOutputBtn.addEventListener("click", () => copyOutputText());

document
  .getElementById("normalize-names-btn")
  .addEventListener("click", async () => {
    try {
      await loadNameMap();
    } catch (e) {
      saveStatus.textContent = "config/name.js 読み込み失敗";
      return;
    }

    let changed = 0;
    const rows = Array.from(tableBody.querySelectorAll("tr"));

    // 名前の一括変換
    rows.forEach((tr) => {
      const nameInput = tr.querySelector(".col-name textarea");
      if (!nameInput) return;
      const currentName = nameInput.value.trim();
      const normalized = nameMap.get(currentName);
      if (!normalized || normalized === currentName) return;
      nameInput.value = normalized;
      autoResize(nameInput);
      changed += 1;
    });

    // 立ち絵人物が変わった行のreset/showをtrueに
    // 指定キャラは演出上の例外として自動付与対象から除外する
    const transitionIgnoreName =
      window.AppConfig?.expressionTransitionIgnoreName || "";
    let prevExpressionChar = null;
    rows.forEach((tr, index) => {
      const expressionCharSelect = tr.querySelector(
        "select.expression-char-select",
      );
      if (!expressionCharSelect) return;
      const currentChar = expressionCharSelect.value.trim();

      if (index === 0) {
        prevExpressionChar = currentChar;
        return;
      }

      const isIgnoredChar =
        transitionIgnoreName && currentChar === transitionIgnoreName;
      const prevIsIgnoredChar =
        transitionIgnoreName && prevExpressionChar === transitionIgnoreName;

      if (
        !isIgnoredChar &&
        !prevIsIgnoredChar &&
        currentChar &&
        prevExpressionChar &&
        currentChar !== prevExpressionChar
      ) {
        const checkboxes = tr.querySelectorAll("input[type='checkbox']");
        if (checkboxes[1] && !checkboxes[1].checked) {
          checkboxes[1].checked = true;
          changed += 1;
        }
        if (checkboxes[2] && !checkboxes[2].checked) {
          checkboxes[2].checked = true;
          changed += 1;
        }
      }

      prevExpressionChar = currentChar;
    });

    if (changed > 0) {
      saveStatus.textContent = `自動修正: ${changed}件`;
      scheduleAutoSave();
      return;
    }
    saveStatus.textContent = "修正対象なし";
  });

// ---- 起動 ----
tryAutoLoad();
