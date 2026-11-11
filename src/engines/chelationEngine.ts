/**
 * Water Hardness & Chelation Capacity Engine
 * Calculates theoretical and commercial calcium carbonate binding capacity (mg CaCO3)
 * for GLDA, MGDA, Citrate, HEDP, EDTA, Sodium Gluconate, and Polycarboxylates.
 * Distinguishes pure chemical active basis from as-supplied commercial grade basis.
 */

import { FormulaItem, ChelationResult, MasterIngredient } from '../domain/types';
import { getMasterIngredient } from '../domain/ingredientsMaster';
import { calculateDensity } from './densityEngine';

export interface ChelatorSpeciesRecord {
  id: string;
  name: string;
  chemicalName: string;
  theoreticalActiveCapacityMgPerG: number; // mg CaCO3 / g pure active
  effectiveCommercialCapacityMgPerG: number; // mg CaCO3 / g commercial product
  activeDefault: number; // % active
  mechanism: 'CHELATION' | 'SEQUESTRATION' | 'BUILDER_COMPLEXATION' | 'ION_EXCHANGE';
  scientificStatus: 'VERIFIED_COMMERCIAL_GRADE' | 'VERIFIED_THEORETICAL' | 'EMPIRICAL';
  phOperatingRange: { min: number; max: number; optimal: number };
  phDependencyNotes: string;
  citation: string;
}

export const AUTHORITATIVE_CHELATOR_RECORDS: Record<string, ChelatorSpeciesRecord> = {
  'glda-47': {
    id: 'glda-47',
    name: 'GLDA 47% Liquid (Dissolvine GL-47)',
    chemicalName: 'Tetrasodium N,N-bis(carboxymethyl)-L-glutamate (Na4GLDA)',
    theoreticalActiveCapacityMgPerG: 285.04,
    effectiveCommercialCapacityMgPerG: 137.0,
    activeDefault: 47,
    mechanism: 'CHELATION',
    scientificStatus: 'VERIFIED_COMMERCIAL_GRADE',
    phOperatingRange: { min: 6.0, max: 12.0, optimal: 9.0 },
    phDependencyNotes: 'High conditional stability (log K ~ 5.2). Retains strong chelation across pH 6.5 to 12.0.',
    citation: 'Dissolvine GL-47-S Technical Specification & EU Ecolabel Standard'
  },
  'mgda-38': {
    id: 'mgda-38',
    name: 'MGDA 38% Liquid (Trilon M)',
    chemicalName: 'Trisodium Methylglycinediacetate (Na3MGDA)',
    theoreticalActiveCapacityMgPerG: 369.20,
    effectiveCommercialCapacityMgPerG: 155.0,
    activeDefault: 38,
    mechanism: 'CHELATION',
    scientificStatus: 'VERIFIED_COMMERCIAL_GRADE',
    phOperatingRange: { min: 7.0, max: 12.5, optimal: 10.0 },
    phDependencyNotes: 'Fast kinetic sequestration rate; optimal for high-temperature and short-cycle machine washing.',
    citation: 'Trilon M Technical Bulletin & BASF Chelation Guide'
  },
  'sodium-citrate-dihydrate': {
    id: 'sodium-citrate-dihydrate',
    name: 'Sodium Citrate Dihydrate',
    chemicalName: 'Trisodium Citrate Dihydrate (Na3C6H5O7 · 2H2O)',
    theoreticalActiveCapacityMgPerG: 340.32,
    effectiveCommercialCapacityMgPerG: 150.0,
    activeDefault: 100,
    mechanism: 'BUILDER_COMPLEXATION',
    scientificStatus: 'EMPIRICAL',
    phOperatingRange: { min: 7.5, max: 10.5, optimal: 8.5 },
    phDependencyNotes: 'Binding efficiency is pH-dependent (log K ~ 3.5-4.5); chelation weakens below pH 7.0 due to carboxylate protonation.',
    citation: 'HERA Project Eco-Safety Evaluation for Trisodium Citrate'
  },
  'citric-acid-monohydrate': {
    id: 'citric-acid-monohydrate',
    name: 'Citric Acid Monohydrate',
    chemicalName: 'Citric Acid Monohydrate (C6H8O7 · H2O)',
    theoreticalActiveCapacityMgPerG: 476.0,
    effectiveCommercialCapacityMgPerG: 140.0, // at wash pH ~ 7-8 after neutralization
    activeDefault: 100,
    mechanism: 'BUILDER_COMPLEXATION',
    scientificStatus: 'EMPIRICAL',
    phOperatingRange: { min: 7.0, max: 10.0, optimal: 8.5 },
    phDependencyNotes: 'Free acid requires alkali neutralization to Cit3- to activate calcium sequestration.',
    citation: 'Merck Index & Detergent Builder Technology'
  },
  'hedp-60': {
    id: 'hedp-60',
    name: 'HEDP 60% Aqueous (Etidronic Acid)',
    chemicalName: '1-Hydroxyethylidene-1,1-diphosphonic acid',
    theoreticalActiveCapacityMgPerG: 485.79,
    effectiveCommercialCapacityMgPerG: 250.0,
    activeDefault: 60,
    mechanism: 'SEQUESTRATION',
    scientificStatus: 'VERIFIED_COMMERCIAL_GRADE',
    phOperatingRange: { min: 2.0, max: 12.0, optimal: 8.0 },
    phDependencyNotes: 'Operates as sub-stoichiometric threshold crystallization inhibitor for CaCO3 scale prevention (threshold inhibition mode: NOT_MODELED_STOICHIOMETRICALLY; capacity shown reflects stoichiometric sequestration).',
    citation: 'Phosphonate Chelation & Threshold Scale Inhibition Bulletin'
  },
  'edta-na4': {
    id: 'edta-na4',
    name: 'Tetrasodium EDTA 99% Powder',
    chemicalName: 'Tetrasodium Ethylenediaminetetraacetate Solid (Na4EDTA)',
    theoreticalActiveCapacityMgPerG: 263.27,
    effectiveCommercialCapacityMgPerG: 220.0,
    activeDefault: 99,
    mechanism: 'CHELATION',
    scientificStatus: 'VERIFIED_COMMERCIAL_GRADE',
    phOperatingRange: { min: 7.0, max: 13.0, optimal: 10.0 },
    phDependencyNotes: 'Solid tetrasodium salt. Highly effective across wide pH and water hardness ranges.',
    citation: 'Industrial Chelation Standard (Dow Chemical)'
  },
  'sodium-gluconate': {
    id: 'sodium-gluconate',
    name: 'Sodium Gluconate Technical Grade',
    chemicalName: 'Sodium D-gluconate (NaC6H11O7)',
    theoreticalActiveCapacityMgPerG: 458.82,
    effectiveCommercialCapacityMgPerG: 76.0,
    activeDefault: 100,
    mechanism: 'CHELATION',
    scientificStatus: 'EMPIRICAL',
    phOperatingRange: { min: 9.0, max: 14.0, optimal: 11.5 },
    phDependencyNotes: 'Weak calcium chelation below pH 9.0; powerful heavy-metal (Fe3+) chelation in caustic CIP solutions (pH > 11).',
    citation: 'Jungbunzlauer Sodium Gluconate Detergency Guide'
  }
};

function matchChelatorSpecies(ingredientId: string, name: string): ChelatorSpeciesRecord | null {
  const normId = ingredientId.toLowerCase().trim();
  const normName = name.toLowerCase().trim();

  if (AUTHORITATIVE_CHELATOR_RECORDS[normId]) {
    return AUTHORITATIVE_CHELATOR_RECORDS[normId];
  }

  if (normId.includes('glda') || normName.includes('glda') || normName.includes('dissolvine gl')) {
    return AUTHORITATIVE_CHELATOR_RECORDS['glda-47'];
  }
  if (normId.includes('mgda') || normName.includes('mgda') || normName.includes('trilon m')) {
    return AUTHORITATIVE_CHELATOR_RECORDS['mgda-38'];
  }
  if (normId.includes('citrate') || normName.includes('citrate')) {
    return AUTHORITATIVE_CHELATOR_RECORDS['sodium-citrate-dihydrate'];
  }
  if (normId.includes('citric') || normName.includes('citric acid')) {
    return AUTHORITATIVE_CHELATOR_RECORDS['citric-acid-monohydrate'];
  }
  if (normId.includes('hedp') || normName.includes('hedp') || normName.includes('etidron')) {
    return AUTHORITATIVE_CHELATOR_RECORDS['hedp-60'];
  }
  if (normId.includes('edta') || normName.includes('edta') || normName.includes('versene')) {
    return AUTHORITATIVE_CHELATOR_RECORDS['edta-na4'];
  }
  if (normId.includes('gluconate') || normName.includes('gluconate')) {
    return AUTHORITATIVE_CHELATOR_RECORDS['sodium-gluconate'];
  }

  return null;
}

export function calculateChelation(
  items: FormulaItem[],
  batchSizeKg: number = 100,
  waterHardnessPpmCaCO3: number = 150,
  customIngredients?: MasterIngredient[],
  options?: { currentPH?: number | null; washVolumeL?: number; washDoseGrams?: number }
): ChelationResult {
  const getIngredient = (id: string): MasterIngredient => {
    if (customIngredients) {
      const custom = customIngredients.find(i => i.id === id);
      if (custom) return custom;
    }
    return getMasterIngredient(id);
  };

  const densityResult = calculateDensity(items, customIngredients);
  const totalVolumeLiters = densityResult.totalVolumeLiters > 0 ? densityResult.totalVolumeLiters : (batchSizeKg / 1.03);

  let totalBindingCapacityMgCaCO3 = 0; // Commercial as-supplied basis
  let totalActiveBindingCapacityMgCaCO3 = 0; // Pure active chemical basis
  const chelatorBreakdown: ChelationResult['chelatorBreakdown'] = [];
  const warnings: string[] = [];

  const currentPH = options?.currentPH ?? null;

  items.forEach(item => {
    const ing = getIngredient(item.ingredientId);
    const qtyKg = Number.isFinite(item.quantityKg) ? item.quantityKg : 0;
    if (qtyKg <= 0) return;

    const qtyGrams = qtyKg * 1000;
    const species = matchChelatorSpecies(ing.id, ing.chemicalName || ing.commercialName);

    if (species) {
      const activeFrac = ing.activeFraction ?? (species.activeDefault / 100);
      const pureActiveCap = (ing as any).pureActiveCapacityMgCaCO3PerG ?? species.theoreticalActiveCapacityMgPerG;
      const commCap = ing.chelationCapacityMgCaCO3PerG ?? species.effectiveCommercialCapacityMgPerG;

      const commBindingMg = qtyGrams * commCap;
      const activeBindingMg = (qtyGrams * activeFrac) * pureActiveCap;

      totalBindingCapacityMgCaCO3 += commBindingMg;
      totalActiveBindingCapacityMgCaCO3 += activeBindingMg;

      let isWithinPhWindow = true;
      if (currentPH !== null) {
        if (currentPH < species.phOperatingRange.min || currentPH > species.phOperatingRange.max) {
          isWithinPhWindow = false;
          warnings.push(
            `PH Mismatch: ${species.name} operating pH window is ${species.phOperatingRange.min}-${species.phOperatingRange.max} (optimal ${species.phOperatingRange.optimal}), but formula pH is ~${currentPH.toFixed(1)}. ${species.phDependencyNotes}`
          );
        }
      }

      chelatorBreakdown.push({
        ingredientId: item.ingredientId,
        commercialName: ing.commercialName,
        quantityKg: qtyKg,
        activeFraction: activeFrac,
        pureActiveCapacityMgPerG: pureActiveCap,
        commercialCapacityMgPerG: commCap,
        bindingCapacityMgCaCO3: commBindingMg,
        activeBindingCapacityMgCaCO3: activeBindingMg,
        mechanism: species.mechanism,
        phOperatingRange: species.phOperatingRange,
        isWithinPhWindow,
        scientificStatus: species.scientificStatus,
        notes: species.phDependencyNotes
      });
    }
  });

  // Calculate concentration capacity in the formulation liquid (ppm CaCO3 equiv)
  const ppmCaCO3ChelationCapacity = totalVolumeLiters > 0
    ? totalBindingCapacityMgCaCO3 / totalVolumeLiters
    : 0;

  // Wash liquor evaluation (if wash volume / dose provided or using standard 10L wash / 20g dose)
  const washVolL = options?.washVolumeL ?? 10.0;
  const washDoseG = options?.washDoseGrams ?? 20.0;

  const totalFormulaMassKg = items.reduce((sum, it) => sum + (it.quantityKg || 0), 0);
  const effectiveBatchKg = totalFormulaMassKg > 0 ? totalFormulaMassKg : batchSizeKg;

  // mg CaCO3 provided per wash dose = (doseG / (batchKg * 1000)) * totalBindingCapacityMgCaCO3
  const doseFraction = (effectiveBatchKg * 1000 > 0) ? (washDoseG / (effectiveBatchKg * 1000)) : 0;
  const doseDeliveredCapacityMgCaCO3 = totalBindingCapacityMgCaCO3 * doseFraction;

  // Wash hardness load = washVolL * waterHardnessPpmCaCO3
  const hardnessLoadMgCaCO3 = washVolL * waterHardnessPpmCaCO3;

  const chelationCapacityRatio = hardnessLoadMgCaCO3 > 0
    ? doseDeliveredCapacityMgCaCO3 / hardnessLoadMgCaCO3
    : 1.0;

  const safetyMarginPercent = (chelationCapacityRatio - 1.0) * 100;
  const isAdequateForHardness = doseDeliveredCapacityMgCaCO3 >= hardnessLoadMgCaCO3;

  if (chelatorBreakdown.length === 0 && waterHardnessPpmCaCO3 > 100) {
    warnings.push(`No builders or chelating agents present to sequester hard water calcium ions (${waterHardnessPpmCaCO3} ppm CaCO3 load). Precipitation of calcium anionic surfactant salts may occur.`);
  }

  return {
    totalBindingCapacityMgCaCO3: Number(totalBindingCapacityMgCaCO3.toFixed(1)),
    totalActiveBindingCapacityMgCaCO3: Number(totalActiveBindingCapacityMgCaCO3.toFixed(1)),
    ppmCaCO3ChelationCapacity: Number(ppmCaCO3ChelationCapacity.toFixed(1)),
    waterHardnessPpmCaCO3,
    hardnessLoadMgCaCO3: Number(hardnessLoadMgCaCO3.toFixed(1)),
    chelationCapacityRatio: Number(chelationCapacityRatio.toFixed(3)),
    safetyMarginPercent: Number(safetyMarginPercent.toFixed(1)),
    isAdequateForHardness,
    actualWaterVolumeLiters: Number(totalVolumeLiters.toFixed(2)),
    chelatorBreakdown,
    warnings
  };
}
