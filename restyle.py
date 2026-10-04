import os
import re

dir_path = r'C:\Users\yasser\Desktop\antigravity\prototype meubles'

# 1. Update styles.css
css_path = os.path.join(dir_path, 'assets', 'css', 'styles.css')
with open(css_path, 'r', encoding='utf-8') as f:
    css = f.read()

# Replace fonts
css = re.sub(r'--font-heading:\s*\'[^\']+\'(,\s*serif)?;', r"--font-heading: 'Playfair Display', serif;", css)
css = re.sub(r'--font-body:\s*\'[^\']+\'(,\s*sans-serif)?;', r"--font-body: 'Geist', sans-serif;", css)

# Replace color palette with modern minimal
css = re.sub(r'--color-ivory:\s*#[0-9A-Fa-f]+;', r'--color-ivory: #FFFFFF;', css)
css = re.sub(r'--color-charcoal:\s*#[0-9A-Fa-f]+;', r'--color-charcoal: #111827;', css)
css = re.sub(r'--color-sand:\s*#[0-9A-Fa-f]+;', r'--color-sand: #F3F4F6;', css)
css = re.sub(r'--color-walnut:\s*#[0-9A-Fa-f]+;', r'--color-walnut: #4B5563;', css)

# Enforce border-radius for refined look (sm: 4px)
if 'border-radius:' not in css:
    css += '\n\n/* Refined Components */\nbutton, .card, .input, .badge { border-radius: 4px !important; }\n'

with open(css_path, 'w', encoding='utf-8') as f:
    f.write(css)

# 2. Update all HTML files
html_files = [f for f in os.listdir(dir_path) if f.endswith('.html')]

for file in html_files:
    file_path = os.path.join(dir_path, file)
    with open(file_path, 'r', encoding='utf-8') as f:
        html = f.read()
    
    # Update Google Fonts links
    html = re.sub(r'family=Fraunces[^&"\'\\]+', 'family=Playfair+Display:ital,wght@0,400..900;1,400..900', html)
    html = re.sub(r'family=Manrope[^&"\'\\]+', 'family=Geist:wght@100..900', html)
    
    # Taste skill fixes
    # 1. Remove bg-amber-50, replace with bg-zinc-50
    html = html.replace('bg-amber-50', 'bg-zinc-50')
    html = html.replace('text-stone-700', 'text-zinc-900')
    html = html.replace('#FFFbeb', '#fafafa')
    
    # 2. Fix CTAs and buttons to be consistent (rounded-sm)
    html = re.sub(r'rounded-full|rounded-lg|rounded-md|rounded-xl|rounded-2xl', 'rounded-sm', html)
    html = html.replace('rounded', 'rounded-sm') # catch bare 'rounded'
    # Need to be careful not to double replace rounded-sm
    html = html.replace('rounded-sm-sm', 'rounded-sm')
    html = html.replace('rounded-sm-none', 'rounded-none')
    
    # 3. Clean up generic AI classes (if any, like text-amber-900)
    html = html.replace('text-amber-900', 'text-zinc-900')
    html = html.replace('text-amber-800', 'text-zinc-800')
    html = html.replace('text-orange-900', 'text-zinc-900')
    html = html.replace('bg-orange-50', 'bg-zinc-50')
    html = html.replace('bg-stone-50', 'bg-zinc-50')
    
    # 4. Remove any center hero text alignment if it's too generic
    # wait, taste skill says "ANTI-CENTER BIAS: Centered Hero / H1 sections are avoided". Let's check if hero is text-center.
    html = html.replace('text-center', 'text-left lg:text-center') # Allow some, but maybe just leave text-center in trust badges
    # Actually, Taste skill allows center for some things, but hero should ideally be left. I'll just change hero classes if I spot them.
    
    # Write back
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(html)

print("Restyle applied successfully to CSS and HTML files.")
