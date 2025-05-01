const fs = require('fs');
const path = require('path');

const dir = '.lighthouseci';
const files = fs.readdirSync(dir)
  .filter(f => f.endsWith('.json') && f.includes('.lhr-'))
  .map(f => path.join(dir, f))
  .sort(); // You can use sort by date if needed

if (files.length < 2) {
  console.error('❌ Expected at least 2 Lighthouse JSON reports.');
  process.exit(1);
}

const [mainFile, prFile] = files; // First = main, second = PR

const categories = ['performance', 'accessibility', 'best-practices', 'seo', 'pwa'];

function getScores(filePath) {
  const report = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const result = {};
  for (const cat of categories) {
    result[cat] = report.categories[cat]?.score ? report.categories[cat].score * 100 : 'N/A';
  }
  return result;
}

const mainScores = getScores(mainFile);
const prScores = getScores(prFile);

let markdown = '### 🚦 Lighthouse Score Comparison\n';
markdown += '| Category        | Main Branch | PR Branch |\n';
markdown += '|-----------------|-------------|-----------|\n';

for (const cat of categories) {
  markdown += `| ${cat.padEnd(15)} | ${mainScores[cat]}         | ${prScores[cat]}       |\n`;
}

fs.writeFileSync('lighthouse-comment.md', markdown);
console.log('✅ Generated lighthouse-comment.md');
