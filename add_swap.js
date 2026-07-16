const fs = require('fs');
const path = require('path');

const files = [
    "src/app/assets/css/font-awesome-pro.min.css",
    "src/app/assets/css/bexon-icons.css"
];

files.forEach(file => {
    const fullPath = path.join(__dirname, file);
    if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf8');
        // Simple regex to insert font-display: swap; in @font-face blocks if not present
        if (!content.includes('font-display:swap') && !content.includes('font-display: swap')) {
            content = content.replace(/(@font-face\s*{[^}]*?)(})/g, '$1;font-display:swap;$2');
            fs.writeFileSync(fullPath, content);
            console.log(`Updated font-display in ${file}`);
        }
    }
});
