const fs = require('fs');
const css = fs.readFileSync('public/css/font-awesome-pro.min.css', 'utf8');

const icons = [
  'fa-facebook-f',
  'fa-instagram',
  'fa-x-twitter',
  'fa-linkedin-in',
  'fa-whatsapp',
  'fa-file-pdf',
  'fa-file-shield',
  'fa-times',
];

icons.forEach(icon => {
  // Search for .fa-icon-name:before{content:"xxx"} or as part of a comma list
  const needle = '.' + icon + ':before{content:';
  const idx = css.indexOf(needle);
  if (idx >= 0) {
    const chunk = css.slice(idx, idx + 100);
    const match = chunk.match(/content:"([^"]+)"/);
    console.log(icon + ' => ' + (match ? match[1] : 'N/A'));
  } else {
    // Try comma-separated alias (icon appears before another icon)
    // e.g. .fa-instagram,.fa-xxx:before{content:"xxx"}
    const re = new RegExp('\\.' + icon + '(?:,|:before)');
    const m = re.exec(css);
    if (m) {
      // Find the content after this position
      const chunk = css.slice(m.index, m.index + 200);
      const match = chunk.match(/content:"([^"]+)"/);
      console.log(icon + ' (alias) => ' + (match ? match[1] : 'N/A') + ' | ' + chunk.slice(0, 80));
    } else {
      console.log(icon + ' => NOT FOUND');
    }
  }
});
