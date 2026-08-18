const fs = require('fs');
const path = require('path');

const raw = fs.readFileSync(path.join(__dirname, 'extracted_cache.json'), 'utf8');
const cacheData = JSON.parse(raw);

const summary = {};

Object.keys(cacheData).forEach(endpoint => {
  const requests = cacheData[endpoint];
  summary[endpoint] = {
    totalRequests: requests.length,
    records: []
  };

  requests.forEach((req, idx) => {
    const data = req.data;
    let payload = data;
    if (data && data.data !== undefined) {
      payload = data.data;
    }

    let itemsCount = 0;
    let sampleKeys = [];
    let sampleItem = null;

    if (Array.isArray(payload)) {
      itemsCount = payload.length;
      if (payload.length > 0) {
        sampleItem = payload[0];
        if (typeof sampleItem === 'object' && sampleItem !== null) {
          sampleKeys = Object.keys(sampleItem);
        }
      }
    } else if (typeof payload === 'object' && payload !== null) {
      itemsCount = 1;
      sampleItem = payload;
      sampleKeys = Object.keys(payload);
    }

    summary[endpoint].records.push({
      reqIdx: idx,
      search: req.search || '',
      itemsCount,
      sampleKeys,
      sampleItem: sampleItem ? JSON.stringify(sampleItem).substring(0, 200) : null
    });
  });
});

console.log(JSON.stringify(summary, null, 2));
