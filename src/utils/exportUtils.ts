/**
 * Formulation Export & Reporting Utility
 * Generates Dossiers in JSON, CSV, and Printable HTML report formats.
 */

import { Formula, FormulaAnalysisReport, MasterIngredient } from '../domain/types';
import { getMasterIngredient } from '../domain/ingredientsMaster';

export function exportFormulaAsJSON(formula: Formula): void {
  const jsonString = JSON.stringify(formula, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${formula.name.toLowerCase().replace(/[^a-z0-0]/g, '_')}_formula.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportFormulaAsCSV(formula: Formula, customIngredients?: MasterIngredient[]): void {
  const getIngredient = (id: string) => {
    if (customIngredients) {
      const found = customIngredients.find(i => i.id === id);
      if (found) return found;
    }
    return getMasterIngredient(id);
  };

  let csv = `Formula Name,${formula.name}\nCategory,${formula.mainCategory}\nSubcategory,${formula.subcategory}\nBatch Size (kg),${formula.batchSizeKg}\n\n`;
  csv += `Ingredient Commercial Name,Category,Quantity (kg),Quantity (%),Commercial Active (%),Active Weight (kg),Cost/kg (USD),Item Total Cost (USD)\n`;

  let totalWeight = 0;
  let totalCost = 0;

  formula.items.forEach(item => {
    const ing = getIngredient(item.ingredientId);
    const qtyKg = item.quantityKg || 0;
    const activePct = item.activeConcentrationPercentOverride !== undefined
      ? item.activeConcentrationPercentOverride
      : ing.commercialConcentrationPercent;
    const activeKg = qtyKg * (activePct / 100);
    const costPerKg = item.costPerKgOverride !== undefined && item.costPerKgOverride !== null
      ? item.costPerKgOverride
      : ing.costPerKg;
    const hasPrice = costPerKg !== null && costPerKg !== undefined && !isNaN(costPerKg);
    const totalItemCost = hasPrice ? qtyKg * (costPerKg as number) : 0;

    totalWeight += qtyKg;
    if (hasPrice) totalCost += totalItemCost;

    const costStr = hasPrice ? (costPerKg as number).toFixed(2) : 'Unpriced';
    const totalStr = hasPrice ? totalItemCost.toFixed(2) : '—';

    csv += `"${ing.commercialName}","${ing.category}",${qtyKg},${((qtyKg / (formula.batchSizeKg || 100)) * 100).toFixed(2)},${activePct},${activeKg.toFixed(2)},${costStr},${totalStr}\n`;
  });

  csv += `\nTOTAL,${totalWeight.toFixed(2)} kg,100%,,,,$${totalCost.toFixed(2)}\n`;

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${formula.name.toLowerCase().replace(/[^a-z0-0]/g, '_')}_recipe.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function printScientificDossier(formula: Formula, report: FormulaAnalysisReport): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Scientific Formulation Dossier - ${formula.name}</title>
      <style>
        body { font-family: system-ui, -apple-system, sans-serif; padding: 30px; color: #0f172a; line-height: 1.5; }
        h1 { font-size: 24px; color: #0f172a; border-bottom: 2px solid #0284c7; padding-bottom: 8px; }
        h2 { font-size: 18px; color: #0369a1; margin-top: 24px; }
        .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 20px; }
        .card { background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px 16px; border-radius: 6px; }
        table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 13px; }
        th, td { border: 1px solid #cbd5e1; padding: 8px 10px; text-align: left; }
        th { background: #f1f5f9; font-weight: 600; }
        .badge { display: inline-block; padding: 2px 8px; font-size: 11px; font-weight: 600; border-radius: 4px; background: #e0f2fe; color: #0369a1; }
        .stage { border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; margin-bottom: 12px; background: #fafafa; }
        .stage-title { font-weight: 600; color: #0f172a; font-size: 14px; }
        .equation { font-family: monospace; background: #f1f5f9; padding: 4px 8px; border-radius: 4px; display: inline-block; font-size: 12px; }
      </style>
    </head>
    <body>
      <h1>SCIENTIFIC FORMULATION DOSSIER</h1>
      <p><strong>Product Name:</strong> ${formula.name}</p>
      <p><strong>Category:</strong> ${formula.mainCategory} | <strong>Subcategory:</strong> ${formula.subcategory}</p>
      <p><strong>Dossier Date:</strong> ${new Date().toLocaleDateString()}</p>

      <div class="grid">
        <div class="card">
          <strong>Batch Size:</strong> ${report.batchSizeKg} kg<br>
          <strong>Total Active Surfactant Matter:</strong> ${report.overallSummary.activeMatterPercent}%<br>
          <strong>Estimated pH Range:</strong> ${report.overallSummary.estimatedPH}
        </div>
        <div class="card">
          <strong>Direct Material Cost:</strong> $${report.overallSummary.costPerKgUSD.toFixed(3)} / kg<br>
          <strong>Hardness Chelation Capacity:</strong> ${report.overallSummary.chelationCapacityPpm} ppm CaCO3<br>
          <strong>Product Routing Status:</strong> <span class="badge">${report.overallSummary.productRoutingSuitability}</span>
        </div>
      </div>

      <h2>11-STAGE SCIENTIFIC ANALYSIS RESULTS</h2>
      ${report.stages.map(s => `
        <div class="stage">
          <div class="stage-title">Stage ${s.stageNumber}: ${s.stageName}</div>
          <p><strong>Method:</strong> ${s.calculationMethod}</p>
          <p><strong>Equation:</strong> <span class="equation">${s.equationUsed}</span></p>
          <p><strong>Calculated Results:</strong> ${JSON.stringify(s.actualCalculatedResult)}</p>
          ${s.warnings.length > 0 ? `<p style="color: #c2410c;"><strong>Warnings:</strong> ${s.warnings.join(', ')}</p>` : ''}
        </div>
      `).join('')}

      <script>
        window.onload = function() { window.print(); };
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}
