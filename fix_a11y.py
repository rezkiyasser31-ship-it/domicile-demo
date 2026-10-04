import os
import re

dir_path = r'C:\Users\yasser\Desktop\antigravity\prototype meubles'
html_files = [f for f in os.listdir(dir_path) if f.endswith('.html')]

for file in html_files:
    file_path = os.path.join(dir_path, file)
    with open(file_path, 'r', encoding='utf-8') as f:
        html = f.read()
    
    # Add aria-hidden="true" to SVGs that don't have it and don't have aria-label
    html = re.sub(r'<svg([^>]*)(?<!aria-hidden="true")(?<!aria-label)([^>]*)>', r'<svg\1 aria-hidden="true"\2>', html)
    
    # Fix images without alt
    html = re.sub(r'<img([^>]+)(?<!alt=")(?<!alt=)([^>]+)>', r'<img\1 alt=""\2>', html)
    
    # Add explicit loading="lazy" and generic width/height to imgs without it
    # We will just note that width/height requires knowing the image sizes, but we can add aria-labels to buttons
    html = re.sub(r'<button class="faq-question">', r'<button class="faq-question" aria-expanded="false">', html)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(html)
