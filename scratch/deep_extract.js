const fs = require('fs');
const path = require('path');

const fetchCacheDir = path.join(__dirname, '../.next/cache/fetch-cache');
const files = fs.readdirSync(fetchCacheDir);

// Map of collection name -> Map of document ID -> document object
const extractedDb = {};

function addDoc(collection, doc) {
  if (!doc) return;
  const id = doc._id || doc.id;
  if (!id) return;

  if (!extractedDb[collection]) {
    extractedDb[collection] = new Map();
  }

  // Ensure _id field exists in document
  const docToInsert = { ...doc };
  if (!docToInsert._id && docToInsert.id) {
    docToInsert._id = docToInsert.id;
  }
  
  // Clean up inline populated objects if saving to raw collection
  // (or keep them if appropriate, but store raw string IDs for category/industry)

  extractedDb[collection].set(String(id), docToInsert);
}

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

    const urlStr = parsed.data.url || '';
    let pathname = '';
    try {
      pathname = new URL(urlStr).pathname;
    } catch(e) {}

    // Extract items based on endpoint
    const responseBody = decoded;
    const items = Array.isArray(responseBody) ? responseBody : 
                  (responseBody && responseBody.data) ? (Array.isArray(responseBody.data) ? responseBody.data : [responseBody.data]) :
                  (typeof responseBody === 'object' ? [responseBody] : []);

    items.forEach(item => {
      if (!item || typeof item !== 'object') return;

      // 1. Check if product
      if (pathname.includes('/api/products') || pathname.includes('/api/data/our_products') || (item.name && item.category)) {
        // Extract populated category/industry if embedded
        if (item.category_populated) {
          addDoc('product-category', item.category_populated);
        }
        if (item.industry_populated) {
          addDoc('industry', item.industry_populated);
        }
        
        // Clean product copy
        const cleanProduct = { ...item };
        delete cleanProduct.category_populated;
        delete cleanProduct.category_label;
        delete cleanProduct.industry_populated;
        delete cleanProduct.industry_label;
        addDoc('our_products', cleanProduct);
      }

      // 2. Check if category
      else if (pathname.includes('product-category') || (item.category_name && item.category_slug)) {
        addDoc('product-category', item);
      }

      // 3. Check if industry
      else if (pathname.includes('/industry') || (item.tag && item.title && item.color_img)) {
        addDoc('industry', item);
      }

      // 4. Check if banner
      else if (pathname.includes('/data/banner')) {
        addDoc('banner', item);
      }

      // 5. Check if contactus
      else if (pathname.includes('/data/contactus')) {
        addDoc('contactus', item);
      }

      // 6. Check if page-components
      else if (pathname.includes('/page-components')) {
        addDoc('page-components', item);
      }

      // 7. Check if blog
      else if (pathname.includes('/blogs')) {
        addDoc('blogs', item);
      }

      // 8. Check if manufacturing_strength
      else if (pathname.includes('manufacturing_strength')) {
        addDoc('manufacturing_strength', item);
      }

      // 9. Check if heading
      else if (pathname.includes('/heading')) {
        addDoc('heading', item);
      }

      // 10. Check if quality-process
      else if (pathname.includes('quality-process')) {
        addDoc('quality-process', item);
      }

      // 11. Check if seo meta
      else if (pathname.includes('/seo/meta')) {
        addDoc('manage-meta', item);
      }

      // 12. Check if seo settings
      else if (pathname.includes('/seo/settings')) {
        addDoc('seo_global', item);
      }

      // 13. Check if footer
      else if (pathname.includes('/data/footer')) {
        addDoc('footer', item);
      }

      // 14. Check if compliance-standards
      else if (pathname.includes('compliance-standards')) {
        addDoc('compliance-standards', item);
      }

      // 15. Check if manufacturing_process
      else if (pathname.includes('manufacturing_process')) {
        addDoc('manufacturing_process', item);
      }

      // 16. Check if journey
      else if (pathname.includes('/journey')) {
        addDoc('journey', item);
      }

      // 17. Check if core_value
      else if (pathname.includes('core_value')) {
        addDoc('core_value', item);
      }

      // 18. Check if mission_vision
      else if (pathname.includes('mission_vision')) {
        addDoc('mission_vision', item);
      }

      // 19. Check if colors
      else if (pathname.includes('/colors')) {
        addDoc('colors', item);
      }

      // 20. Check if certificates
      else if (pathname.includes('certificates')) {
        addDoc('certificates', item);
      }

      // 21. Check if global-presence
      else if (pathname.includes('global-presence')) {
        addDoc('global-presence', item);
      }

      // 22. Check if whychooseus
      else if (pathname.includes('whychooseus')) {
        addDoc('whychooseus', item);
      }

      // Fallback: generic /api/data/[colName]
      else if (pathname.includes('/api/data/')) {
        const colName = pathname.replace('/api/data/', '').split('?')[0];
        if (colName) {
          addDoc(colName, item);
        }
      }
    });

  } catch(e) {}
});

// Summary report
const report = {};
Object.keys(extractedDb).forEach(col => {
  report[col] = extractedDb[col].size;
});

console.log('Extracted Collections Summary:');
console.table(report);

// Format as JSON object where key is collection name and value is array of docs
const finalData = {};
Object.keys(extractedDb).forEach(col => {
  finalData[col] = Array.from(extractedDb[col].values());
});

fs.writeFileSync(path.join(__dirname, 'seed_data.json'), JSON.stringify(finalData, null, 2));
console.log('Saved seed_data.json successfully!');
