window.AppConfig = {
  bgImages: window.BgImages || [],
  bgmList: window.BgmList || [],
  expressionTransitionIgnoreName: "味摘 林檎",
  getExpressionsMap() {
    return {
      sanada: window.CharacterExpressions?.sanada || [],
      mito: window.CharacterExpressions?.mito || [],
      ringo: window.CharacterExpressions?.ringo || [],
      ichigin: window.CharacterExpressions?.ichigin || [],
      harakubo: window.CharacterExpressions?.harakubo || [],
      amari: window.CharacterExpressions?.amari || [],
      roga: window.CharacterExpressions?.roga || [],
      other: window.CharacterExpressions?.other || [],
    };
  },
};
