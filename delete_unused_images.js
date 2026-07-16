const fs = require('fs');

const unusedImages = require('./unused_images.json');
let deletedCount = 0;

unusedImages.forEach(imagePath => {
  try {
    fs.unlinkSync(imagePath);
    deletedCount++;
    console.log('Deleted:', imagePath);
  } catch (error) {
    console.error('Error deleting:', imagePath, error.message);
  }
});

console.log(`Successfully deleted ${deletedCount} images.`);
