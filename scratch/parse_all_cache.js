const fs = require('fs');
const path = require('path');

const fetchCacheDir = path.join(__dirname, '../.next/cache/fetch-cache');
const files = fs.readdirSync(fetchCacheDir);

const collectionsData = {};

files.forEach(file => {
  const filePath = path.join(fetchCacheDir, file);
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(raw);
    if (!parsed.data || !parsed.data.body) return;

    let bodyText = parsed.data.body;
    let decoded = bodyText;
    try {
      const buf = Buffer.from(bodyText, 'base64');
      const str = buf.toString('utf8');
      if (str.startsWith('{') || str.startsWith('[')) {
        decoded = JSON.parse(str);
      }
    } catch (e) {}

    const url = parsed.data.url || file;

    // Check url path
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const search = urlObj.search;

      collectionsData[file] = {
        url,
        pathname,
        search,
        data: decoded
      };
    } catch(e) {
      collectionsData[file] = { url, data: decoded };
    }

  } catch(e) {}
});

// Group by endpoint / target collection
const grouped = {};

Object.values(collectionsData).forEach(item => {
  const pathname = item.pathname || '';
  const data = item.data;
  
  if (!grouped[pathname]) {
    grouped[pathname] = [];
  }
  grouped[pathname].push({
    search: item.search,
    data
  });
});

console.log('Endpoints found in cache:');
Object.keys(grouped).forEach(endpoint => {
  console.log(`- ${endpoint} (${grouped[endpoint].length} requests)`);
});

fs.writeFileSync(path.join(__dirname, 'extracted_cache.json'), JSON.stringify(grouped, null, 2));
console.log('Wrote extracted_cache.json');
