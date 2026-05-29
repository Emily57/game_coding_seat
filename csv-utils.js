(() => {
  function decodeInlineBreaks(value) {
    return value.replace(/\[r\]/g, "\n");
  }

  function encodeInlineBreaks(value) {
    return value.replace(/\r?\n/g, "[r]");
  }

  function parseText(text) {
    return text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => {
        const rawCols = line.split("・");
        if (rawCols.length >= 10) {
          return {
            code: decodeInlineBreaks(rawCols[0] || ""),
            start: rawCols[1] === "true",
            reset: rawCols[2] === "true",
            show: rawCols[3] === "true",
            bg: decodeInlineBreaks(rawCols[4] || ""),
            bgm: decodeInlineBreaks(rawCols[5] || ""),
            expression_char: decodeInlineBreaks(rawCols[6] || ""),
            expression: decodeInlineBreaks(rawCols[7] || ""),
            name: decodeInlineBreaks(rawCols[8] || ""),
            dialogue: decodeInlineBreaks(rawCols.slice(9).join("・") || ""),
          };
        }

        const first = line.indexOf("・");
        if (first === -1) {
          return {
            code: "",
            start: false,
            reset: false,
            show: false,
            bg: "",
            bgm: "",
            expression_char: "",
            expression: "",
            name: "",
            dialogue: decodeInlineBreaks(line),
          };
        }

        const second = line.indexOf("・", first + 1);
        if (second === -1) {
          return {
            code: "",
            start: false,
            reset: false,
            show: false,
            bg: "",
            bgm: "",
            expression_char: "",
            expression: "",
            name: decodeInlineBreaks(line.slice(0, first)),
            dialogue: decodeInlineBreaks(line.slice(first + 1)),
          };
        }

        const third = line.indexOf("・", second + 1);
        if (third === -1) {
          const startVal = line.slice(0, first);
          return {
            code: "",
            start: startVal === "true",
            reset: false,
            show: false,
            bg: "",
            bgm: "",
            expression_char: "",
            expression: "",
            name: decodeInlineBreaks(line.slice(first + 1, second)),
            dialogue: decodeInlineBreaks(line.slice(second + 1)),
          };
        }

        const fourth = line.indexOf("・", third + 1);
        if (fourth === -1) {
          const startVal = line.slice(0, first);
          const resetVal = line.slice(first + 1, second);
          return {
            code: "",
            start: startVal === "true",
            reset: resetVal === "true",
            show: false,
            bg: "",
            bgm: "",
            expression_char: "",
            expression: "",
            name: decodeInlineBreaks(line.slice(second + 1, third)),
            dialogue: decodeInlineBreaks(line.slice(third + 1)),
          };
        }

        const fifth = line.indexOf("・", fourth + 1);
        if (fifth === -1) {
          const startVal = line.slice(0, first);
          const resetVal = line.slice(first + 1, second);
          const showVal = line.slice(second + 1, third);
          return {
            code: "",
            start: startVal === "true",
            reset: resetVal === "true",
            show: showVal === "true",
            bg: "",
            bgm: "",
            expression_char: "",
            expression: "",
            name: decodeInlineBreaks(line.slice(third + 1, fourth)),
            dialogue: decodeInlineBreaks(line.slice(fourth + 1)),
          };
        }

        const sixth = line.indexOf("・", fifth + 1);
        if (sixth === -1) {
          const startVal = line.slice(0, first);
          const resetVal = line.slice(first + 1, second);
          const showVal = line.slice(second + 1, third);
          return {
            code: "",
            start: startVal === "true",
            reset: resetVal === "true",
            show: showVal === "true",
            bg: decodeInlineBreaks(line.slice(third + 1, fourth)),
            bgm: "",
            expression_char: "",
            expression: "",
            name: decodeInlineBreaks(line.slice(fourth + 1, fifth)),
            dialogue: decodeInlineBreaks(line.slice(fifth + 1)),
          };
        }

        const seventh = line.indexOf("・", sixth + 1);
        if (seventh === -1) {
          const startVal = line.slice(0, first);
          const resetVal = line.slice(first + 1, second);
          const showVal = line.slice(second + 1, third);
          return {
            code: "",
            start: startVal === "true",
            reset: resetVal === "true",
            show: showVal === "true",
            bg: decodeInlineBreaks(line.slice(third + 1, fourth)),
            bgm: decodeInlineBreaks(line.slice(fourth + 1, fifth)),
            expression_char: "",
            expression: "",
            name: decodeInlineBreaks(line.slice(fifth + 1, sixth)),
            dialogue: decodeInlineBreaks(line.slice(sixth + 1)),
          };
        }

        const eighth = line.indexOf("・", seventh + 1);
        if (eighth === -1) {
          const startVal = line.slice(0, first);
          const resetVal = line.slice(first + 1, second);
          const showVal = line.slice(second + 1, third);
          return {
            code: "",
            start: startVal === "true",
            reset: resetVal === "true",
            show: showVal === "true",
            bg: decodeInlineBreaks(line.slice(third + 1, fourth)),
            bgm: decodeInlineBreaks(line.slice(fourth + 1, fifth)),
            expression_char: decodeInlineBreaks(line.slice(fifth + 1, sixth)),
            expression: "",
            name: decodeInlineBreaks(line.slice(sixth + 1, seventh)),
            dialogue: decodeInlineBreaks(line.slice(seventh + 1)),
          };
        }

        const ninth = line.indexOf("・", eighth + 1);
        if (ninth === -1) {
          const startVal = line.slice(0, first);
          const resetVal = line.slice(first + 1, second);
          const showVal = line.slice(second + 1, third);
          return {
            code: "",
            start: startVal === "true",
            reset: resetVal === "true",
            show: showVal === "true",
            bg: decodeInlineBreaks(line.slice(third + 1, fourth)),
            bgm: decodeInlineBreaks(line.slice(fourth + 1, fifth)),
            expression_char: decodeInlineBreaks(line.slice(fifth + 1, sixth)),
            expression: decodeInlineBreaks(line.slice(sixth + 1, seventh)),
            name: decodeInlineBreaks(line.slice(seventh + 1, eighth)),
            dialogue: decodeInlineBreaks(line.slice(eighth + 1)),
          };
        }

        const startVal = line.slice(0, first);
        const resetVal = line.slice(first + 1, second);
        const showVal = line.slice(second + 1, third);
        return {
          code: "",
          start: startVal === "true",
          reset: resetVal === "true",
          show: showVal === "true",
          bg: decodeInlineBreaks(line.slice(third + 1, fourth)),
          bgm: decodeInlineBreaks(line.slice(fourth + 1, fifth)),
          expression_char: decodeInlineBreaks(line.slice(fifth + 1, sixth)),
          expression: decodeInlineBreaks(line.slice(sixth + 1, seventh)),
          name: decodeInlineBreaks(line.slice(seventh + 1, eighth)),
          dialogue: decodeInlineBreaks(line.slice(eighth + 1, ninth)),
        };
      });
  }

  function parseNameMap(text) {
    const map = new Map();
    text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && !line.startsWith("#"))
      .forEach((line) => {
        const cols = line.split(/[\t,]/).map((col) => col.trim());
        if (cols.length < 2) return;
        const from = cols[0];
        const to = cols[1];
        if (!from || !to) return;
        map.set(from, to);
      });
    return map;
  }

  function parseNameConfig(text) {
    const normalizeMap = new Map();
    const windowMap = new Map();

    text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && !line.startsWith("#"))
      .forEach((line) => {
        const cols = line.split(/[\t,]/).map((col) => col.trim());
        if (cols.length < 2) return;

        const from = cols[0];
        const normalized = cols[1];
        const windowId = cols[2] || "";

        if (!from || !normalized) return;

        normalizeMap.set(from, normalized);
        if (windowId) {
          windowMap.set(from, windowId);
          windowMap.set(normalized, windowId);
        }
      });

    return { normalizeMap, windowMap };
  }

  window.CsvUtils = {
    decodeInlineBreaks,
    encodeInlineBreaks,
    parseText,
    parseNameMap,
    parseNameConfig,
  };
})();
