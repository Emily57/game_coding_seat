// ---- テキスト生成 ----

function resolveSpeakerWindow(name) {
  const trimmed = (name ?? "").trim();
  if (!trimmed) return { windowId: "other_window", commentName: "" };

  const mapped = windowMap.get(trimmed);
  if (mapped) return { windowId: mapped, commentName: "" };

  const normalized = nameMap.get(trimmed) || trimmed;
  const mappedNormalized = windowMap.get(normalized);
  if (mappedNormalized) return { windowId: mappedNormalized, commentName: "" };

  return { windowId: "other_window", commentName: trimmed };
}

function formatDialogueText(dialogue) {
  const lines = dialogue.split(/\r?\n/);
  if (lines.length === 0) return "[p]";
  return lines
    .map((line, idx) => {
      const suffix = idx === lines.length - 1 ? "[p]" : "[r]";
      return `${line}${suffix}`;
    })
    .join("\n");
}

function buildScenarioText() {
  const blocks = [];

  Array.from(tableBody.querySelectorAll("tr")).forEach((tr) => {
    const codeSelect = tr.querySelector("select.code-select");
    const checkboxes = tr.querySelectorAll("input[type='checkbox']");
    const bgSelect = tr.querySelector("select.bg-select");
    const bgmSelect = tr.querySelector("select.bgm-select");
    const expressionCharSelect = tr.querySelector(
      "select.expression-char-select",
    );
    const expressionSelect = tr.querySelector("select.expression-select");
    const textareas = tr.querySelectorAll("textarea");
    if (textareas.length < 2) return;

    const code = codeSelect ? codeSelect.value.trim() : "";
    const isStart = checkboxes[0] ? checkboxes[0].checked : false;
    const isReset = checkboxes[1] ? checkboxes[1].checked : false;
    const isShow = checkboxes[2] ? checkboxes[2].checked : false;
    const bg = bgSelect ? bgSelect.value.trim() : "";
    const bgm = bgmSelect ? bgmSelect.value.trim() : "";
    const expressionChar = expressionCharSelect
      ? expressionCharSelect.value.trim()
      : "";
    const expression = expressionSelect ? expressionSelect.value.trim() : "";
    const name = textareas[0].value.trim();
    const dialogue = textareas[1].value.trim();

    if (
      !code &&
      !isStart &&
      !isReset &&
      !isShow &&
      !bg &&
      !bgm &&
      !expressionChar &&
      !expression &&
      !name &&
      !dialogue
    )
      return;

    const speaker = resolveSpeakerWindow(name);
    const commentLine = speaker.commentName ? `# ${speaker.commentName}\n` : "";
    const windowLine = dialogue ? `[${speaker.windowId}]\n` : "";
    const dialogueLine = dialogue ? formatDialogueText(dialogue) : "";
    const resetLine = isReset ? "[chara_reset]\n" : "";
    const codeLine = code ? `${code}\n` : "";

    let expressionLine = "";
    if (expressionChar && expression) {
      const prefix = getCharacterExpressionPrefix(expressionChar);
      if (prefix) {
        const [base, face] = expression.split("/");
        if (base && face) {
          expressionLine = isShow
            ? `[${prefix}_mod base="${base}" face="${expression}"][${prefix}_show]\n`
            : `[${prefix}_mod base="${base}" face="${expression}"]\n`;
        }
      }
    }

    if (isStart) {
      const bgImage = bg || "black";
      const bgmTrack = bgm || "mute";
      const startLine = `[start_scenario bgimage="background/${bgImage}.jpg" bgm="${bgmTrack}.ogg"]\n`;
      blocks.push(
        `${codeLine}${startLine}${resetLine}${expressionLine}${windowLine}${commentLine}${dialogueLine}`.trimEnd(),
      );
    } else {
      const bgLine = bg ? `[bg storage="background/${bg}.jpg"]\n` : "";
      const bgmLine = bgm
        ? `[fadeinbgm storage="${bgm}.ogg" loop="true"]\n`
        : "";
      blocks.push(
        `${codeLine}${bgLine}${bgmLine}${resetLine}${expressionLine}${windowLine}${commentLine}${dialogueLine}`.trimEnd(),
      );
    }
  });

  return blocks.join("\n\n") + (blocks.length > 0 ? "\n" : "");
}
