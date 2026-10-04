const fs = require('fs');

['showroom.html', 'collections.html'].forEach(file => {
  let h = fs.readFileSync(file, 'utf8');
  // Find where the product grid ends
  // Originally it was:
  // <!-- Product 6 --> ... </a>
  //   </div>
  // </div>
  // <!-- Product 7 --> ...
  
  // Let's just find "<!-- Product 7 -->" and move it and everything until "<div id="empty-state"" 
  // into the product grid.
  
  const startMatch = h.match(/(<\/div>\s*<\/div>)\s*(<!-- Product 7 -->)/);
  if (startMatch) {
    const endMatch = h.match(/(<!-- Product 42 -->[\s\S]*?<\/a>\s*)<div id="empty-state"/);
    if (endMatch) {
      // The cards are between startMatch[2] and endMatch[1]
      // Wait, let's just do it simpler:
      // Remove the </div></div> before Product 7, and insert it before empty-state.
      h = h.replace(/<\/div>\s*<\/div>\s*<!-- Product 7 -->/g, '<!-- Product 7 -->');
      h = h.replace(/(<div id="empty-state")/g, '  </div>\n</div>\n$1');
      fs.writeFileSync(file, h);
      console.log('Fixed', file);
    }
  }
});
