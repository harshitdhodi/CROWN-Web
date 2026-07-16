const fs = require('fs');
const path = require('path');

const publicImagesDir = path.join(__dirname, 'public', 'images');
const srcDir = path.join(__dirname, 'src');

// Get all files recursively
function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file));
    }
  });

  return arrayOfFiles;
}

const allImages = getAllFiles(publicImagesDir);
const allSrcFiles = getAllFiles(srcDir).filter(f => !f.includes('node_modules') && !f.includes('.next'));

const unusedImages = [];

console.log(`Found ${allImages.length} images and ${allSrcFiles.length} source files.`);

// Read all source files into memory
const sourceContents = allSrcFiles.map(srcFile => fs.readFileSync(srcFile, 'utf8'));
console.log('Finished reading source files');

allImages.forEach(imagePath => {
  const fileName = path.basename(imagePath);
  
  let isUsed = false;
  
  for (const content of sourceContents) {
    if (content.includes(fileName)) {
      isUsed = true;
      break;
    }
  }
  
  if (!isUsed) {
    unusedImages.push(imagePath);
  }
});

console.log(`Found ${unusedImages.length} potentially unused images.`);
fs.writeFileSync('unused_images.json', JSON.stringify(unusedImages, null, 2));
console.log('Saved to unused_images.json');
