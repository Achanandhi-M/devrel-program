const fs = require('fs');
const path = require('path');

const dir = '.lighthouseci';
const files = fs.readdirSync(dir).filter(file => file.endsWith('.report.json'));

if (files.length < 2) {
  console.error('❌ Not enough Lighthouse reports found.');
  process.exit(1);
}

let mainReport = '';
let prReport = '';

for (const file of files) {
  const json = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
  const url = json.finalUrl;

  if (url.includes('3000')) mainReport = json;
  else if (url.includes('3001')) prReport = json;
}

function extract(report) {
  return {
    performance: report.categories.performance.score * 100,
    accessibility: report.categories.accessibility.score * 100,
    bestPractices: report.categories['best-practices'].score * 100,
    seo: report.categories.seo.score * 100,
  };
}

const main = extract(mainReport);
const pr = extract(prReport);

const md = `
**🔍 Lighthouse Scores**

**⚡ PR Branch (http://localhost:3001)**
| Metric         | Score |
|----------------|-------|
| Performance    | ${pr.performance} |
| Accessibility  | ${pr.accessibility} |
| Best Practices | ${pr.bestPractices} |
| SEO            | ${pr.seo} |

**📦 Main Branch (http://localhost:3000)**
| Metric         | Score |
|----------------|-------|
| Performance    | ${main.performance} |
| Accessibility  | ${main.accessibility} |
| Best Practices | ${main.bestPractices} |
| SEO            | ${main.seo} |
`;

fs.writeFileSync('lighthouse-comment.md', md);
console.log('✅ Comment written to lighthouse-comment.md');
