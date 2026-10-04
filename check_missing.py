import os, glob, re, json
from bs4 import BeautifulSoup

for f in glob.glob('*.html'):
    with open(f, 'r', encoding='utf-8') as file:
        soup = BeautifulSoup(file, 'html.parser')
    
    missing = []
    # Find all visible text elements that don't have data-i18n
    for tag in soup.find_all(string=True):
        if tag.parent.name in ['script', 'style', 'meta', 'title', 'svg', 'path', 'circle', 'polyline', 'rect']:
            continue
        text = tag.strip()
        if not text:
            continue
        
        # Check if parent or any ancestor has data-i18n
        has_i18n = False
        p = tag.parent
        while p and p.name != '[document]':
            if p.has_attr('data-i18n'):
                has_i18n = True
                break
            p = p.parent
        
        if not has_i18n:
            # Only keep significant texts
            if len(text) > 2 and re.search('[a-zA-Z]', text):
                missing.append((tag.parent.name, text))
    
    if missing:
        print(f"Missing in {f}:")
        for m in missing:
            print(f"  {m[0]}: {m[1]}")
