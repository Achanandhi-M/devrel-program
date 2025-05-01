const fs = require('fs');

function extractScores(reportPath) {
  const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  return {
    performance: report.categories.performance.score * 100,
    accessibility: report.categories.accessibility.score * 100,
    bestPractices: report.categories['best-practices'].score * 100,
    seo: report.categories.seo.score * 100,
  };
}

const main = extractScores('.lighthouseci/localhost_3000.report.json');
const pr = extractScores('.lighthouseci/localhost_3001.report.json');

const markdown = `
**Lighthouse Scores for the PR and Main Branches**

**PR Branch (http://localhost:3001)**
| Metric         | Score |
|----------------|-------|
| Performance    | ${pr.performance} |
| Accessibility  | ${pr.accessibility} |
| Best Practices | ${pr.bestPractices} |
| SEO            | ${pr.seo} |

**Main Branch (http://localhost:3000)**
| Metric         | Score |
|----------------|-------|
| Performance    | ${main.performance} |
| Accessibility  | ${main.accessibility} |
| Best Practices | ${main.bestPractices} |
| SEO            | ${main.seo} |
`;

fs.writeFileSync('lighthouse-comment.md', markdown);
console.log('✅ Lighthouse scores written to lighthouse-comment.md');
