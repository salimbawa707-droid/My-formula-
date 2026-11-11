/**
 * 11-Stage Staged Formula Analysis Pipeline
 * Executes deterministic scientific analysis across 11 stages for "CHECK MY FORMULA".
 * Fully self-contained, 100% offline, rigorous physical and chemical equations.
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
    const qty = Number.isFinite(item.quantityKg) ? item.quantityKg : 0;
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
    status: isBalanced ? 'CALCULATED' : 'WARNING'
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
    status: unknownList.length > 0 ? 'WARNING' : 'CALCULATED'
  });

  // Stage 3: Active Surfactant Matter Calculation
  const activeMatter = calculateActiveMatter(formula.items, customIngredients);
  stages.push({
    stageNumber: 3,
    stageName: 'Active Surfactant Matter Calculation',
    inputsSummary: { ingredientCount: formula.items.length, batchSizeKg: totalWeightKg },
    calculationMethod: 'Mass fraction weighting of pure surfactant categories only (excluding builders, salts, and solvents).',
    equationUsed: 'Surfactant_Active_Matter (%) = Sum(Mass_surfactant_i * Active_Fraction_i) / Total_Batch_Weight * 100',
    actualCalculatedResult: {
      totalSurfactantActiveMatterPercent: activeMatter.surfactantActiveMatterPercent,
      totalActiveMatterPercent: activeMatter.totalActiveMatterPercent, // backward compatible alias
      anionicActivePercent: activeMatter.anionicActivePercent,
      nonionicActivePercent: activeMatter.nonionicActivePercent,
      amphotericActivePercent: activeMatter.amphotericActivePercent,
      cationicActivePercent: activeMatter.cationicActivePercent,
      nonSurfactantSolidsPercent: activeMatter.nonSurfactantSolidsPercent ?? 0,
      totalDrySolidsPercent: activeMatter.totalDrySolidsPercent ?? 0
    },
    assumptions: ['Only Anionic, Nonionic, Amphoteric, and Cationic surfactants count towards surfactant active matter.'],
    missingData: [],
    warnings: [],
    status: 'CALCULATED'
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
    status: hlbResult.isApplicable ? 'CALCULATED' : 'NOT_APPLICABLE'
  });

  // Stage 5: Acid-Base & Neutralization Analysis
  const neutralization = calculateNeutralization(formula.items, customIngredients);
  stages.push({
    stageNumber: 5,
    stageName: 'Acid-Base Stoichiometric Neutralization',
    inputsSummary: { labsaQtyKg: neutralization.labsaQuantityKg ?? 0, causticInFormulaKg: neutralization.causticSodaInFormulaKg ?? 0 },
    calculationMethod: 'Molar neutralization stoichiometry for acidic surfactants and alkalis.',
    equationUsed: neutralization.equation,
    actualCalculatedResult: {
      labsaMoles: parseFloat((neutralization.labsaMoles ?? 0).toFixed(2)),
      requiredCausticKg: parseFloat((neutralization.causticSodaSolutionKgNeeded ?? neutralization.commercialCausticDemandKg ?? 0).toFixed(2)),
      reactionWaterGeneratedKg: parseFloat((neutralization.reactionWaterGeneratedKg ?? (neutralization.reactionGeneratedWaterGrams / 1000)).toFixed(3)),
      excessAcidMoles: parseFloat((neutralization.excessAcidMoles ?? neutralization.excessAcidEquivalents ?? 0).toFixed(3)),
      excessBaseMoles: parseFloat((neutralization.excessBaseMoles ?? neutralization.excessBaseEquivalents ?? 0).toFixed(3)),
      status: neutralization.neutralizationStatus
    },
    assumptions: ['LABSA MW = 322 g/mol, NaOH MW = 40.0 g/mol, 1:1 molar reactive equivalent.'],
    missingData: [],
    warnings: neutralization.neutralizationStatus === 'UNDER_NEUTRALIZED'
      ? ['Excess un-neutralized sulfonic acid detected! Add neutralizing alkali base to reach neutral target pH.']
      : (neutralization.neutralizationStatus === 'BASE_EXCESS' ? ['Excess un-neutralized alkaline base detected! Formula is caustic without buffering acid.'] : []),
    status: neutralization.neutralizationStatus === 'UNDER_NEUTRALIZED' ? 'WARNING' : 'CALCULATED'
  });

  // Stage 6: Estimated pH Analysis
  const phResult = estimatePH(formula.items, customIngredients);
  stages.push({
    stageNumber: 6,
    stageName: 'Thermodynamic Equilibrium pH Estimation',
    inputsSummary: { solverConvergence: phResult.solverConvergence, iterations: phResult.solverIterations },
    calculationMethod: 'First-principles numerical charge-balance solver with Davies ionic activity corrections.',
    equationUsed: 'Charge balance: Sum(z_i * [C_i]) + [H+] - [OH-] = 0',
    actualCalculatedResult: {
      estimatedPH: phResult.estimatedPH,
      estimatedPHRange: phResult.estimatedPH !== null ? `${phResult.estimatedPHMin} - ${phResult.estimatedPHMax}` : 'UNBUFFERED_NEUTRAL (~6.5-7.5)',
      bufferCapacityBeta: phResult.bufferCapacityBeta,
      ionicStrengthMolar: phResult.ionicStrength
    },
    assumptions: phResult.assumptions,
    missingData: phResult.missingInformation,
    warnings: phResult.warnings,
    status: phResult.warnings.length > 0 ? 'WARNING' : 'CALCULATED'
  });

  // Stage 7: Water Hardness & Chelation Analysis
  const chelation = calculateChelation(
    formula.items,
    totalWeightKg,
    formula.waterHardnessPpmCaCO3 || 150,
    customIngredients,
    { currentPH: phResult.estimatedPH }
  );
  stages.push({
    stageNumber: 7,
    stageName: 'Water Hardness & Chelation Capacity Analysis',
    inputsSummary: { waterHardnessTargetPpm: chelation.waterHardnessPpmCaCO3 },
    calculationMethod: 'Stoichiometric calcium binding capacity on commercial product vs pure active basis.',
    equationUsed: 'Capacity (ppm CaCO3) = Sum(Mass_chelator_i * Commercial_Capacity_i) / Volume_L',
    actualCalculatedResult: {
      capacityPpmCaCO3: chelation.ppmCaCO3ChelationCapacity,
      totalBindingCapacityMgCaCO3: chelation.totalBindingCapacityMgCaCO3,
      totalActiveBindingCapacityMgCaCO3: chelation.totalActiveBindingCapacityMgCaCO3,
      actualWaterVolumeLiters: chelation.actualWaterVolumeLiters,
      safetyMarginPercent: chelation.safetyMarginPercent,
      isAdequate: chelation.isAdequateForHardness
    },
    assumptions: ['Chelation evaluated on both as-supplied commercial basis and theoretical pure active basis.'],
    missingData: [],
    warnings: chelation.warnings || [],
    status: (chelation.warnings && chelation.warnings.length > 0) ? 'WARNING' : 'CALCULATED'
  });

  // Stage 8: Compatibility & Solubility Analysis
  const compatibility = checkCompatibility(formula.items, customIngredients);
  stages.push({
    stageNumber: 8,
    stageName: 'Chemical & Ionic Compatibility Check',
    inputsSummary: { isCompatible: compatibility.isCompatible },
    calculationMethod: 'Ionic charge mismatch & phase stability rule set.',
    equationUsed: 'Anionic (-) + Cationic (+) -> Insoluble Complex Coacervate Precipitate',
    actualCalculatedResult: {
      isCompatible: compatibility.isCompatible,
      conflictCount: compatibility.conflicts.length
    },
    assumptions: ['Standard ambient solubility limits and electrolyte tolerance.'],
    missingData: [],
    warnings: compatibility.conflicts.map(c => c.message),
    status: compatibility.isCompatible ? 'CALCULATED' : 'WARNING'
  });

  // Stage 9: Viscosity Estimation
  const viscosity = estimateViscosity(formula.items, customIngredients);
  stages.push({
    stageNumber: 9,
    stageName: 'Rheology & Viscosity Estimation',
    inputsSummary: { status: viscosity.status },
    calculationMethod: 'Polymer & electrolyte wormlike micellar thickening model.',
    equationUsed: 'Viscosity = f(SLES_pct, Salt_pct, Polymer_pct, Hydrotrope_pct)',
    actualCalculatedResult: {
      viscosityRangeCP: viscosity.estimatedViscosityRangeCP ? `${viscosity.estimatedViscosityRangeCP[0]} - ${viscosity.estimatedViscosityRangeCP[1]} cP` : 'INSUFFICIENT_DATA',
      reasoning: viscosity.reasoning
    },
    assumptions: ['Mathematical estimation requires physical viscometer confirmation.'],
    missingData: viscosity.status === 'INSUFFICIENT_DATA' ? [viscosity.reasoning] : [],
    warnings: [],
    status: viscosity.status === 'INSUFFICIENT_DATA' ? 'INSUFFICIENT_DATA' : 'CALCULATED'
  });

  // Stage 10: Cost & Commercial Calculation
  const costing = calculateCosting(formula.items, totalWeightKg, customIngredients);
  const density = calculateDensity(formula.items, customIngredients);
  stages.push({
    stageNumber: 10,
    stageName: 'Indian Commercial Costing & Density',
    inputsSummary: { totalDirectCostINR: costing.directMaterialCostINR },
    calculationMethod: 'Direct raw material cost sum in Indian Commercial Rupees (₹) and density-based volumetric costing.',
    equationUsed: 'Cost_Per_Kg_INR = Direct_Material_Cost_INR / Total_Batch_Weight; Cost_Per_Liter_INR = Cost_Per_Kg_INR * Density',
    actualCalculatedResult: {
      directMaterialCostINR: costing.directMaterialCostINR,
      costPerKgINR: costing.costPerKgINR,
      costPerLiterINR: costing.costPerLiterINR,
      densityGPerML: density.calculatedDensityGPerML,
      currency: costing.currency
    },
    assumptions: ['Raw material pricing based on Indian commercial chemical market rates in ₹ / kg.'],
    missingData: [],
    warnings: [],
    status: 'CALCULATED'
  });

  // Stage 11: Final Scientific Calculation Report & Product Routing
  const hasHighFoam = formula.items.some(i => i.ingredientId.includes('sles') || i.ingredientId.includes('capb'));
  const hasEnzymes = formula.items.some(i => i.ingredientId.includes('protease') || i.ingredientId.includes('amylase'));

  const routingValidation = validateProductRouting(
    formula.subcategory,
    activeMatter.surfactantActiveMatterPercent,
    phResult.estimatedPH ?? 7.0,
    hasHighFoam,
    hasEnzymes
  );

  stages.push({
    stageNumber: 11,
    stageName: 'Final Scientific Report & Product Routing Compliance',
    inputsSummary: { subcategory: formula.subcategory },
    calculationMethod: 'Product category routing compliance rules against target application.',
    equationUsed: 'Routing Compliance = f(Subcategory, Surfactant_Active_Matter, pH, Foam_Profile, Enzymes)',
    actualCalculatedResult: {
      suitability: routingValidation.suitability,
      notes: routingValidation.notes
    },
    assumptions: ['Application rules strictly partitioned into Liquid Detergents and Dish Wash categories.'],
    missingData: [],
    warnings: routingValidation.notes.filter(n => n.includes('CRITICAL') || n.includes('WARNING')),
    status: routingValidation.suitability === 'NON_COMPLIANT' ? 'WARNING' : 'CALCULATED'
  });

  const estimatedPHString = phResult.estimatedPH !== null
    ? `${phResult.estimatedPH} (Range: ${phResult.estimatedPHMin} - ${phResult.estimatedPHMax})`
    : 'UNBUFFERED_NEUTRAL (~6.5-7.5)';

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
      surfactantActiveMatterPercent: activeMatter.surfactantActiveMatterPercent,
      activeMatterPercent: activeMatter.surfactantActiveMatterPercent, // alias
      estimatedPH: estimatedPHString,
      chelationCapacityPpm: chelation.ppmCaCO3ChelationCapacity,
      costPerKgINR: costing.costPerKgINR,
      costPerKgUSD: costing.costPerKgINR, // backward compatible alias
      productRoutingSuitability: routingValidation.suitability,
      routingNotes: routingValidation.notes
    }
  };
}
