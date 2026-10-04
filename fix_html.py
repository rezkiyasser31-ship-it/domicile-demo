import os, glob, re

for f in glob.glob('*.html'):
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    content = re.sub(r'class="trust-badges-strip([^"]*)"\s+data-i18n="[^"]*"', r'class="trust-badges-strip\1"', content)
    
    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)
