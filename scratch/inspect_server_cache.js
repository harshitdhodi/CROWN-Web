const fs = require('fs');
const path = require('path');

function findFiles(dir, filter) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(findFiles(filePath, filter));
    } else if (filter(filePath)) {
      results.push(filePath);
    }
  });
  return results;
}

const serverDir = path.join(__dirname, '../.next/server');
const allHtmlAndJson = findFiles(serverDir, f => f.endsWith('.json') || f.endsWith('.html') || f.endsWith('.rsc'));

console.log(`Found ${allHtmlAndJson.length} files in .next/server`);

// Inspect files for product or collection data
const serverExtracted = [];

allHtmlAndJson.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes('products') || content.includes('category') || content.includes('industry')) {
      const relPath = path.relative(serverDir, file);
      // check if contains json data array
      const matches = content.match(/"id":"[a-f0-9]{24}"/g);
      if (matches && matches.length > 0) {
        serverExtracted.push({
          file: relPath,
          idCount: matches.length,
          size: content.length
        });
      }
    }
  } catch(e) {}
});

console.log('Server files containing ObjectId IDs:');
console.log(JSON.stringify(serverExtracted, null, 2));
