const fs = require('fs');
const path = require('path');

const fetchCacheDir = path.join(__dirname, '../.next/cache/fetch-cache');

if (!fs.existsSync(fetchCacheDir)) {
  console.log('fetch-cache directory not found');
  process.exit(1);
}

const files = fs.readdirSync(fetchCacheDir);
console.log(`Found ${files.length} cache files.`);

const dataByEndpoint = {};

files.forEach(file => {
  const filePath = path.join(fetchCacheDir, file);
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(raw);
    if (parsed.data && parsed.data.body) {
      let bodyText = parsed.data.body;
      let decoded = bodyText;
      // Check if base64
      try {
        const buf = Buffer.from(bodyText, 'base64');
        const str = buf.toString('utf8');
        if (str.startsWith('{') || str.startsWith('[')) {
          decoded = JSON.parse(str);
        }
      } catch (e) {
        // Not base64 or fail to parse JSON
      }

      const url = parsed.data.url || file;
      const headers = parsed.data.headers || {};
      
      dataByEndpoint[file] = {
        file,
        url,
        contentType: headers['content-type'],
        decodedType: typeof decoded === 'object' ? (Array.isArray(decoded) ? 'array' : 'object') : 'string',
        sample: typeof decoded === 'object' ? JSON.stringify(decoded).substring(0, 150) : decoded.substring(0, 100)
      };
    }
  } catch (err) {
    console.error(`Error reading ${file}:`, err.message);
  }
});

console.log(JSON.stringify(dataByEndpoint, null, 2));
