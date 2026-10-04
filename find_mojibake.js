const fs = require('fs');
const path = require('path');

function walk(dir, done) {
  let results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    let i = 0;
    (function next() {
      let file = list[i++];
      if (!file) return done(null, results);
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory() && !file.includes('node_modules') && !file.includes('.git')) {
          walk(file, function(err, res) {
            results = results.concat(res);
            next();
          });
        } else {
          if (file.endsWith('.js') || file.endsWith('.html')) {
            results.push(file);
          }
          next();
        }
      });
    })();
  });
}

walk(process.cwd(), function(err, results) {
  if (err) throw err;
  results.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, i) => {
      if (line.includes('\uFFFD')) {
        console.log(`${file}:${i + 1} - ${line.trim()}`);
      }
    });
  });
});
