const fs = require('fs');

const replacements = {
  "Disponibilit\uFFFD": "Disponibilité",
  "Aucun produit ne correspond \uFFFD vos filtres.": "Aucun produit ne correspond à vos filtres.",
  "int\uFFFDress\uFFFD(e)": "intéressé(e)",
  "Canap\uFFFD": "Canapé",
  "Table \uFFFD Manger": "Table à Manger",
  "Buffet M\uFFFDditerran\uFFFDe": "Buffet Méditerranée",
  "M\uFFFDditerran\uFFFDe": "Méditerranée"
};

const files = [
  "assets/js/i18n.js",
  "assets/js/main.js",
  "collections.html",
  "showroom.html"
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  for (const [bad, good] of Object.entries(replacements)) {
    // replace all occurrences of `bad` with `good`
    content = content.split(bad).join(good);
  }
  fs.writeFileSync(file, content, 'utf8');
});

console.log("Replacements done");
