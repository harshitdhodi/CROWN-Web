const fs = require('fs');
const path = require('path');

const seed = JSON.parse(fs.readFileSync(path.join(__dirname, 'seed_data.json'), 'utf8'));

console.log('Products found:');
seed.our_products.forEach(p => {
  console.log(`- ${p.name} (ID: ${p.id || p._id}, Category ID: ${p.category}, Industry ID: ${p.industry})`);
});

console.log('\nCategories found:');
seed['product-category'].forEach(c => {
  console.log(`- ${c.category_name || c.name} (ID: ${c.id || c._id})`);
});

console.log('\nIndustries found:');
seed.industry.forEach(ind => {
  console.log(`- ${ind.title || ind.name} (ID: ${ind.id || ind._id})`);
});
