import re

file_path = 'assets/js/i18n.js'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    '"str_104": {\n    "fr": "Paiement à la livraison",\n    "en": "Paiement à la livraison"\n  }',
    '"str_104": {\n    "fr": "Paiement à la livraison",\n    "en": "Cash on Delivery"\n  }'
)
content = content.replace(
    '"str_18": {\n    "fr": "Livraison via Yalidine - 58 wilayas",\n    "en": "Livraison via Yalidine - 58 wilayas"\n  }',
    '"str_18": {\n    "fr": "Livraison via Yalidine - 58 wilayas",\n    "en": "Delivery via Yalidine - 58 wilayas"\n  }'
)
content = content.replace(
    '"str_63": {\n    "fr": "Garantie 2 ans",\n    "en": "Garantie 2 ans"\n  }',
    '"str_63": {\n    "fr": "Garantie 2 ans",\n    "en": "2 Years Warranty"\n  }'
)
content = content.replace(
    '"str_87": {\n    "fr": "Réponse rapide sur WhatsApp",\n    "en": "Réponse rapide sur WhatsApp"\n  }',
    '"str_87": {\n    "fr": "Réponse rapide sur WhatsApp",\n    "en": "Fast Response on WhatsApp"\n  }'
)

new_keys = """  ,
  "filter_all_mats": {
    "fr": "Tous matériaux",
    "en": "All materials"
  },
  "mat_bois": {
    "fr": "Bois",
    "en": "Wood"
  },
  "mat_velours": {
    "fr": "Velours",
    "en": "Velvet"
  },
  "mat_metal": {
    "fr": "Métal",
    "en": "Metal"
  },
  "mat_tissu": {
    "fr": "Tissu",
    "en": "Fabric"
  },
  "sort_price": {
    "fr": "Trier par prix",
    "en": "Sort by price"
  },
  "sort_low": {
    "fr": "Prix croissant",
    "en": "Price: Low to High"
  },
  "sort_high": {
    "fr": "Prix décroissant",
    "en": "Price: High to Low"
  }
};"""

content = content.replace('};', new_keys, 1)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
