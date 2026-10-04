import os
import re

dir_path = r'C:\Users\yasser\Desktop\antigravity\prototype meubles'
html_files = [f for f in os.listdir(dir_path) if f.endswith('.html')]

print("Web Design Guidelines Audit Results:")

for file in html_files:
    file_path = os.path.join(dir_path, file)
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    for i, line in enumerate(lines):
        line_num = i + 1
        # Check images
        if '<img ' in line:
            if 'alt=' not in line:
                print(f"{file}:{line_num} - Image missing alt attribute")
            if 'width=' not in line or 'height=' not in line:
                if 'class=' not in line or ('w-' not in line and 'h-' not in line): # Simple heuristic
                    print(f"{file}:{line_num} - Image missing explicit width/height")
        
        # Check SVGs
        if '<svg ' in line:
            if 'aria-hidden' not in line and 'aria-label' not in line and 'role="img"' not in line:
                print(f"{file}:{line_num} - SVG might need aria-hidden='true' or aria-label")
        
        # Check buttons
        if '<button' in line:
            if 'aria-label=' not in line and not re.search(r'>[^<]+</button>', line):
                print(f"{file}:{line_num} - Button might be icon-only but missing aria-label")

        # Check forms
        if '<input ' in line:
            if 'aria-label=' not in line and 'id=' not in line:
                print(f"{file}:{line_num} - Input missing aria-label or id for label mapping")
