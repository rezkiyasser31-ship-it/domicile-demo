const fs = require('fs');
const path = require('path');

const pathI18n = path.join(__dirname, 'assets', 'js', 'i18n.js');
let i18nContent = fs.readFileSync(pathI18n, 'utf8');

let dict;
eval('dict = ' + i18nContent.match(/const dictionary = (\{[\s\S]*?\});/)[1]);

let seenFr = {};
let duplicatesToConsolidate = {};

for (const [key, value] of Object.entries(dict)) {
    const frText = value.fr.trim().toLowerCase();
    if (seenFr[frText]) {
        // Keep semantic keys over str_N keys
        let existing = seenFr[frText];
        if (key.startsWith('str_') && !existing.startsWith('str_')) {
            duplicatesToConsolidate[key] = existing;
        } else if (!key.startsWith('str_') && existing.startsWith('str_')) {
            duplicatesToConsolidate[existing] = key;
            seenFr[frText] = key; // Update the survivor
        } else {
            // both str or both semantic, keep the earlier one
            duplicatesToConsolidate[key] = existing;
        }
    } else {
        seenFr[frText] = key;
    }
}

// Special overrides to not break things that might have small variations
// or things we don't want to merge. (e.g. price and category titles if they accidentally match)

const filesToPatch = [
    'about.html', 'admin.html', 'collections.html', 'contact.html', 'index.html', 'product.html', 'services.html', 'showroom.html',
    'assets/js/main.js', 'assets/js/i18n.js'
];

for (let file of filesToPatch) {
    let p = path.join(__dirname, file);
    if (!fs.existsSync(p)) continue;
    
    let c = fs.readFileSync(p, 'utf8');
    
    for (const [oldKey, newKey] of Object.entries(duplicatesToConsolidate)) {
        // Replace in HTML and JS
        let regexHTML = new RegExp(`data-i18n="${oldKey}"`, 'g');
        c = c.replace(regexHTML, `data-i18n="${newKey}"`);
        
        let regexAria = new RegExp(`data-i18n-aria="${oldKey}"`, 'g');
        c = c.replace(regexAria, `data-i18n-aria="${newKey}"`);
        
        let regexContent = new RegExp(`data-i18n-content="${oldKey}"`, 'g');
        c = c.replace(regexContent, `data-i18n-content="${newKey}"`);
        
        let regexJS = new RegExp(`"${oldKey}"`, 'g');
        c = c.replace(regexJS, `"${newKey}"`);
    }
    
    fs.writeFileSync(p, c, 'utf8');
}

// Now remove the deleted keys from i18n.js completely
let cI18n = fs.readFileSync(pathI18n, 'utf8');
// To remove safely, we'll parse it out. Since regex can be tricky with multiline:
for (const oldKey of Object.keys(duplicatesToConsolidate)) {
    // pattern: "oldKey": { ... },\n
    let regex = new RegExp(`\\s*"${oldKey}":\\s*\\{[^}]+\\},?`, 'g');
    cI18n = cI18n.replace(regex, '');
}

// fix trailing comma if any
cI18n = cI18n.replace(/,\s*\}/g, '\n}');
fs.writeFileSync(pathI18n, cI18n, 'utf8');
console.log('Consolidated', Object.keys(duplicatesToConsolidate).length, 'duplicates');

