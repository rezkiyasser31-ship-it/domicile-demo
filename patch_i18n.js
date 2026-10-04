const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'assets', 'js', 'i18n.js');
let content = fs.readFileSync(filePath, 'utf8');

const newKeys = {
  "admin_demo_badge": { "fr": "Mode Démo", "en": "Demo Mode" },
  "admin_range_7": { "fr": "7 Jours", "en": "7 Days" },
  "admin_range_30": { "fr": "30 Jours", "en": "30 Days" },
  "admin_range_90": { "fr": "90 Jours", "en": "90 Days" },
  "admin_chart_visits": { "fr": "Visites & Clics WhatsApp", "en": "Visits & WhatsApp Clicks" },
  "admin_chart_traffic": { "fr": "Sources de Trafic", "en": "Traffic Sources" },
  "admin_chart_category": { "fr": "Vues par Catégorie", "en": "Views by Category" },
  "admin_feed_title": { "fr": "Activité Récente", "en": "Recent Activity" },
  "admin_export_csv": { "fr": "Exporter en CSV", "en": "Export to CSV" },
  "admin_inv_th_status": { "fr": "Statut", "en": "Status" },
  "status_in_stock": { "fr": "En stock", "en": "In stock" },
  "status_low_stock": { "fr": "Stock bas", "en": "Low stock" },
  "status_out_stock": { "fr": "Rupture", "en": "Out of stock" },
  "feed_1": { "fr": "Nouvelle visite sur Canapé Sahara", "en": "New visit on Sofa Sahara" },
  "feed_2": { "fr": "Clic WhatsApp depuis Showroom", "en": "WhatsApp click from Showroom" },
  "feed_3": { "fr": "Stock bas: Commode Nocturne", "en": "Low stock: Dresser Nocturne" },
  "time_5m": { "fr": "Il y a 5 min", "en": "5 mins ago" },
  "time_1h": { "fr": "Il y a 1 h", "en": "1 hour ago" },
  "time_3h": { "fr": "Il y a 3 h", "en": "3 hours ago" },
  "delta_visits_7": { "fr": "+12% vs semaine dernière", "en": "+12% vs last week" },
  "delta_wa_7": { "fr": "+5% vs semaine dernière", "en": "+5% vs last week" },
  "delta_lowstock_7": { "fr": "-2 vs semaine dernière", "en": "-2 vs last week" },
  "delta_top_7": { "fr": "Stable", "en": "Stable" },
  "delta_visits_30": { "fr": "+45% vs mois dernier", "en": "+45% vs last month" },
  "delta_wa_30": { "fr": "+20% vs mois dernier", "en": "+20% vs last month" },
  "delta_lowstock_30": { "fr": "+1 vs mois dernier", "en": "+1 vs last month" },
  "delta_top_30": { "fr": "Nouveau n°1", "en": "New #1" },
  "delta_visits_90": { "fr": "+120% vs trimestre dernier", "en": "+120% vs last quarter" },
  "delta_wa_90": { "fr": "+80% vs trimestre dernier", "en": "+80% vs last quarter" },
  "delta_lowstock_90": { "fr": "-5 vs trimestre dernier", "en": "-5 vs last quarter" },
  "delta_top_90": { "fr": "Maintien", "en": "Maintained" },
  "chart_label_visits": { "fr": "Visites", "en": "Visits" },
  "chart_label_wa": { "fr": "Clics WhatsApp", "en": "WhatsApp Clicks" },
  "chart_label_direct": { "fr": "Direct", "en": "Direct" },
  "chart_label_social": { "fr": "Social", "en": "Social" },
  "chart_label_salon": { "fr": "Salon", "en": "Living Room" },
  "chart_label_chambre": { "fr": "Chambre", "en": "Bedroom" },
  "chart_label_sam": { "fr": "Salle à manger", "en": "Dining Room" },
  "demo_alert_export": { "fr": "Ceci est une démo. L'export CSV a généré un fichier avec les données locales actuelles.", "en": "This is a demo. CSV export generated a file with current local data." },
  "admin_export_name": { "fr": "inventaire_domicile.csv", "en": "domicile_inventory.csv" }
};

const lastBraceIndex = content.lastIndexOf('};');
if (lastBraceIndex !== -1) {
  let newEntries = '';
  for (const [key, val] of Object.entries(newKeys)) {
    newEntries += `,\n  "${key}": ${JSON.stringify(val)}`;
  }
  content = content.slice(0, lastBraceIndex) + newEntries + '\n' + content.slice(lastBraceIndex);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('i18n.js updated successfully');
} else {
  console.log('Could not find the end of the dictionary object');
}
