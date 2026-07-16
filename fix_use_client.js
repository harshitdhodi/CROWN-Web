const fs = require('fs');
const path = require('path');

const files = [
    "src/components/shared/testimonials/TesstimonialsVerticalSlider.js",
    "src/components/shared/services/ServicesSlider2.js",
    "src/components/shared/services/ServicesSlider4.js",
    "src/components/shared/marquee/TeamMarqueeSlider.js",
    "src/components/shared/cards/FeatureCard.js",
    "src/components/shared/brands/BrandSlider3.js",
    "src/components/sections/portfolios/ClientPortfolios4.js",
    "src/components/sections/hero/Hero2Client.js",
    "src/components/shared/Inputs/ReactNiceSelect.js",
    "src/components/shared/funfact/FunfactSingle.js"
];

files.forEach(file => {
    const fullPath = path.join(__dirname, file);
    if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf8');
        // Match import statement followed by "use client";
        const regex = /^(import [^\n]+;\n)("use client";\n)/;
        if (regex.test(content)) {
            content = content.replace(regex, "$2$1");
            fs.writeFileSync(fullPath, content);
            console.log(`Fixed ${file}`);
        } else {
             // Handle case where it might be inverted but not exactly
             const lines = content.split('\n');
             const useClientIndex = lines.findIndex(l => l.trim() === '"use client";' || l.trim() === "'use client';");
             
             if (useClientIndex > 0) {
                 // "use client" is not the first line
                 const useClientLine = lines.splice(useClientIndex, 1)[0];
                 lines.unshift(useClientLine);
                 fs.writeFileSync(fullPath, lines.join('\n'));
                 console.log(`Fixed manually ${file}`);
             }
        }
    }
});
