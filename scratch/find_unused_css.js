const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');
const sassDir = path.join(srcDir, 'app/assets/sass');
const globalsScssPath = path.join(srcDir, 'app/globals.scss');

// Find all .js and .jsx files
function getAllJsFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            getAllJsFiles(filePath, fileList);
        } else if (filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
            fileList.push(filePath);
        }
    }
    return fileList;
}

const jsFiles = getAllJsFiles(srcDir);
const jsContents = jsFiles.map(f => fs.readFileSync(f, 'utf8')).join('\n');

function findUnusedScss(subDir) {
    const dir = path.join(sassDir, subDir);
    if (!fs.existsSync(dir)) return [];
    
    const unusedFiles = [];
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
        if (!file.endsWith('.scss')) continue;
        if (!file.startsWith('_h')) continue; // Only check theme specific scss
        
        // e.g. _h4-about.scss -> h4-about
        const baseName = file.replace('_', '').replace('.scss', '');
        
        // simple heuristic: if the string "h4-about" is not in any JS file, it's likely unused
        if (!jsContents.includes(baseName)) {
            unusedFiles.push({
                file: file,
                path: path.join(dir, file),
                importPath: `./assets/sass/${subDir}/${baseName}`
            });
        }
    }
    return unusedFiles;
}

const unusedLayouts = findUnusedScss('layout');
const unusedComponents = findUnusedScss('components');

const allUnused = [...unusedLayouts, ...unusedComponents];

console.log(`Found ${allUnused.length} unused SCSS files:`);
allUnused.forEach(u => console.log(u.importPath));

// Generate a summary JSON for next steps
fs.writeFileSync(path.join(__dirname, 'unused_scss.json'), JSON.stringify(allUnused, null, 2));
