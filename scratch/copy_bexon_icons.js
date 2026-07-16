const fs = require('fs');
let css = fs.readFileSync('src/app/assets/css/bexon-icons.css', 'utf8');
// Fix font paths from relative ../fonts/ to absolute /fonts/
css = css.split('../fonts/').join('/fonts/');
fs.writeFileSync('public/css/bexon-icons.css', css);
console.log('Written', css.length, 'bytes to public/css/bexon-icons.css');
