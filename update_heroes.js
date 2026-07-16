const fs = require('fs');
const path = require('path');

const targetDir = 'd:/Master_Backend/manufacturing/bexon/src';

function walk(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const stat = fs.statSync(path.join(dir, file));
    if (stat.isDirectory()) {
      walk(path.join(dir, file), fileList);
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      fileList.push(path.join(dir, file));
    }
  }
  return fileList;
}

const files = walk(targetDir);

const heroFiles = files.filter(f => {
  const content = fs.readFileSync(f, 'utf8');
  return content.includes('<HeroInner') && !f.includes('HeroInner.js') && !f.includes('about-us') && !f.includes('ServiceDetailsMain.js');
});

console.log(`Found ${heroFiles.length} files to update.`);

heroFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // 1. Skip if already imports getBannerData
  if (content.includes('getBannerData')) return;

  // 2. Add import for getBannerData at the top
  const importStatement = `import getBannerData from "@/lib/getBannerData";\n`;
  content = importStatement + content;

  // 3. Find the default export async function or const component
  // Usually: export default async function Page() { ...

  const heroMatch = content.match(/<HeroInner\s+title=\{"([^"]+)"\}\s+text=\{"([^"]+)"\}/);
  if (!heroMatch) {
    console.log(`Could not parse HeroInner title in ${file}`);
    return;
  }

  const defaultTitle = heroMatch[1];

  // Extract route slug. 
  // If file is `app/global-presence/page.js`, route is `/global-presence`
  // If file is `app/products/page.js`, route is `/products`
  // If file is `app/services/[slug]/page.js`, route is dynamic `/services/${params.slug}`

  let routePath = '';
  if (file.includes('app\\') || file.includes('app/')) {
    const parts = file.split(/app\\|app\//)[1].split(/\\|\//);
    parts.pop(); // remove page.js

    // Check if it has dynamic segments
    if (parts.some(p => p.startsWith('['))) {
      const dynamicRoute = parts.map(p => p.startsWith('[') ? '${params.' + p.slice(1, -1) + '}' : p).join('/');
      routePath = '`/' + dynamicRoute + '`';
    } else {
      routePath = '"/' + parts.join('/') + '"';
    }
  }

  const fetchBlock = `
	const banner = await getBannerData(${routePath});
	const bannerTitle = banner?.title || "${defaultTitle}";
	let bgImage = "/images/bg/wire-banner.png";
	if (banner?.image?.[0]) {
		bgImage = banner.image[0];
		if (bgImage.startsWith('/uploads')) {
			bgImage = \`\${process.env.CMS_BASE_URL || "http://localhost:3012"}\${bgImage}\`;
		}
	}
`;

  // Find where to inject the fetch block. After the function opening bracket.
  // E.g., `export default async function Page({ params }) {`
  const functionMatch = content.match(/async\s+(?:function\s+\w+|const\s+\w+\s*=\s*async\s*)\s*\([^)]*\)\s*=>?\s*\{/);

  if (functionMatch) {
    const insertIndex = functionMatch.index + functionMatch[0].length;
    content = content.slice(0, insertIndex) + fetchBlock + content.slice(insertIndex);
  } else {
    // Maybe it's not async? We need it to be async.
    content = content.replace(/(export default function \w+\([^)]*\)\s*\{)/, "export default async " + "$1".replace("export default function", "function"));
    // wait, replacing just adds async if it's not there.
    const newFuncMatch = content.match(/export default\s+async\s+function\s+\w+\([^)]*\)\s*\{/);
    if (newFuncMatch) {
      const insertIndex = newFuncMatch.index + newFuncMatch[0].length;
      content = content.slice(0, insertIndex) + fetchBlock + content.slice(insertIndex);
    } else {
      console.log(`Could not find function body to inject in ${file}`);
      return;
    }
  }

  // Replace <HeroInner title={"..."} text={"..."} /> with <HeroInner title={bannerTitle} text={bannerTitle} bgImage={bgImage} />
  content = content.replace(/<HeroInner\s+title=\{".*?"\}\s+text=\{".*?"\}\s*\/>/g, '<HeroInner title={bannerTitle} text={bannerTitle} bgImage={bgImage} />');

  // also handle when there are breadcrums
  content = content.replace(/<HeroInner\s*[\s\S]*?(breadcrums=\{.*?\}|breadcrums=\{.*?\})[\s\S]*?\/>/g, (match) => {
    // If it already has breadcrums, preserve them
    const breadMatch = match.match(/breadcrums=\{.*?\}/);
    if (breadMatch) {
      return `<HeroInner title={bannerTitle} text={bannerTitle} bgImage={bgImage} ${breadMatch[0]} />`;
    }
    return match;
  });

  fs.writeFileSync(file, content);
  console.log(`Updated ${file}`);
});
