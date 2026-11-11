/**
 * 11-Stage Staged Formula Analysis Pipeline
 * Executes deterministic scientific analysis across 11 stages for "CHECK MY FORMULA".
 */

import { Formula, FormulaAnalysisReport, AnalysisStageReport, MasterIngredient } from '../domain/types';
import { getMasterIngredient } from '../domain/ingredientsMaster';
import { calculateActiveMatter } from './activeMatterEngine';
import { calculateNeutralization } from './neutralizationEngine';
import { estimatePH } from './phEngine';
import { calculateChelation } from './chelationEngine';
import { calculateHLB } from './hlbEngine';
import { calculateDensity } from './densityEngine';
import { estimateViscosity } from './viscosityEngine';
import { calculateCosting } from './costingEngine';
import { checkCompatibility } from './compatibilityEngine';
import { validateProductRouting } from '../domain/taxonomy';

export function runFormulaAnalysisPipeline(
  formula: Formula,
  customIngredients?: MasterIngredient[]
): FormulaAnalysisReport {
  const getIngredient = (id: string): MasterIngredient => {
    if (customIngredients) {
      const custom = customIngredients.find(i => i.id === id);
      if (custom) return custom;
    }
    return getMasterIngredient(id);
  };

  const stages: AnalysisStageReport[] = [];

  // Stage 1: Formula Mass Balance
  let totalWeightKg = 0;
  let waterQuantityKg = 0;
  formula.items.forEach(item => {
    const qty = item.quantityKg || 0;
    totalWeightKg += qty;
    if (item.ingredientId.includes('water')) {
      waterQuantityKg += qty;
    }
  });

  const targetBatchKg = formula.batchSizeKg || 100;
  const discrepancyKg = totalWeightKg - targetBatchKg;
  const isBalanced = Math.abs(discrepancyKg) < 0.01;

  stages.push({
    stageNumber: 1,
    stageName: 'Formula Mass Balance Check',
    inputsSummary: { batchSizeTargetKg: targetBatchKg, totalAddedWeightKg: totalWeightKg },
    calculationMethod: 'Sum of all added raw material masses compared to target batch weight.',
    equationUsed: 'Total_Mass = Sum(Mass_i); Discrepancy = Total_Mass - Target_Batch_Size',
    actualCalculatedResult: {
      totalWeightKg: parseFloat(totalWeightKg.toFixed(2)),
      waterQuantityKg: parseFloat(waterQuantityKg.toFixed(2)),
      waterPercent: parseFloat(((waterQuantityKg / (totalWeightKg || 1)) * 100).toFixed(1)),
      discrepancyKg: parseFloat(discrepancyKg.toFixed(2)),
      isBalanced100Percent: isBalanced
    },
    assumptions: ['Mass conservation in non-reacting solvent mixing.'],
    missingData: [],
    warnings: isBalanced
      ? []
      : [`Formula total (${totalWeightKg.toFixed(2)} kg) does not equal target batch size (${targetBatchKg} kg). Exact discrepancy: ${discrepancyKg > 0 ? '+' : ''}${discrepancyKg.toFixed(2)} kg.`],
    status: isBalanced ? 'PASSED' : 'WARNING'
  });

  // Stage 2: Ingredient Identity and Specification Check
  const unknownList: string[] = [];
  const estimatedList: string[] = [];
  formula.items.forEach(item => {
    const ing = getIngredient(item.ingredientId);
    if (ing.dataStatus === 'UNKNOWN') unknownList.push(ing.commercialName);
    if (ing.dataStatus === 'ESTIMATED_WITH_ASSUMPTIONS') estimatedList.push(ing.commercialName);
  });

  stages.push({
    stageNumber: 2,
    stageName: 'Ingredient Identity & Specification Audit',
    inputsSummary: { itemCount: formula.items.length },
    calculationMethod: '3-tier classification audit across internal master ingredient records.',
    equationUsed: 'Data_Status in { VERIFIED_SPECIFICATION, ESTIMATED_WITH_ASSUMPTIONS, UNKNOWN }',
    actualCalculatedResult: {
      verifiedCount: formula.items.length - unknownList.length - estimatedList.length,
      estimatedCount: estimatedList.length,
      unknownCount: unknownList.length
    },
    assumptions: ['Commercial grade concentration and purity specs based on technical datasheets.'],
    missingData: unknownList.map(u => `Missing verified supplier spec for ${u}.`),
    warnings: unknownList.length > 0 ? [`${unknownList.length} ingredient(s) carry unknown chemical specs.`] : [],
    status: unknownList.length > 0 ? 'WARNING' : 'PASSED'
  });

  // Stage 3: Active Matter Calculation
  const activeMatter = calculateActiveMatter(formula.items, customIngredients);
  stages.push({
    stageNumber: 3,
    stageName: 'Active Surfactant Matter Calculation',
    inputsSummary: { ingredientCount: formula.items.length, batchSizeKg: totalWeightKg },
    calculationMethod: 'Mass fraction weighting of commercial active concentrations.',
    equationUsed: 'Active_Matter (%) = Sum(Mass_i * Active_Fraction_i) / Total_Batch_Weight * 100',
    actualCalculatedResult: {
      totalActiveMatterPercent: parseFloat(activeMatter.totalActiveMatterPercent.toFixed(2)),
      anionicActivePercent: parseFloat(activeMatter.anionicActivePercent.toFixed(2)),
      nonionicActivePercent: parseFloat(activeMatter.nonionicActivePercent.toFixed(2)),
      amphotericActivePercent: parseFloat(activeMatter.amphotericActivePercent.toFixed(2))
    },
    assumptions: ['Commercial active concentrations applied (e.g. LABSA 90%, SLES 28%, AOS 38%, CAPB 30%).'],
    missingData: [],
    warnings: [],
    status: 'PASSED'
  });

  // Stage 4: Surfactant System Analysis & HLB
  const hlbResult = calculateHLB(formula.items, customIngredients);
  stages.push({
    stageNumber: 4,
    stageName: 'Surfactant System & HLB Balance Analysis',
    inputsSummary: { nonionicCount: hlbResult.nonionicIngredientCount },
    calculationMethod: 'Mass-weighted HLB sum for nonionic surfactants.',
    equationUsed: 'HLB_weighted = Sum(Mass_nonionic_i * HLB_i) / Total_Nonionic_Mass',
    actualCalculatedResult: {
      weightedHLB: hlbResult.weightedHLB,
      nonionicRatioPercent: hlbResult.nonionicRatioPercent,
      isApplicable: hlbResult.isApplicable
    },
    assumptions: ['HLB system applied exclusively to nonionic surfactant molecules.'],
    missingData: hlbResult.isApplicable ? [] : ['HLB not applicable or missing for ionic components.'],
    warnings: [],
    status: 'PASSED'
  });

  // Stage 5: Acid-Base & Neutralization Analysis
  const neutralization = calculateNeutralization(formula.items, customIngredients);
  stages.push({
    stageNumber: 5,
    stageName: 'Acid-Base Stoichiometric Neutralization',
    inputsSummary: { labsaQtyKg: neutralization.labsaQuantityKg, causticInFormulaKg: neutralization.causticSodaInFormulaKg },
    calculationMethod: 'Molar neutralization stoichiometry for LABSA acid slurry.',
    equationUsed: neutralization.equation,
    actualCalculatedResult: {
      labsaMoles: parseFloat(neutralization.labsaMoles.toFixed(2)),
      required50PercentCausticKg: parseFloat(neutralization.causticSodaSolutionKgNeeded.toFixed(2)),
      status: neutralization.neutralizationStatus
    },
    assumptions: ['LABSA MW = 322 g/mol, NaOH MW = 40.0 g/mol.'],
    missingData: [],
    warnings: neutralization.neutralizationStatus === 'EXCESS_ACID'
      ? ['Excess un-neutralized sulfonic acid detected! Add caustic soda base to reach neutral pH.']
      : [],
    status: neutralization.neutralizationStatus === 'EXCESS_ACID' ? 'WARNING' : 'PASSED'
  });

  // Stage 6: Estimated pH Analysis
  const phResult = estimatePH(formula.items, customIngredients);
  stages.push({
    stageNumber: 6,
    stageName: 'Thermodynamic Equilibrium pH Estimation',
    inputsSummary: { solverConvergence: phResult.solverConvergence },
    calculationMethod: 'Equilibrium system solver accounting for weak acid/base dissociation and buffers.',
    equationUsed: 'Charge balance: Sum(z_i * [C_i]) + [H+] - [OH-] = 0',
    actualCalculatedResult: {
      estimatedPH: phResult.estimatedPH,
      estimatedPHRange: `${phResult.estimatedPHMin} - ${phResult.estimatedPHMax}`,
      bufferCapacityBeta: phResult.bufferCapacityBeta
    },
    assumptions: phResult.assumptions,
    missingData: phResult.missingInformation,
    warnings: phResult.warnings,
    status: phResult.warnings.length > 0 ? 'WARNING' : 'PASSED'
  });

  // Stage 7: Water Hardness & Chelation Analysis
  const chelation = calculateChelation(formula.items, totalWeightKg, formula.waterHardnessPpmCaCO3 || 150, customIngredients);
  stages.push({
    stageNumber: 7,
    stageName: 'Water Hardness & Chelation Capacity Analysis',
    inputsSummary: { waterHardnessTargetPpm: chelation.waterHardnessPpmCaCO3 },
    calculationMethod: 'Stoichiometric calcium binding capacity sum.',
    equationUsed: 'Capacity (ppm CaCO3) = Sum(Mass_chelator_i * Binding_Capacity_i) / Volume_L',
    actualCalculatedResult: {
      capacityPpmCaCO3: parseFloat(chelation.ppmCaCO3ChelationCapacity.toFixed(1)),
      safetyMarginPercent: parseFloat(chelation.safetyMarginPercent.toFixed(1)),
      isAdequate: chelation.isAdequateForHardness
    },
    assumptions: ['Chelation capacity evaluated against CaCO3 equivalent load.'],
    missingData: [],
    warnings: chelation.isAdequateForHardness
      ? []
      : [`Chelation capacity (${chelation.ppmCaCO3ChelationCapacity.toFixed(0)} ppm) is below hard water load (${chelation.waterHardnessPpmCaCO3} ppm). Formula may form soap scum in hard water.`],
    status: chelation.isAdequateForHardness ? 'PASSED' : 'WARNING'
  });

  // Stage 8: Compatibility & Solubility Analysis
  const compatibility = checkCompatibility(formula.items, customIngredients);
  stages.push({
    stageNumber: 8,
    stageName: 'Chemical & Ionic Compatibility Check',
    inputsSummary: { isCompatible: compatibility.isCompatible },
    calculationMethod: 'Ionic charge mismatch & phase stability rule set.',
    equationUsed: 'Anionic (+) Cationic -> Insoluble Complex Precipitate',
    actualCalculatedResult: {
      isCompatible: compatibility.isCompatible,
      conflictCount: compatibility.conflicts.length
    },
    assumptions: ['Standard ambient solubility limits.'],
    missingData: [],
    warnings: compatibility.conflicts.map(c => c.message),
    status: compatibility.isCompatible ? 'PASSED' : 'WARNING'
  });

  // Stage 9: Viscosity Estimation
  const viscosity = estimateViscosity(formula.items, customIngredients);
  stages.push({
    stageNumber: 9,
    stageName: 'Rheology & Viscosity Estimation',
    inputsSummary: { status: viscosity.status },
    calculationMethod: 'Polymer & electrolyte wormlike micellar thickening model.',
    equationUsed: 'Viscosity = f(SLES_pct, Salt_pct, Polymer_pct)',
    actualCalculatedResult: {
      viscosityRangeCP: viscosity.estimatedViscosityRangeCP ? `${viscosity.estimatedViscosityRangeCP[0]} - ${viscosity.estimatedViscosityRangeCP[1]} cP` : 'INSUFFICIENT_DATA',
      reasoning: viscosity.reasoning
    },
    assumptions: ['Mathematical estimation requires physical viscometer confirmation.'],
    missingData: viscosity.status === 'INSUFFICIENT_DATA' ? [viscosity.reasoning] : [],
    warnings: [],
    status: viscosity.status === 'INSUFFICIENT_DATA' ? 'INSUFFICIENT_DATA' : 'PASSED'
  });

  // Stage 10: Cost & Commercial Calculation
  const costing = calculateCosting(formula.items, totalWeightKg, customIngredients);
  const density = calculateDensity(formula.items, customIngredients);
  stages.push({
    stageNumber: 10,
    stageName: 'Manufacturing Cost & Commercial Margins',
    inputsSummary: { totalDirectCostUSD: costing.directMaterialCostUSD },
    calculationMethod: 'Direct material pricing and margin chain.',
    equationUsed: 'Cost_Per_Kg = Sum(Mass_i * Price_i) / Total_Batch_Mass',
    actualCalculatedResult: {
      costPerKgUSD: costing.costPerKgUSD,
      costPerLiterUSD: costing.costPerLiterUSD,
      densityGPerML: density.calculatedDensityGPerML,
      suggestedRetailPriceUSD: costing.suggestedRetailPriceUSD,
      grossMarginPercent: costing.grossMarginPercentAtRetail
    },
    assumptions: ['Raw material prices based on user or master ingredient default catalog.'],
    missingData: [],
    warnings: [],
    status: 'PASSED'
  });

  // Stage 11: Final Scientific Calculation Report & Product Routing
  const hasHighFoam = formula.items.some(i => i.ingredientId.includes('sles') || i.ingredientId.includes('capb'));
  const hasEnzymes = formula.items.some(i => i.ingredientId.includes('protease') || i.ingredientId.includes('amylase'));

  const routingValidation = validateProductRouting(
    formula.subcategory,
    activeMatter.totalActiveMatterPercent,
    phResult.estimatedPH,
    hasHighFoam,
    hasEnzymes
  );

  stages.push({
    stageNumber: 11,
    stageName: 'Final Scientific Report & Product Routing Compliance',
    inputsSummary: { subcategory: formula.subcategory },
    calculationMethod: 'Product category routing compliance rules against target application.',
    equationUsed: 'Routing Compliance = f(Subcategory, Active_Matter, pH, Foam_Profile, Enzymes)',
    actualCalculatedResult: {
      suitability: routingValidation.suitability,
      notes: routingValidation.notes
    },
    assumptions: ['Application rules tailored specifically for Liquid Detergents and Dish Wash categories.'],
    missingData: [],
    warnings: routingValidation.notes.filter(n => n.includes('CRITICAL') || n.includes('WARNING')),
    status: routingValidation.suitability === 'NON_COMPLIANT' ? 'WARNING' : 'PASSED'
  });

  return {
    formulaId: formula.id,
    formulaName: formula.name,
    mainCategory: formula.mainCategory,
    subcategory: formula.subcategory,
    batchSizeKg: totalWeightKg,
    massBalance: {
      totalWeightKg: parseFloat(totalWeightKg.toFixed(2)),
      waterQuantityKg: parseFloat(waterQuantityKg.toFixed(2)),
      waterPercent: parseFloat(((waterQuantityKg / (totalWeightKg || 1)) * 100).toFixed(1)),
      discrepancyFrom100Percent: parseFloat(discrepancyKg.toFixed(2)),
      isBalanced100Percent: isBalanced
    },
    stages,
    overallSummary: {
      activeMatterPercent: parseFloat(activeMatter.totalActiveMatterPercent.toFixed(2)),
      estimatedPH: `${phResult.estimatedPH} (Range: ${phResult.estimatedPHMin} - ${phResult.estimatedPHMax})`,
      chelationCapacityPpm: parseFloat(chelation.ppmCaCO3ChelationCapacity.toFixed(1)),
      costPerKgUSD: costing.costPerKgUSD,
      productRoutingSuitability: routingValidation.suitability,
      routingNotes: routingValidation.notes
    }
  };
}
