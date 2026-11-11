/**
 * Detergent Taxonomy & Scientific Routing Definition
 * Strictly enforces 2 Main Product Categories: LIQUID DETERGENTS & DISH WASH
 */

import { MainCategory, ProductSubcategory } from './types';

export interface CategoryInfo {
  id: MainCategory;
  title: string;
  shortDescription: string;
  detailedDescription: string;
  iconName: string;
  subcategories: SubcategoryInfo[];
}

export interface SubcategoryInfo {
  id: ProductSubcategory;
  parentCategory: MainCategory;
  title: string;
  description: string;
  targetActiveMatterMin: number; // %
  targetActiveMatterMax: number; // %
  targetPHMin: number;
  targetPHMax: number;
  foamRequirement: 'HIGH_FOAM' | 'MODERATE_FOAM' | 'LOW_FOAM_MACHINE' | 'CONTROLLED_FOAM';
  alkalinityRequirement: 'MILD_NEUTRAL' | 'MODERATE_ALKALINE' | 'HIGH_ALKALINE';
  keyDesignRules: string[];
}

export const MAIN_CATEGORIES: CategoryInfo[] = [
  {
    id: 'LIQUID DETERGENTS',
    title: 'Liquid Detergents',
    shortDescription: 'Heavy-duty laundry, hand-wash & machine detergent liquids',
    detailedDescription: 'Formulations engineered for fabric care, stain removal, enzyme stability, and machine compatibility.',
    iconName: 'Shirt',
    subcategories: [
      {
        id: 'hand_wash_laundry',
        parentCategory: 'LIQUID DETERGENTS',
        title: 'Hand-wash Laundry Liquid',
        description: 'Rich foaming liquid detergent optimized for gentle handwashing of garments and fabrics.',
        targetActiveMatterMin: 10,
        targetActiveMatterMax: 18,
        targetPHMin: 6.5,
        targetPHMax: 8.5,
        foamRequirement: 'HIGH_FOAM',
        alkalinityRequirement: 'MILD_NEUTRAL',
        keyDesignRules: [
          'Requires rich foam stability for tactile user perception.',
          'Skin-friendly mild surfactant blend (SLES + CAPB + Nonionic).',
          'Enzyme compatible (pH 7.0 - 8.2).',
          'Avoid harsh unbuffered caustic alkalinity.'
        ]
      },
      {
        id: 'top_load_laundry',
        parentCategory: 'LIQUID DETERGENTS',
        title: 'Top-load Washing Machine Liquid',
        description: 'Medium-foaming liquid detergent engineered for top-loading automated washing machines.',
        targetActiveMatterMin: 12,
        targetActiveMatterMax: 22,
        targetPHMin: 7.5,
        targetPHMax: 9.5,
        foamRequirement: 'MODERATE_FOAM',
        alkalinityRequirement: 'MODERATE_ALKALINE',
        keyDesignRules: [
          'Moderate foam profile prevents machine tub overflow.',
          'Synergistic anionic-nonionic surfactant ratio (LABSA + SLES + Ethoxylated Alcohol).',
          'Requires builder system (Citrate/GLDA) for hard water resistance.',
          'Enzyme stabilization (Protease/Amylase) with Calcium Chloride/Propylene Glycol.'
        ]
      },
      {
        id: 'front_load_laundry',
        parentCategory: 'LIQUID DETERGENTS',
        title: 'Front-load Washing Machine Liquid',
        description: 'Strict low-foaming heavy-duty liquid detergent for front-loading drum washing machines.',
        targetActiveMatterMin: 14,
        targetActiveMatterMax: 25,
        targetPHMin: 7.5,
        targetPHMax: 9.5,
        foamRequirement: 'LOW_FOAM_MACHINE',
        alkalinityRequirement: 'MODERATE_ALKALINE',
        keyDesignRules: [
          'STRICT LOW FOAM: Excess suds dampens drum mechanical tumbling and causes suds lock error.',
          'Incorporate soap/fatty acid suds suppressors or low-foaming nonionic surfactants.',
          'High builder and hydrotrope content to prevent phase separation.',
          'Hard water tolerance up to 300 ppm CaCO3.'
        ]
      },
      {
        id: 'general_laundry',
        parentCategory: 'LIQUID DETERGENTS',
        title: 'General-purpose Laundry Liquid',
        description: 'Versatile liquid laundry detergent for multi-method washing routines.',
        targetActiveMatterMin: 10,
        targetActiveMatterMax: 20,
        targetPHMin: 7.0,
        targetPHMax: 9.0,
        foamRequirement: 'CONTROLLED_FOAM',
        alkalinityRequirement: 'MILD_NEUTRAL',
        keyDesignRules: [
          'Balanced cost-to-performance profile.',
          'LABSA neutralized with NaOH, augmented with SLES and Nonionic.',
          'Balanced builder system with Sodium Citrate.'
        ]
      },
      {
        id: 'concentrated_laundry',
        parentCategory: 'LIQUID DETERGENTS',
        title: 'Concentrated Laundry Liquid (2X / 3X)',
        description: 'High active matter liquid laundry formula for low dosage volume per wash.',
        targetActiveMatterMin: 25,
        targetActiveMatterMax: 45,
        targetPHMin: 7.5,
        targetPHMax: 9.2,
        foamRequirement: 'CONTROLLED_FOAM',
        alkalinityRequirement: 'MODERATE_ALKALINE',
        keyDesignRules: [
          'High active surfactant loading (25% - 45%).',
          'Requires hydrotropes (Sodium Xylene Sulfonate / Ethanol / Propylene Glycol) for physical phase stability.',
          'Lower water content requires precise viscosity control.'
        ]
      }
    ]
  },
  {
    id: 'DISH WASH',
    title: 'Dish Wash',
    shortDescription: 'Manual hand dishwashing liquids & automatic machine dishwashing products',
    detailedDescription: 'Formulations engineered for food grease emulsification, spot-free rinsing, and surface safety.',
    iconName: 'Utensils',
    subcategories: [
      {
        id: 'hand_dishwash',
        parentCategory: 'DISH WASH',
        title: 'Hand Dishwashing Liquid',
        description: 'Grease-cutting manual dishwashing liquid designed for skin mildness and high suds retention.',
        targetActiveMatterMin: 10,
        targetActiveMatterMax: 25,
        targetPHMin: 5.5,
        targetPHMax: 7.5,
        foamRequirement: 'HIGH_FOAM',
        alkalinityRequirement: 'MILD_NEUTRAL',
        keyDesignRules: [
          'Must maintain skin-neutral pH (5.5 - 7.5) to prevent dermatological irritation.',
          'Anionic/Amphoteric synergy: SLES + LABSA + CAPB or Amine Oxide for grease cutting.',
          'Long-lasting suds stability under oil load.',
          'NEVER use harsh machine dishwash alkaline silicates or caustic soda excess.'
        ]
      },
      {
        id: 'auto_dishwasher',
        parentCategory: 'DISH WASH',
        title: 'Automatic Dishwasher Detergent (Machine Dishwash)',
        description: 'High-alkalinity, zero-foam liquid detergent engineered for automatic dishwashing machines.',
        targetActiveMatterMin: 8,
        targetActiveMatterMax: 20,
        targetPHMin: 9.5,
        targetPHMax: 11.8,
        foamRequirement: 'LOW_FOAM_MACHINE',
        alkalinityRequirement: 'HIGH_ALKALINE',
        keyDesignRules: [
          'ABSOLUTELY ZERO HIGH-FOAM SURFACTANTS: Do NOT use SLES or CAPB! High suds destroys water pump pressure.',
          'High alkaline builders (Sodium Metasilicate, Disodium Phosphate, Sodium Carbonate) for food fat saponification.',
          'Low-foaming block copolymer or alkoxylated nonionic surfactants only.',
          'Heavy chelation (GLDA, HEDP, Citrate) to eliminate water spotting on glassware.'
        ]
      }
    ]
  }
];

export function getSubcategoryInfo(subcat: ProductSubcategory): SubcategoryInfo {
  for (const mainCat of MAIN_CATEGORIES) {
    const found = mainCat.subcategories.find(s => s.id === subcat);
    if (found) return found;
  }
  // Fallback default
  return MAIN_CATEGORIES[0].subcategories[0];
}

export function validateProductRouting(
  subcat: ProductSubcategory,
  activeMatterPercent: number,
  estimatedPH: number,
  hasHighFoamSurfactants: boolean, // e.g. SLES / CAPB
  hasEnzymes: boolean
): { suitability: 'OPTIMAL' | 'ACCEPTABLE' | 'NON_COMPLIANT'; notes: string[] } {
  const info = getSubcategoryInfo(subcat);
  const notes: string[] = [];
  let nonCompliant = false;

  // Active matter check
  if (activeMatterPercent < info.targetActiveMatterMin) {
    notes.push(`Active matter (${activeMatterPercent.toFixed(1)}%) is below recommended minimum (${info.targetActiveMatterMin}%) for ${info.title}.`);
  } else if (activeMatterPercent > info.targetActiveMatterMax) {
    notes.push(`Active matter (${activeMatterPercent.toFixed(1)}%) exceeds recommended maximum (${info.targetActiveMatterMax}%) for ${info.title}.`);
  } else {
    notes.push(`Active matter (${activeMatterPercent.toFixed(1)}%) is within the optimal target range (${info.targetActiveMatterMin}% - ${info.targetActiveMatterMax}%).`);
  }

  // pH check
  if (estimatedPH < info.targetPHMin || estimatedPH > info.targetPHMax) {
    notes.push(`Estimated pH (${estimatedPH.toFixed(1)}) is outside target range (${info.targetPHMin} - ${info.targetPHMax}) for ${info.title}.`);
    if (subcat === 'hand_dishwash' && estimatedPH > 8.5) {
      notes.push('CRITICAL: Hand dishwashing pH is too alkaline for skin contact safety (> 8.5).');
      nonCompliant = true;
    }
    if (subcat === 'auto_dishwasher' && estimatedPH < 9.0) {
      notes.push('CRITICAL: Automatic dishwasher detergent requires alkaline pH (> 9.0) for oil saponification.');
      nonCompliant = true;
    }
  } else {
    notes.push(`Estimated pH (${estimatedPH.toFixed(1)}) meets target pH bounds.`);
  }

  // Machine vs Hand Foam requirement check
  if (subcat === 'auto_dishwasher' && hasHighFoamSurfactants) {
    notes.push('CRITICAL VIOLATION: Automatic dishwasher detergent contains high-foaming surfactants (e.g., SLES/CAPB). Suds overflow will ruin machine pump!');
    nonCompliant = true;
  }

  if (subcat === 'front_load_laundry' && hasHighFoamSurfactants) {
    notes.push('WARNING: Front-load laundry formula contains high-foaming surfactants without suds suppressors, which may cause suds lock in washing machine drum.');
  }

  // Enzyme pH compatibility
  if (hasEnzymes) {
    if (estimatedPH < 6.0 || estimatedPH > 9.5) {
      notes.push(`WARNING: Enzymes in formulation are inactive or denatured outside pH 6.0 - 9.5 (current pH: ${estimatedPH.toFixed(1)}).`);
    } else {
      notes.push('Enzymes are stable within the optimal pH window.');
    }
  }

  const suitability = nonCompliant
    ? 'NON_COMPLIANT'
    : notes.some(n => n.startsWith('WARNING') || n.includes('below') || n.includes('exceeds'))
    ? 'ACCEPTABLE'
    : 'OPTIMAL';

  return { suitability, notes };
}
