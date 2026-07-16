const fs = require('fs');
const glob = require('glob');

const swiperImports = `import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";`;

const files = glob.sync('src/components/**/*.js');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('import "swiper/css"')) {
        content = content.replace(swiperImports, '');
        fs.writeFileSync(file, content);
        console.log("Removed swiper css from", file);
    }
});
