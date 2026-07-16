const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');
const sassDir = path.join(srcDir, 'app/assets/sass');
const globalsScssPath = path.join(srcDir, 'app/globals.scss');
const unusedScssPath = path.join(__dirname, 'unused_scss.json');

if (!fs.existsSync(unusedScssPath)) {
    console.error("unused_scss.json not found!");
    process.exit(1);
}

const unusedFiles = JSON.parse(fs.readFileSync(unusedScssPath, 'utf8'));

// 1. Read globals.scss
let globalsContent = fs.readFileSync(globalsScssPath, 'utf8');
const initialLinesCount = globalsContent.split('\n').length;

// 2. Process each unused file
let deletedCount = 0;
for (const item of unusedFiles) {
    // Delete file
    if (fs.existsSync(item.path)) {
        fs.unlinkSync(item.path);
        deletedCount++;
    }

    // Remove import from globals.scss
    // Example importPath: "./assets/sass/layout/h4-about"
    // We want to match `@forward "./assets/sass/layout/h4-about";`
    
    // Create a regex to match the import statement flexibly
    const importRegex = new RegExp(`@forward\\s+["']${item.importPath}["'];[\\r\\n]*`, 'g');
    globalsContent = globalsContent.replace(importRegex, '');
}

// 3. Write back globals.scss
fs.writeFileSync(globalsScssPath, globalsContent);

const finalLinesCount = globalsContent.split('\n').length;
console.log(`Deleted ${deletedCount} unused SCSS files.`);
console.log(`Removed ${initialLinesCount - finalLinesCount} lines from globals.scss.`);
