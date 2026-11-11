/**
 * Detergent Formula Expert — Default Formulation Templates
 * Strictly categorized into LIQUID DETERGENTS and DISH WASH.
 * Scientifically balanced stoichiometric neutralization, surfactant active matter, and chelation.
 */

import { Formula } from '../domain/types';

export const DEFAULT_FORMULAS: Formula[] = [
  // ==========================================================================
  // CATEGORY 1: LIQUID DETERGENTS
  // ==========================================================================
  {
    id: 'formula-laundry-handwash-std',
    name: 'Hand-Wash Gentle Laundry Liquid (12% Active)',
    description: 'High-foaming mild laundry liquid optimized for handwashing delicate clothes and cottons with skin-neutral citrate buffering.',
    mainCategory: 'LIQUID DETERGENTS',
    subcategory: 'hand_wash_laundry',
    batchSizeKg: 100,
    items: [
      { ingredientId: 'labsa-90', quantityKg: 6.0 },
      { ingredientId: 'naoh-50', quantityKg: 1.58 }, // Balanced neutralization for LABSA + partial citric buffer
      { ingredientId: 'citric-acid-monohydrate', quantityKg: 0.25 }, // Citrate buffer system (pH ~ 7.1)
      { ingredientId: 'sles-28', quantityKg: 20.0 },
      { ingredientId: 'c12-14-pareth-7', quantityKg: 1.5 },
      { ingredientId: 'capb-30', quantityKg: 2.0 },
      { ingredientId: 'sodium-citrate-dihydrate', quantityKg: 1.5 },
      { ingredientId: 'sodium-chloride', quantityKg: 1.2 },
      { ingredientId: 'isothiazolinone-preservative', quantityKg: 0.1 },
      { ingredientId: 'fresh-lemon-fragrance', quantityKg: 0.3 },
      { ingredientId: 'deionized-water', quantityKg: 65.57 }
    ],
    targetActiveMatterMin: 10,
    targetActiveMatterMax: 15,
    targetPHMin: 6.5,
    targetPHMax: 8.0,
    isTemplate: true,
    createdAt: '2026-11-11T00:00:00.000Z',
    updatedAt: '2026-11-11T00:00:00.000Z'
  },
  {
    id: 'formula-laundry-topload-std',
    name: 'Top-Load Machine Laundry Liquid (16% Active)',
    description: 'Balanced medium-foam heavy duty laundry detergent with GLDA/Citrate builder system and protease enzyme for fabric stain removal.',
    mainCategory: 'LIQUID DETERGENTS',
    subcategory: 'top_load_laundry',
    batchSizeKg: 100,
    items: [
      { ingredientId: 'labsa-90', quantityKg: 8.0 },
      { ingredientId: 'naoh-50', quantityKg: 1.84 }, // Balanced neutralization to wash pH ~ 8.5
      { ingredientId: 'sles-28', quantityKg: 18.0 },
      { ingredientId: 'c12-14-pareth-7', quantityKg: 3.5 },
      { ingredientId: 'glda-47', quantityKg: 2.0 },
      { ingredientId: 'sodium-citrate-dihydrate', quantityKg: 2.0 },
      { ingredientId: 'citric-acid-monohydrate', quantityKg: 0.2 },
      { ingredientId: 'propylene-glycol', quantityKg: 2.0 },
      { ingredientId: 'protease-liquid', quantityKg: 0.5 },
      { ingredientId: 'optical-brightener-cbs-x', quantityKg: 0.05 },
      { ingredientId: 'sodium-chloride', quantityKg: 1.0 },
      { ingredientId: 'isothiazolinone-preservative', quantityKg: 0.1 },
      { ingredientId: 'fresh-lemon-fragrance', quantityKg: 0.3 },
      { ingredientId: 'deionized-water', quantityKg: 60.51 }
    ],
    targetActiveMatterMin: 14,
    targetActiveMatterMax: 20,
    targetPHMin: 7.5,
    targetPHMax: 9.0,
    isTemplate: true,
    createdAt: '2026-11-11T00:00:00.000Z',
    updatedAt: '2026-11-11T00:00:00.000Z'
  },
  {
    id: 'formula-laundry-frontload-lowfoam',
    name: 'Front-Load Drum Laundry Liquid (Low Foam 18% Active)',
    description: 'Strict low-foaming front-loader detergent with Pluronic PE copolymer suds suppressor, GLDA chelation, and multi-enzyme stain release.',
    mainCategory: 'LIQUID DETERGENTS',
    subcategory: 'front_load_laundry',
    batchSizeKg: 100,
    items: [
      { ingredientId: 'labsa-90', quantityKg: 8.0 },
      { ingredientId: 'naoh-50', quantityKg: 1.80 },
      { ingredientId: 'c12-14-pareth-7', quantityKg: 9.0 },
      { ingredientId: 'sles-28', quantityKg: 5.0 }, // Controlled low level to prevent suds locking
      { ingredientId: 'pluronic-pe6200', quantityKg: 1.5 }, // Nonionic suds suppressor
      { ingredientId: 'sodium-xylene-sulfonate', quantityKg: 2.5 },
      { ingredientId: 'glda-47', quantityKg: 2.5 },
      { ingredientId: 'sodium-citrate-dihydrate', quantityKg: 2.0 },
      { ingredientId: 'citric-acid-monohydrate', quantityKg: 0.2 },
      { ingredientId: 'protease-liquid', quantityKg: 0.6 },
      { ingredientId: 'amylase-liquid', quantityKg: 0.4 },
      { ingredientId: 'isothiazolinone-preservative', quantityKg: 0.1 },
      { ingredientId: 'fresh-lemon-fragrance', quantityKg: 0.3 },
      { ingredientId: 'deionized-water', quantityKg: 66.1 }
    ],
    targetActiveMatterMin: 15,
    targetActiveMatterMax: 22,
    targetPHMin: 7.5,
    targetPHMax: 9.0,
    isTemplate: true,
    createdAt: '2026-11-11T00:00:00.000Z',
    updatedAt: '2026-11-11T00:00:00.000Z'
  },
  {
    id: 'formula-laundry-concentrated-3x',
    name: '3X Concentrated Ultra Laundry Liquid (30% Active)',
    description: 'High-density compact liquid laundry concentrate with TEA-neutralized LAS for cold-water wash efficacy.',
    mainCategory: 'LIQUID DETERGENTS',
    subcategory: 'concentrated_laundry',
    batchSizeKg: 100,
    items: [
      { ingredientId: 'labsa-90', quantityKg: 15.0 },
      { ingredientId: 'triethanolamine-99', quantityKg: 6.30 }, // Exact stoichiometric TEA neutralization
      { ingredientId: 'c12-14-pareth-7', quantityKg: 11.0 },
      { ingredientId: 'sles-70', quantityKg: 8.0 },
      { ingredientId: 'propylene-glycol', quantityKg: 5.0 },
      { ingredientId: 'sodium-xylene-sulfonate', quantityKg: 4.0 },
      { ingredientId: 'glda-47', quantityKg: 3.0 },
      { ingredientId: 'protease-liquid', quantityKg: 0.8 },
      { ingredientId: 'isothiazolinone-preservative', quantityKg: 0.1 },
      { ingredientId: 'fresh-lemon-fragrance', quantityKg: 0.4 },
      { ingredientId: 'deionized-water', quantityKg: 46.4 }
    ],
    targetActiveMatterMin: 28,
    targetActiveMatterMax: 38,
    targetPHMin: 7.5,
    targetPHMax: 8.8,
    isTemplate: true,
    createdAt: '2026-11-11T00:00:00.000Z',
    updatedAt: '2026-11-11T00:00:00.000Z'
  },
  {
    id: 'formula-laundry-general-econ',
    name: 'General-Purpose Economy Laundry Liquid (10% Active)',
    description: 'Cost-effective everyday liquid laundry detergent for municipal wash conditions.',
    mainCategory: 'LIQUID DETERGENTS',
    subcategory: 'general_laundry',
    batchSizeKg: 100,
    items: [
      { ingredientId: 'labsa-90', quantityKg: 5.0 },
      { ingredientId: 'naoh-50', quantityKg: 1.20 },
      { ingredientId: 'citric-acid-monohydrate', quantityKg: 0.15 },
      { ingredientId: 'sles-28', quantityKg: 18.0 },
      { ingredientId: 'sodium-citrate-dihydrate', quantityKg: 1.0 },
      { ingredientId: 'sodium-chloride', quantityKg: 1.5 },
      { ingredientId: 'isothiazolinone-preservative', quantityKg: 0.1 },
      { ingredientId: 'fresh-lemon-fragrance', quantityKg: 0.25 },
      { ingredientId: 'deionized-water', quantityKg: 72.8 }
    ],
    targetActiveMatterMin: 8,
    targetActiveMatterMax: 12,
    targetPHMin: 7.0,
    targetPHMax: 8.5,
    isTemplate: true,
    createdAt: '2026-11-11T00:00:00.000Z',
    updatedAt: '2026-11-11T00:00:00.000Z'
  },

  // ==========================================================================
  // CATEGORY 2: DISH WASH
  // ==========================================================================
  {
    id: 'formula-dishwash-hand-standard',
    name: 'Commercial Hand Dishwashing Liquid (18% Active)',
    description: 'High-foaming grease-cutting manual dishwashing gel with skin-friendly buffered pH.',
    mainCategory: 'DISH WASH',
    subcategory: 'hand_dishwash',
    batchSizeKg: 100,
    items: [
      { ingredientId: 'labsa-90', quantityKg: 8.0 },
      { ingredientId: 'naoh-50', quantityKg: 2.03 }, // Stoichiometric LABSA + partial citric buffer for pH ~ 6.4
      { ingredientId: 'citric-acid-monohydrate', quantityKg: 0.25 },
      { ingredientId: 'sles-28', quantityKg: 25.0 },
      { ingredientId: 'capb-30', quantityKg: 4.0 },
      { ingredientId: 'cdea', quantityKg: 2.0 },
      { ingredientId: 'sodium-chloride', quantityKg: 1.5 },
      { ingredientId: 'isothiazolinone-preservative', quantityKg: 0.1 },
      { ingredientId: 'fresh-lemon-fragrance', quantityKg: 0.3 },
      { ingredientId: 'deionized-water', quantityKg: 56.82 }
    ],
    targetActiveMatterMin: 15,
    targetActiveMatterMax: 22,
    targetPHMin: 6.0,
    targetPHMax: 7.5,
    isTemplate: true,
    createdAt: '2026-11-11T00:00:00.000Z',
    updatedAt: '2026-11-11T00:00:00.000Z'
  },
  {
    id: 'formula-dishwash-hand-premium',
    name: 'Ultra Premium Grease-Cut Hand Dish Liquid (24% Active)',
    description: 'Ultra concentrated grease cutter with amine oxide booster and skin conditioning betaine at pH 6.4.',
    mainCategory: 'DISH WASH',
    subcategory: 'hand_dishwash',
    batchSizeKg: 100,
    items: [
      { ingredientId: 'labsa-90', quantityKg: 10.0 },
      { ingredientId: 'naoh-50', quantityKg: 2.46 }, // Stoichiometric LABSA + citrate buffer for skin pH ~ 6.22
      { ingredientId: 'citric-acid-monohydrate', quantityKg: 0.30 },
      { ingredientId: 'sles-28', quantityKg: 32.0 },
      { ingredientId: 'lauryl-amine-oxide-30', quantityKg: 5.0 },
      { ingredientId: 'capb-30', quantityKg: 5.0 },
      { ingredientId: 'sodium-chloride', quantityKg: 1.2 },
      { ingredientId: 'glda-47', quantityKg: 0.5 },
      { ingredientId: 'isothiazolinone-preservative', quantityKg: 0.1 },
      { ingredientId: 'fresh-lemon-fragrance', quantityKg: 0.4 },
      { ingredientId: 'deionized-water', quantityKg: 43.04 }
    ],
    targetActiveMatterMin: 22,
    targetActiveMatterMax: 28,
    targetPHMin: 6.0,
    targetPHMax: 7.2,
    isTemplate: true,
    createdAt: '2026-11-11T00:00:00.000Z',
    updatedAt: '2026-11-11T00:00:00.000Z'
  },
  {
    id: 'formula-dishwash-hand-eco',
    name: 'Eco-Friendly Plant-Based Hand Dishwash (14% Active)',
    description: '100% bio-based alkyl polyglucoside and coconut surfactant formula with food-grade preservation and citrate buffer.',
    mainCategory: 'DISH WASH',
    subcategory: 'hand_dishwash',
    batchSizeKg: 100,
    items: [
      { ingredientId: 'lauryl-glucoside', quantityKg: 12.0 },
      { ingredientId: 'coco-glucoside', quantityKg: 8.0 },
      { ingredientId: 'capb-30', quantityKg: 10.0 },
      { ingredientId: 'glda-47', quantityKg: 1.0 },
      { ingredientId: 'sodium-citrate-dihydrate', quantityKg: 0.8 }, // Buffer salt
      { ingredientId: 'citric-acid-monohydrate', quantityKg: 0.15 }, // Buffer acid (pH ~ 6.3)
      { ingredientId: 'xanthan-gum', quantityKg: 0.6 },
      { ingredientId: 'sodium-benzoate', quantityKg: 0.5 },
      { ingredientId: 'fresh-lemon-fragrance', quantityKg: 0.2 },
      { ingredientId: 'deionized-water', quantityKg: 66.75 }
    ],
    targetActiveMatterMin: 12,
    targetActiveMatterMax: 18,
    targetPHMin: 5.5,
    targetPHMax: 6.8,
    isTemplate: true,
    createdAt: '2026-11-11T00:00:00.000Z',
    updatedAt: '2026-11-11T00:00:00.000Z'
  },
  {
    id: 'formula-dishwash-auto-standard',
    name: 'Automatic Dishwasher Liquid Detergent (Zero Foam)',
    description: 'Alkaline machine dishwash liquid with silicate builders and non-foaming copolymer.',
    mainCategory: 'DISH WASH',
    subcategory: 'auto_dishwasher',
    batchSizeKg: 100,
    items: [
      { ingredientId: 'sodium-metasilicate-pentahydrate', quantityKg: 8.0 },
      { ingredientId: 'sodium-carbonate-soda-ash', quantityKg: 5.0 },
      { ingredientId: 'glda-47', quantityKg: 6.0 },
      { ingredientId: 'hedp-60', quantityKg: 2.0 },
      { ingredientId: 'pluronic-pe6200', quantityKg: 2.5 },
      { ingredientId: 'xanthan-gum', quantityKg: 0.5 },
      { ingredientId: 'deionized-water', quantityKg: 76.0 }
    ],
    targetActiveMatterMin: 2,
    targetActiveMatterMax: 10,
    targetPHMin: 10.0,
    targetPHMax: 12.8,
    isTemplate: true,
    createdAt: '2026-11-11T00:00:00.000Z',
    updatedAt: '2026-11-11T00:00:00.000Z'
  },
  {
    id: 'formula-dishwash-auto-commercial',
    name: 'Commercial Heavy-Duty Machine Dishwash Liquid',
    description: 'High-caustic liquid for commercial conveyor dishwashing systems with high calcium sequestration.',
    mainCategory: 'DISH WASH',
    subcategory: 'auto_dishwasher',
    batchSizeKg: 100,
    items: [
      { ingredientId: 'naoh-50', quantityKg: 5.0 },
      { ingredientId: 'sodium-gluconate', quantityKg: 4.0 },
      { ingredientId: 'glda-47', quantityKg: 5.0 },
      { ingredientId: 'hedp-60', quantityKg: 2.5 },
      { ingredientId: 'pluronic-pe6200', quantityKg: 1.5 },
      { ingredientId: 'deionized-water', quantityKg: 82.0 }
    ],
    targetActiveMatterMin: 1,
    targetActiveMatterMax: 8,
    targetPHMin: 11.5,
    targetPHMax: 13.8,
    isTemplate: true,
    createdAt: '2026-11-11T00:00:00.000Z',
    updatedAt: '2026-11-11T00:00:00.000Z'
  }
];
