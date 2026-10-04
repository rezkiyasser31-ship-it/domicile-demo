const fs = require('fs');
let mainJs = fs.readFileSync('assets/js/main.js', 'utf8');

const oldLogic = `// Update WhatsApp
        const waBtn = document.querySelector('a.btn[href*="wa.me"]');
        if (waBtn) {
            const msg = encodeURIComponent("Bonjour, je suis intAcressAc(e) par le produit.");
            waBtn.href = "https://wa.me/213555000000?text=" + msg;
        }`;

const idx = mainJs.indexOf('// Update WhatsApp');
if (idx !== -1) {
    const endIdx = mainJs.indexOf('}', idx) + 1;
    const waNew = `// Update WhatsApp
        const waBtn = document.querySelector('a.btn[href*="wa.me"]');
        if (waBtn) {
            const updateWaLink = () => {
                const lang = localStorage.getItem('site_lang') || 'fr';
                const msgTemplate = (typeof dictionary !== 'undefined' && dictionary['wa_prefill_msg']) ? dictionary['wa_prefill_msg'][lang] : "Bonjour, je suis intéressé(e) par le produit {name} ({price}).";
                const pName = (typeof dictionary !== 'undefined' && dictionary[p.title_key]) ? dictionary[p.title_key][lang] : p.title;
                const pPrice = (typeof dictionary !== 'undefined' && dictionary[p.price_key]) ? dictionary[p.price_key][lang] : p.price;
                const msg = msgTemplate.replace('{name}', pName).replace('{price}', pPrice);
                waBtn.href = "https://wa.me/213555000000?text=" + encodeURIComponent(msg);
                waBtn.setAttribute('data-wa-dynamic', 'true');
            };
            updateWaLink();
            document.addEventListener('retranslate', updateWaLink);
        }`;
    mainJs = mainJs.substring(0, idx) + waNew + mainJs.substring(endIdx);
    fs.writeFileSync('assets/js/main.js', mainJs, 'utf8');
    console.log('Replaced successfully');
}
