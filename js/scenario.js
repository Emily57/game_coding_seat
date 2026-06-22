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
    const d = readRowData(tr);

    if (
      !d.code &&
      !d.start &&
      !d.reset &&
      !d.show &&
      !d.bg &&
      !d.bgm &&
      !d.expressionChar &&
      !d.expression &&
      !d.name &&
      !d.dialogue
    )
      return;

    const speaker = resolveSpeakerWindow(d.name);
    const commentLine = speaker.commentName ? `# ${speaker.commentName}\n` : "";
    const windowLine = d.dialogue ? `[${speaker.windowId}]\n` : "";
    const dialogueLine = d.dialogue ? formatDialogueText(d.dialogue) : "";
    const resetLine = d.reset ? "[chara_reset]\n" : "";
    const codeHasXxx = d.code && d.code.includes('"xxx"');
    const codeLine = d.code
      ? codeHasXxx && d.bg
        ? `${d.code.split('"xxx"').join(`"${d.bg}"`)}\n`
        : `${d.code}\n`
      : "";

    let expressionLine = "";
    if (d.expressionChar && d.expression) {
      const prefix = getCharacterExpressionPrefix(d.expressionChar);
      if (prefix) {
        const [base, face] = d.expression.split("/");
        if (base && face) {
          expressionLine = d.show
            ? `[${prefix}_mod base="${base}" face="${d.expression}"][${prefix}_show]\n`
            : `[${prefix}_mod base="${base}" face="${d.expression}"]\n`;
        }
      }
    }

    if (d.start) {
      const bgImage = d.bg || "black";
      const bgmTrack = d.bgm || "mute";
      const startLine = `[start_scenario bgimage="background/${bgImage}.jpg" bgm="${bgmTrack}.ogg"]\n`;
      blocks.push(
        `${codeLine}${startLine}${resetLine}${expressionLine}${windowLine}${commentLine}${dialogueLine}`.trimEnd(),
      );
    } else {
      const bgLine =
        d.bg && !codeHasXxx
          ? `[bg storage="background/${d.bg}.jpg" time="2000"]\n`
          : "";
      const bgmLine = d.bgm
        ? `[fadeinbgm storage="${d.bgm}.ogg" loop="true" time="2000"]\n`
        : "";
      blocks.push(
        `${codeLine}${bgLine}${bgmLine}${resetLine}${expressionLine}${windowLine}${commentLine}${dialogueLine}`.trimEnd(),
      );
    }
  });

  return blocks.join("\n\n") + (blocks.length > 0 ? "\n" : "");
}
