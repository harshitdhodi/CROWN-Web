const fs = require('fs');
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config({ path: path.join(__dirname, '../../CROWN_Admin/.env') });

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'crown_packaging';

if (!uri) {
  console.error('❌ MONGODB_URI not found in .env');
  process.exit(1);
}

const seedDataPath = path.join(__dirname, 'seed_data.json');
if (!fs.existsSync(seedDataPath)) {
  console.error('❌ seed_data.json not found');
  process.exit(1);
}

const seedData = JSON.parse(fs.readFileSync(seedDataPath, 'utf8'));

function formatDoc(doc) {
  const formatted = { ...doc };
  
  // Format _id
  const rawId = formatted._id || formatted.id;
  if (rawId) {
    if (typeof rawId === 'string' && rawId.length === 24 && /^[0-9a-fA-F]{24}$/.test(rawId)) {
      formatted._id = new ObjectId(rawId);
    } else {
      formatted._id = rawId;
    }
  }
  
  // Clean up populated objects to keep clean relations
  delete formatted.category_populated;
  delete formatted.category_label;
  delete formatted.industry_populated;
  delete formatted.industry_label;
  
  return formatted;
}

async function seedDatabase() {
  console.log(`Connecting to MongoDB (${dbName})...`);
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  console.log('✅ Connected successfully!');

  const results = {};

  const collectionsCol = db.collection('collections');
  const fieldsCol = db.collection('fields');
  const nowIso = new Date().toISOString();

  for (const [colName, docs] of Object.entries(seedData)) {
    if (!docs || docs.length === 0) continue;

    // Target collections (support alias names if needed)
    const targetCols = [colName];
    if (colName === 'product-category') {
      targetCols.push('categories', 'product_categories');
    }

    for (const targetName of targetCols) {
      const collection = db.collection(targetName);
      let count = 0;

      for (const rawDoc of docs) {
        const doc = formatDoc(rawDoc);
        if (!doc._id) continue;

        // Upsert by _id or unique key
        let query = { _id: doc._id };
        if (targetName === 'seo_global') {
          query = { type: doc.type || 'global' };
        } else if (targetName === 'manage-meta' && doc.slug) {
          query = { slug: doc.slug };
        } else if (targetName === 'heading' && doc.section_name) {
          query = { section_name: doc.section_name };
        }

        await collection.replaceOne(query, doc, { upsert: true });
        count++;
      }

      results[targetName] = count;
      console.log(`  └─ Seeded ${count} documents into collection: '${targetName}'`);

      // Ensure Collection metadata exists in CMS 'collections'
      let colMeta = await collectionsCol.findOne({ name: targetName });
      if (!colMeta) {
        const displayName = targetName.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        const insertCol = {
          name: targetName,
          display_name: displayName,
          description: `${displayName} Collection`,
          icon: 'layers',
          color: '#3B82F6',
          created_at: nowIso,
          updated_at: nowIso
        };
        const res = await collectionsCol.insertOne(insertCol);
        colMeta = { _id: res.insertedId, ...insertCol };
        console.log(`     Registered CMS Collection: '${targetName}'`);
      }

      // Ensure Field metadata exists in CMS 'fields' for the first doc
      if (docs.length > 0 && colMeta) {
        const colId = colMeta._id.toString();
        const sampleDoc = docs[0];
        let order = 0;
        for (const key of Object.keys(sampleDoc)) {
          if (key === 'id' || key === '_id' || key.endsWith('_populated') || key.endsWith('_label')) continue;
          
          const existingField = await fieldsCol.findOne({ collection_id: colId, name: key });
          if (!existingField) {
            let fieldType = 'Text';
            if (Array.isArray(sampleDoc[key])) fieldType = 'JSON';
            else if (typeof sampleDoc[key] === 'boolean') fieldType = 'Boolean';
            else if (typeof sampleDoc[key] === 'object' && sampleDoc[key] !== null) fieldType = 'JSON';
            else if (key === 'details' || key === 'description') fieldType = 'RichText';
            else if (key === 'category' || key === 'industry') fieldType = 'Relation';

            const fieldDoc = {
              collection_id: colId,
              name: key,
              display_name: key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
              field_type: fieldType,
              field_order: order++,
              created_at: nowIso,
              updated_at: nowIso
            };
            if (key === 'category') fieldDoc.relation_to_collection = 'product-category';
            if (key === 'industry') fieldDoc.relation_to_collection = 'industry';

            await fieldsCol.insertOne(fieldDoc);
          }
        }
      }
    }
  }

  await client.close();
  console.log('\n🎉 Database Seeding Completed Successfully!');
  console.table(results);
}

seedDatabase().catch(err => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
