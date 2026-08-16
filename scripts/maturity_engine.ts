import * as fs from 'fs';
import * as path from 'path';
import { FSUtils } from './fs_utils';

export interface CategoryMaturity {
  name: string;
  score: number;
  weight: number;
  confidence: number;
  trend: 'UP' | 'DOWN' | 'STABLE';
  historicalDelta: number;
  objectiveContribution: number;
  technicalDebt: number;
  businessValue: number;
  evidenceLinks: string[];
}

export interface ProductMaturity {
  timestamp: string;
  iterationId: string;
  overallScore: number;
  categories: CategoryMaturity[];
}

export class MaturityEngine {
  private getDocsDir() {
    return path.join(__dirname, '..', 'docs', 'orchestration');
  }

  private getArtifactsDir(iterationId: string) {
    return path.join(__dirname, '..', 'artifacts', iterationId);
  }

  public recalculateMaturity(iterationId: string, prevMaturity: ProductMaturity | null): ProductMaturity {
    console.log(`[MaturityEngine] Recalculating Product Maturity from Evidence for Iteration ${iterationId}`);
    
    const iterDir = this.getArtifactsDir(iterationId);

    // Helper to extract evidence score
    const getEvidenceScore = (fileSubPath: string, jsonKey: string): number => {
      const fullPath = path.join(iterDir, fileSubPath);
      if (!fs.existsSync(fullPath)) return 0; // 0 confidence if no evidence
      try {
        const raw = fs.readFileSync(fullPath, 'utf8');
        const data = JSON.parse(raw);
        return data[jsonKey] !== undefined ? Number(data[jsonKey]) : 0;
      } catch (e) {
        return 0;
      }
    };

    // Calculate strict evidence-based scores
    // In a real implementation, these would parse Lighthouse JSON for the precise score, Playwright for pass rate, etc.
    const performanceScore = getEvidenceScore('performance/web_vitals.json', 'score') || getEvidenceScore('lighthouse/report.json', 'performance') || 0;
    const a11yScore = getEvidenceScore('accessibility/axe_report.json', 'score') || 0;
    const securityScore = getEvidenceScore('security/security_report.json', 'score') || 0;
    const testingScore = getEvidenceScore('playwright/report.json', 'passRate') || 0;

    const categories: CategoryMaturity[] = [
      this.buildCategory('Performance', performanceScore, 1.0, prevMaturity),
      this.buildCategory('Accessibility', a11yScore, 0.8, prevMaturity),
      this.buildCategory('Security', securityScore, 1.0, prevMaturity),
      this.buildCategory('Testing', testingScore, 1.0, prevMaturity),
      // Other 15 dimensions would be similarly extracted from quantitative JSON outputs
      this.buildCategory('Architecture', 0, 1.0, prevMaturity),
      this.buildCategory('Frontend', 0, 1.0, prevMaturity),
      this.buildCategory('Backend', 0, 1.0, prevMaturity),
      this.buildCategory('UX', 0, 0.9, prevMaturity),
      this.buildCategory('UI', 0, 0.9, prevMaturity),
      this.buildCategory('Design System', 0, 0.8, prevMaturity),
      this.buildCategory('Business Logic', 0, 1.0, prevMaturity),
      this.buildCategory('Database', 0, 1.0, prevMaturity),
      this.buildCategory('Semantic Layer', 0, 0.8, prevMaturity),
      this.buildCategory('Observability', 0, 0.7, prevMaturity),
      this.buildCategory('Documentation', 0, 0.5, prevMaturity),
      this.buildCategory('Developer Experience', 0, 0.6, prevMaturity),
      this.buildCategory('DQBot Intelligence', 0, 0.9, prevMaturity),
      this.buildCategory('Deployment', 0, 1.0, prevMaturity),
      this.buildCategory('Monitoring', 0, 0.8, prevMaturity),
    ];

    let totalWeight = 0;
    let weightedScore = 0;
    categories.forEach(c => {
      totalWeight += c.weight;
      weightedScore += (c.score * c.weight);
    });

    const overallScore = totalWeight > 0 ? (weightedScore / totalWeight) : 0;

    const newMaturity: ProductMaturity = {
      timestamp: new Date().toISOString(),
      iterationId,
      overallScore: Number(overallScore.toFixed(2)),
      categories
    };

    this.saveProductMaturity(newMaturity);
    return newMaturity;
  }

  private buildCategory(name: string, rawScore: number, weight: number, prev: ProductMaturity | null): CategoryMaturity {
    const prevCat = prev?.categories.find(c => c.name === name);
    const prevScore = prevCat?.score || 0;
    const delta = rawScore - prevScore;
    let trend: 'UP' | 'DOWN' | 'STABLE' = 'STABLE';
    if (delta > 0) trend = 'UP';
    if (delta < 0) trend = 'DOWN';

    // Confidence drops if rawScore is 0 (assuming lack of evidence)
    const confidence = rawScore > 0 ? 1.0 : 0.0;

    return {
      name,
      score: rawScore,
      weight,
      confidence,
      trend,
      historicalDelta: delta,
      objectiveContribution: 0, // Would be calculated by cross-referencing Objective Registry completions
      technicalDebt: rawScore === 0 ? 100 : (100 - rawScore),
      businessValue: Math.round(rawScore * weight),
      evidenceLinks: []
    };
  }

  private saveProductMaturity(maturity: ProductMaturity) {
    const docsDir = this.getDocsDir();
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true });
    }

    // 1. Generate JSON
    const jsonPath = path.join(docsDir, 'product_maturity.json');
    FSUtils.atomicWriteSync(jsonPath, JSON.stringify(maturity, null, 2));

    // 2. Generate MD
    const mdPath = path.join(docsDir, 'product_maturity_report.md');
    let md = `# Product Maturity Report\n\n`;
    md += `**Timestamp:** ${maturity.timestamp}\n`;
    md += `**Iteration:** ${maturity.iterationId}\n`;
    md += `**Overall Score:** ${maturity.overallScore}/100\n\n`;
    
    md += `| Category | Score | Weight | Confidence | Trend | Delta | Tech Debt |\n`;
    md += `| :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n`;
    maturity.categories.forEach(c => {
      md += `| ${c.name} | ${c.score} | ${c.weight} | ${c.confidence} | ${c.trend} | ${c.historicalDelta > 0 ? '+' : ''}${c.historicalDelta} | ${c.technicalDebt} |\n`;
    });

    FSUtils.atomicWriteSync(mdPath, md);
    console.log('[MaturityEngine] Saved product_maturity.json and product_maturity_report.md');
  }
}
