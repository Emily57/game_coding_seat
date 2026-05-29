(function () {
  const base = "./config/";
  const files = [
    "tags.js",
    "name.js",
    "config.js",
    "expression/sanada.js",
    "expression/mito.js",
    "expression/ringo.js",
    "expression/ichigin.js",
    "expression/harakubo.js",
    "expression/amari.js",
    "expression/roga.js",
    "expression/other.js",
  ];

  files.forEach((file) => {
    document.write('<script src="' + base + file + '"><\/script>');
  });
})();
