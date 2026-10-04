const fs = require('fs');

const materials = ['bois', 'velours', 'metal', 'tissu'];
const categories = ['Salon', 'Chambre', 'Salle A manger'];
const catToHtml = {
  'Salon': 'salon',
  'Chambre': 'chambre',
  'Salle A manger': 'salle-a-manger'
};
const catToImg = {
  'Salon': ['assets/img/salon-1.jpg', 'assets/img/salon-2.jpg'],
  'Chambre': ['assets/img/chambre-1.jpg', 'assets/img/chambre-2.jpg'],
  'Salle A manger': ['assets/img/salle-a-manger-1.jpg', 'assets/img/salle-a-manger-2.jpg']
};

const elegantNames = {
  'Salon': {
    'bois': ['Table Basse Carthage', 'Meuble TV Andalousie', 'Bibliotheque Byblos'],
    'velours': ['Canape Casablanca', 'Fauteuil Alger', 'Pouf Tanger'],
    'metal': ['Bout de Canape Fer forge', "Table d'Appoint Oran", 'Etagere Constantine'],
    'tissu': ["Canape d'Angle Tunis", 'Meridienne Tipaza', 'Fauteuil Club Bejaia']
  },
  'Chambre': {
    'bois': ['Lit Double Cedre', 'Armoire Antique', 'Table de Chevet Atlas'],
    'velours': ['Tete de Lit Velours', 'Banquette de Lit', 'Fauteuil de Chambre'],
    'metal': ['Lit Forge Tlemcen', 'Porte-Vetements Cuivre', 'Miroir sur Pied'],
    'tissu': ['Lit Tapissier', 'Bout de Lit Tissu', 'Fauteuil Relax']
  },
  'Salle A manger': {
    'bois': ['Table Rustique Noyer', 'Chaise Bistrot', 'Vaisselier Massif'],
    'velours': ['Chaise Velours Royal', 'Fauteuil de Table', 'Banquette Capitonnee'],
    'metal': ['Table Industrielle', 'Chaise Metal Noir', 'Desserte Roulante'],
    'tissu': ['Chaise Tissu Lin', 'Fauteuil Repas', 'Housse de Chaise']
  }
};

let i18nEntries = {};
let newCatalogEntries = {};
let newHtmlCards = '';

let pId = 7;
for (let c of categories) {
  for (let m of materials) {
    let numProducts = 3; 
    for (let i = 0; i < numProducts; i++) {
      let id = `p${pId}`;
      let inStock = (i % 2 === 0);
      let stockCount = inStock ? (Math.floor(Math.random() * 20) + 1) : 0;
      let price = (Math.floor(Math.random() * 80) + 20) * 1000;
      
      let baseName = elegantNames[c][m][i % elegantNames[c][m].length];
      let titleFr = `${baseName}`;
      let titleEn = `${baseName} (EN)`;
      let descFr = `Magnifique creation pour votre ${c} avec finition en ${m}.`;
      let descEn = `Beautiful piece for your ${c} with ${m} finish.`;
      let titleKey = `str_new_${pId}_t`;
      let descKey = `str_new_${pId}_d`;
      let priceKey = `price_new_${pId}`;
      
      i18nEntries[titleKey] = { fr: titleFr, en: titleEn };
      i18nEntries[descKey] = { fr: descFr, en: descEn };
      i18nEntries[priceKey] = { fr: `${price} DA`, en: `${price} DA` };
      
      let img = catToImg[c][i % 2];
      
      newCatalogEntries[id] = {
        obj: `{
            title: "${titleFr}",
            price: "${price} DA",
            desc: "${descFr}",
            img: "${img}",
            cat: "${c}",
            dims: { w: 100, h: 100, d: 100 },
            stock: ${stockCount}
        }, title_key: "${titleKey}", desc_key: "${descKey}", price_key: "${priceKey}"`
      };
      
      newHtmlCards += `<!-- Product ${pId} -->
<a class="product-card" data-category="${catToHtml[c]}" data-id="${id}" data-stock="${stockCount}" data-title="${titleFr}" data-material="${m}" data-price="${price}" href="product.html?id=${id}" style="position: relative;">
  <button class="wishlist-btn" data-id="${id}" style="position: absolute; top: 10px; right: 10px; background: white; border: none; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.1); font-size: 20px; z-index: 10;">
    <svg fill="none" height="20" stroke="currentColor" stroke-width="2" viewbox="0 0 24 24" width="20"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
  </button>
  <div class="product-image"><img alt="${titleFr}" src="${img}" loading="lazy" width="800" height="600"></div>
  <div class="product-info">
    <div class="product-category" data-i18n="cat_${catToHtml[c].replace(/-/g, '_')}">${c}</div>
    <h3 class="product-title" data-i18n="${titleKey}">${titleFr}</h3>
    <p class="product-desc" data-i18n="${descKey}">${descFr}</p>
    <div class="product-price" data-i18n="${priceKey}">${price} DA</div>
  </div>
</a>\n`;

      pId++;
    }
  }
}

// Update i18n.js
let i18nContent = fs.readFileSync('assets/js/i18n.js', 'utf8');
let i18nLines = [];
for (let [key, val] of Object.entries(i18nEntries)) {
  i18nLines.push(`  "${key}": ${JSON.stringify(val)}`);
}
i18nContent = i18nContent.replace('const dictionary = {', 'const dictionary = {\n' + i18nLines.join(',\n') + ',');
fs.writeFileSync('assets/js/i18n.js', i18nContent);

// Update main.js
let mainContent = fs.readFileSync('assets/js/main.js', 'utf8');
let catEntries = [];
for (let [id, val] of Object.entries(newCatalogEntries)) {
  catEntries.push(`        '${id}': ${val.obj}`);
}
mainContent = mainContent.replace(/(price_key: "price_95k"\s*)/, `$1,\n${catEntries.join(',\n')}`);
fs.writeFileSync('assets/js/main.js', mainContent);

// Update HTML files
['showroom.html', 'collections.html'].forEach(file => {
  let html = fs.readFileSync(file, 'utf8');
  html = html.replace(/(<div id="empty-state")/, newHtmlCards + '\n$1');
  fs.writeFileSync(file, html);
});

console.log(`Added ${pId - 7} products.`);
