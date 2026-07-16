const fs = require('fs');
const path = require('path');
const { PurgeCSS } = require('purgecss');

async function runPurge() {
  const cssPaths = [
    // src/app/assets/css
    path.join(__dirname, 'src/app/assets/css/animate.min.css'),
    path.join(__dirname, 'src/app/assets/css/bexon-icons.css'),
    path.join(__dirname, 'src/app/assets/css/bootstrap.min.css'),
    path.join(__dirname, 'src/app/assets/css/font-awesome-pro.min.css'),
    path.join(__dirname, 'src/app/assets/css/glightbox.min.css'),
    path.join(__dirname, 'src/app/assets/css/meanmenu.css'),
    path.join(__dirname, 'src/app/assets/css/nice-select2.css'),
    path.join(__dirname, 'src/app/assets/css/odometer-theme-default.css'),
    
    // public/css
    path.join(__dirname, 'public/css/animate.min.css'),
    path.join(__dirname, 'public/css/bexon-icons.css'),
    path.join(__dirname, 'public/css/bootstrap.min.css'),
    path.join(__dirname, 'public/css/fa-icons-slim.css'),
    path.join(__dirname, 'public/css/glightbox.min.css'),
    path.join(__dirname, 'public/css/meanmenu.css'),
    path.join(__dirname, 'public/css/nice-select2.css'),
    path.join(__dirname, 'public/css/odometer-theme-default.css'),
    path.join(__dirname, 'public/css/range-slider.css'),
    path.join(__dirname, 'public/css/swiper-bundle.min.css'),
  ];

  const { globSync } = require('glob');
  const resolvedContentFiles = globSync([
    'src/**/*.js',
    'src/**/*.jsx',
    'src/**/*.ts',
    'src/**/*.tsx',
    'src/**/*.html'
  ].map(p => path.join(__dirname, p).replace(/\\/g, '/')));

  console.log(`Found ${resolvedContentFiles.length} content files to scan.`);

  const safelist = {
    standard: [
      'html',
      'body',
      /swiper/,
      /tj-/,
      /btn/,
      /fa-/,
      /active/,
      /show/,
      /fade/,
      /nav/,
      /dropdown/,
      /modal/,
      /glightbox/,
      /gslide/,
      /ginner/,
      /tji-/,
      // Extra icons/font-face rules
      /fa/,
      /glyphicon/,
      /class\^="tji-"/,
      /class\*=" tji-"/,
      /class\^="fa-"/,
      /class\*=" fa-"/
    ],
    deep: [
      /swiper/,
      /tj-/,
      /fa-/,
      /modal/,
      /tji-/
    ],
    greedy: [
      /swiper/,
      /tj-/,
      /fa-/,
      /modal/,
      /tji-/
    ]
  };

  console.log('Starting PurgeCSS process...');

  for (const cssFile of cssPaths) {
    if (!fs.existsSync(cssFile)) {
      console.log(`Skipping non-existent file: ${cssFile}`);
      continue;
    }

    const originalSize = fs.statSync(cssFile).size;
    console.log(`Purging ${path.basename(cssFile)} (original size: ${(originalSize / 1024).toFixed(2)} KB)...`);

    try {
      const purgecssResult = await new PurgeCSS().purge({
        content: resolvedContentFiles,
        css: [{
          raw: fs.readFileSync(cssFile, 'utf8')
        }],
        safelist: safelist,
        defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
      });

      console.log(`Result for ${path.basename(cssFile)}:`, Array.isArray(purgecssResult) ? `Array of size ${purgecssResult.length}` : typeof purgecssResult);
      if (purgecssResult && purgecssResult.length > 0) {
        const purgedCss = purgecssResult[0].css;
        fs.writeFileSync(cssFile, purgedCss, 'utf8');
        const newSize = fs.statSync(cssFile).size;
        console.log(`Successfully purged ${path.basename(cssFile)}: ${(originalSize / 1024).toFixed(2)} KB -> ${(newSize / 1024).toFixed(2)} KB (Reduced by ${((1 - newSize / originalSize) * 100).toFixed(1)}%)`);
      } else {
        console.log(`No results for ${path.basename(cssFile)}:`, purgecssResult);
      }
    } catch (err) {
      console.error(`Error purging ${path.basename(cssFile)}:`, err);
    }
  }

  console.log('PurgeCSS process completed!');
}

runPurge().catch(console.error);
