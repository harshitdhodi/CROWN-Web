const fs = require('fs');
const path = require('path');

const raw = fs.readFileSync(path.join(__dirname, 'extracted_cache.json'), 'utf8');
const cache = JSON.parse(raw);

Object.keys(cache).forEach(endpoint => {
  if (endpoint.includes('banner') || endpoint.includes('cat')) {
    console.log(`Endpoint: ${endpoint}`);
    cache[endpoint].forEach((req, i) => {
      console.log(`  Req ${i}: ${req.search} -> ${JSON.stringify(req.data).substring(0, 150)}`);
    });
  }
});
