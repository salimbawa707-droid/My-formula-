import test from 'node:test';
import assert from 'node:assert/strict';

import { calculateActiveMatter } from '../activeMatterEngine';
import { calculateNeutralization } from '../neutralizationEngine';
import { estimatePH } from '../phEngine';
import { calculateChelation } from '../chelationEngine';
import { calculateHLB } from '../hlbEngine';
import { calculateDensity } from '../densityEngine';
import { calculateCosting } from '../costingEngine';
import { runFormulaAnalysisPipeline } from '../formulaAnalysisPipeline';
import { DEFAULT_FORMULAS } from '../../data/defaultFormulas';

test('Active Matter Engine calculates commercial fractions correctly', () => {
  const items = [
    { ingredientId: 'labsa-90', quantityKg: 10 }, // 10 * 0.90 = 9.0 kg active
    { ingredientId: 'sles-28', quantityKg: 20 },  // 20 * 0.28 = 5.6 kg active
    { ingredientId: 'deionized-water', quantityKg: 70 }
  ];
  const result = calculateActiveMatter(items);
  // Total weight = 100 kg. Active mass = 14.6 kg => 14.6%
  assert.equal(result.totalActiveMassKg, 14.6);
  assert.equal(result.totalActiveMatterPercent, 14.6);
});

test('Neutralization Engine calculates caustic demand for LABSA correctly', () => {
  const items = [
    { ingredientId: 'labsa-90', quantityKg: 10 }, // 9.0 kg active LABSA = 9000 / 322 = 27.95 moles
    { ingredientId: 'naoh-50', quantityKg: 2.236 }
  ];
  const result = calculateNeutralization(items);
  assert.ok(result.labsaMoles > 27.9 && result.labsaMoles < 28.0);
  assert.ok(result.causticSodaSolutionKgNeeded > 2.2 && result.causticSodaSolutionKgNeeded < 2.3);
});

test('pH Estimation Engine predicts reasonable pH range', () => {
  const handDish = DEFAULT_FORMULAS.find(f => f.id === 'formula-dishwash-hand-standard');
  assert.ok(handDish);
  const phRes = estimatePH(handDish.items);
  assert.ok(phRes.estimatedPH >= 5.0 && phRes.estimatedPH <= 8.5, `Hand dish pH was ${phRes.estimatedPH}`);
});

test('Chelation Engine evaluates CaCO3 binding capacity', () => {
  const items = [
    { ingredientId: 'glda-47', quantityKg: 2.0 }, // 2000 g * 150 mg/g = 300,000 mg CaCO3
    { ingredientId: 'deionized-water', quantityKg: 98.0 }
  ];
  const result = calculateChelation(items, 100, 150);
  assert.equal(result.totalBindingCapacityMgCaCO3, 300000);
  assert.equal(result.ppmCaCO3ChelationCapacity, 3000);
  assert.equal(result.isAdequateForHardness, true);
});

test('HLB Engine calculates mass-weighted nonionic HLB', () => {
  const items = [
    { ingredientId: 'c12-14-pareth-7', quantityKg: 5.0 }, // HLB = 12.1
    { ingredientId: 'c9-11-pareth-6', quantityKg: 5.0 },  // HLB = 12.5
    { ingredientId: 'deionized-water', quantityKg: 90.0 }
  ];
  const result = calculateHLB(items);
  assert.equal(result.isApplicable, true);
  assert.equal(result.weightedHLB, 12.3);
});

test('Density Engine calculates volumetric mass balance', () => {
  const items = [
    { ingredientId: 'deionized-water', quantityKg: 100 }
  ];
  const result = calculateDensity(items);
  assert.equal(result.calculatedDensityGPerML, 1.0);
  assert.equal(result.totalVolumeLiters, 100);
});

test('Costing Engine calculates USD per kg and margin chain', () => {
  const items = [
    { ingredientId: 'labsa-90', quantityKg: 10, costPerKgOverride: 2.0 },
    { ingredientId: 'deionized-water', quantityKg: 90, costPerKgOverride: 0.01 }
  ];
  const result = calculateCosting(items, 100);
  assert.equal(result.directMaterialCostUSD, 20.9);
  assert.equal(result.costPerKgUSD, 0.209);
});

test('11-Stage Formula Analysis Pipeline executes all stages cleanly', () => {
  const formula = DEFAULT_FORMULAS[0];
  const report = runFormulaAnalysisPipeline(formula);
  assert.equal(report.stages.length, 11);
  assert.equal(report.formulaId, formula.id);
  assert.ok(report.overallSummary.activeMatterPercent > 0);
});
