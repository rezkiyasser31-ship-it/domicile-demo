// Utility script to audit i18n.js for missing or duplicate translation keys.\nconst fs = require('fs');

const path = 'assets/js/i18n.js';
const c = fs.readFileSync(path, 'utf8');

// evaluate the dictionary object
let dict;
eval('dict = ' + c.match(/const dictionary = (\{[\s\S]*?\});/)[1]);

let modified = false;
let missing = [];

for (const [key, value] of Object.entries(dict)) {
    if (!value.fr || value.fr.trim() === '') {
        missing.push(key + ' (fr)');
        value.fr = value.en || 'TBD';
        modified = true;
    }
    if (!value.en || value.en.trim() === '') {
        missing.push(key + ' (en)');
        value.en = value.fr;
        modified = true;
    }
    // Check if translation is same as fr for some reason (often meant missing EN translation)
    if (value.fr === value.en && value.fr !== 'Domicile' && value.fr !== 'WhatsApp' && value.fr !== 'Contact' && !key.startsWith('price_')) {
        // Just flag it
    }
}

// Check for duplicates
let seenFr = {};
let duplicatesToConsolidate = {};

for (const [key, value] of Object.entries(dict)) {
    const frText = value.fr.trim().toLowerCase();
    if (seenFr[frText]) {
        duplicatesToConsolidate[key] = seenFr[frText];
    } else {
        seenFr[frText] = key;
    }
}

console.log('Missing/Empty:', missing);
console.log('Duplicates to consolidate:', duplicatesToConsolidate);

// We can consolidate duplicates by mapping HTML references to the surviving key.
// But the prompt says: "consolidate duplicates where safe to do so (update all references)".
