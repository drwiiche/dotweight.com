import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base domain configuration - aligned with primary www production domain
const BASE_URL = 'https://www.dotweight.com';

const STATES = [
  'federal-interstate', 'alabama', 'alaska', 'arizona', 'arkansas', 'california',
  'colorado', 'connecticut', 'delaware', 'florida', 'georgia', 'hawaii',
  'idaho', 'illinois', 'indiana', 'iowa', 'kansas', 'kentucky',
  'louisiana', 'maine', 'maryland', 'massachusetts', 'michigan', 'minnesota',
  'mississippi', 'missouri', 'montana', 'nebraska', 'nevada', 'new-hampshire',
  'new-jersey', 'new-mexico', 'new-york', 'north-carolina', 'north-dakota', 'ohio',
  'oklahoma', 'oregon', 'pennsylvania', 'rhode-island', 'south-carolina', 'south-dakota',
  'tennessee', 'texas', 'utah', 'vermont', 'virginia', 'washington',
  'west-virginia', 'wisconsin', 'wyoming'
];

function generateSitemap() {
  const urls = [];
  const today = new Date().toISOString().split('T')[0];

  // 1. Core High-Priority Pages (7 URLs)
  const corePages = [
    { path: '/', priority: '1.0', changefreq: 'daily' },
    { path: '/cat-scale-decoder', priority: '0.9', changefreq: 'weekly' },
    { path: '/pseo-matrix', priority: '0.9', changefreq: 'weekly' },
    { path: '/legal-states', priority: '0.9', changefreq: 'weekly' },
    { path: '/presets', priority: '0.8', changefreq: 'weekly' },
    { path: '/guides', priority: '0.8', changefreq: 'weekly' },
    { path: '/bridge-table', priority: '0.8', changefreq: 'weekly' },
  ];

  corePages.forEach((p) => {
    urls.push(`  <url>
    <loc>${BASE_URL}${p.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`);
  });

  // 2. All 51 Official State Legal Statute Pages (51 URLs)
  STATES.forEach((slug) => {
    urls.push(`  <url>
    <loc>${BASE_URL}/legal/${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`);
  });

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

  const robotsTxt = `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml
`;

  const publicDir = path.join(__dirname, '../public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml, 'utf8');
  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt, 'utf8');

  console.log(`Successfully generated focused, high-authority sitemap.xml with ${urls.length} URLs in /public/sitemap.xml`);
  console.log(`Successfully generated robots.txt in /public/robots.txt`);
}

generateSitemap();
