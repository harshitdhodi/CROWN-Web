const fs = require('fs');
const path = require('path');

const swiperFiles = [
    "src/components/shared/testimonials/TesstimonialsVerticalSlider.js",
    "src/components/shared/services/ServicesSlider2.js",
    "src/components/shared/services/ServicesSlider4.js",
    "src/components/shared/marquee/TeamMarqueeSlider.js",
    "src/components/shared/cards/FeatureCard.js",
    "src/components/shared/brands/BrandSlider3.js",
    "src/components/sections/portfolios/ClientPortfolios4.js",
    "src/components/sections/hero/Hero2Client.js"
];

swiperFiles.forEach(file => {
    const fullPath = path.join(__dirname, file);
    if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf8');
        if (!content.includes('swiper-styles.js')) {
            content = `import "@/app/swiper-styles.js";\n` + content;
            fs.writeFileSync(fullPath, content);
            console.log(`Updated ${file}`);
        }
    }
});

// Update nice-select
const niceSelectPath = path.join(__dirname, "src/components/shared/Inputs/ReactNiceSelect.js");
if (fs.existsSync(niceSelectPath)) {
    let content = fs.readFileSync(niceSelectPath, 'utf8');
    if (!content.includes('nice-select2.css')) {
        content = `import "@/app/assets/css/nice-select2.css";\n` + content;
        fs.writeFileSync(niceSelectPath, content);
        console.log(`Updated ReactNiceSelect.js`);
    }
}

// Update odometer
const funfactPath = path.join(__dirname, "src/components/shared/funfact/FunfactSingle.js");
if (fs.existsSync(funfactPath)) {
    let content = fs.readFileSync(funfactPath, 'utf8');
    if (!content.includes('odometer-theme-default.css')) {
        content = `import "@/app/assets/css/odometer-theme-default.css";\n` + content;
        fs.writeFileSync(funfactPath, content);
        console.log(`Updated FunfactSingle.js`);
    }
}
