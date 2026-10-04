import os
file_path = 'collections.html'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('<option value="all">Tous matériaux</option>', '<option value="all" data-i18n="filter_all_mats">Tous matériaux</option>')
content = content.replace('<option value="bois">Bois</option>', '<option value="bois" data-i18n="mat_bois">Bois</option>')
content = content.replace('<option value="velours">Velours</option>', '<option value="velours" data-i18n="mat_velours">Velours</option>')
content = content.replace('<option value="metal">Métal</option>', '<option value="metal" data-i18n="mat_metal">Métal</option>')
content = content.replace('<option value="tissu">Tissu</option>', '<option value="tissu" data-i18n="mat_tissu">Tissu</option>')

content = content.replace('<option value="none">Trier par prix</option>', '<option value="none" data-i18n="sort_price">Trier par prix</option>')
content = content.replace('<option value="low">Prix croissant</option>', '<option value="low" data-i18n="sort_low">Prix croissant</option>')
content = content.replace('<option value="high">Prix décroissant</option>', '<option value="high" data-i18n="sort_high">Prix décroissant</option>')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
