/**
 * Detergent Formula Expert — Master Ingredient Database
 * Extracted, verified, and normalized for Liquid Detergents & Dish Wash applications.
 * All pricing standardized to Indian Commercial Rupees (₹ / kg).
 * Explicit distinction between pure chemical active basis and as-supplied commercial grade basis.
 */

import { MasterIngredient } from './types';

export const MASTER_INGREDIENTS: MasterIngredient[] = [
  // --- ANIONIC SURFACTANTS ---
  {
    id: 'labsa-90',
    chemicalName: 'Linear Alkylbenzene Sulfonic Acid',
    commercialName: 'LABSA 90% (Acid Slurry)',
    category: 'Anionic Surfactant',
    casNumber: '27176-87-0',
    molecularWeight: 322.0,
    activeFraction: 0.90,
    commercialConcentrationPercent: 90,
    density: 1.06,
    typicalPH: 1.5,
    isAcidic: true,
    equivalentWeight: 322.0,
    ionicType: 'anionic',
    functionalRole: 'Primary heavy-duty cleansing anionic surfactant & grease cutter',
    costPerKg: 140.0, // ₹ 140/kg in India
    supplierSpec: 'Standard Commercial Grade 90% Active LABSA, Acid Value ~ 180-190 mg KOH/g',
    dataSource: 'Indian Petrochemicals / Technical Data Sheet',
    dataStatus: 'VERIFIED_SPECIFICATION'
  },
  {
    id: 'sles-28',
    chemicalName: 'Sodium Lauryl Ether Sulfate (2EO)',
    commercialName: 'SLES 28% Liquid (Texapon N70 Dilution)',
    category: 'Anionic Surfactant',
    casNumber: '68585-34-2',
    molecularWeight: 384.0,
    activeFraction: 0.28,
    commercialConcentrationPercent: 28,
    density: 1.04,
    typicalPH: 7.0,
    ionicType: 'anionic',
    functionalRole: 'High-foaming primary anionic surfactant for suds and viscosity building',
    costPerKg: 68.0, // ₹ 68/kg
    supplierSpec: '28% Aqueous Solution Commercial Grade, 1,4-Dioxane < 30 ppm',
    dataSource: 'Godrej Industries / Galaxy Surfactants TDS',
    dataStatus: 'VERIFIED_SPECIFICATION'
  },
  {
    id: 'sles-70',
    chemicalName: 'Sodium Lauryl Ether Sulfate (2EO Paste)',
    commercialName: 'SLES 70% Concentrated Paste',
    category: 'Anionic Surfactant',
    casNumber: '68585-34-2',
    molecularWeight: 384.0,
    activeFraction: 0.70,
    commercialConcentrationPercent: 70,
    density: 1.10,
    typicalPH: 7.2,
    ionicType: 'anionic',
    functionalRole: 'Concentrated anionic surfactant paste for high-active liquids',
    costPerKg: 155.0, // ₹ 155/kg
    supplierSpec: '70% Active Surfactant Paste',
    dataSource: 'Galaxy Surfactants / BASF Technical Datasheet',
    dataStatus: 'VERIFIED_SPECIFICATION'
  },
  {
    id: 'aos-38',
    chemicalName: 'Sodium C14-16 Olefin Sulfonate',
    commercialName: 'AOS 38% Liquid',
    category: 'Anionic Surfactant',
    casNumber: '68439-57-6',
    molecularWeight: 315.0,
    activeFraction: 0.38,
    commercialConcentrationPercent: 38,
    density: 1.05,
    typicalPH: 7.5,
    ionicType: 'anionic',
    functionalRole: 'Hard-water tolerant, high-flash foaming anionic surfactant',
    costPerKg: 95.0, // ₹ 95/kg
    supplierSpec: '38% Active Aqueous Liquid, Free Oil < 1.5%',
    dataSource: 'Godrej Industries AOS-38 TDS',
    dataStatus: 'VERIFIED_SPECIFICATION'
  },
  {
    id: 'sls-30',
    chemicalName: 'Sodium Lauryl Sulfate',
    commercialName: 'SLS 30% Liquid',
    category: 'Anionic Surfactant',
    casNumber: '151-21-3',
    molecularWeight: 288.38,
    activeFraction: 0.30,
    commercialConcentrationPercent: 30,
    density: 1.04,
    typicalPH: 7.5,
    ionicType: 'anionic',
    functionalRole: 'High wetting and foaming primary anionic surfactant',
    costPerKg: 82.0, // ₹ 82/kg
    supplierSpec: '30% Aqueous Solution',
    dataSource: 'Industry Standard Spec Sheet',
    dataStatus: 'VERIFIED_SPECIFICATION'
  },
  {
    id: 'sec-alkane-sulfonate-60',
    chemicalName: 'Sodium Secondary Alkane Sulfonate',
    commercialName: 'Hostapur SAS 60',
    category: 'Anionic Surfactant',
    casNumber: '68037-49-0',
    molecularWeight: 328.0,
    activeFraction: 0.60,
    commercialConcentrationPercent: 60,
    density: 1.08,
    typicalPH: 7.0,
    ionicType: 'anionic',
    functionalRole: 'Extremely high electrolyte & acid/alkali stable anionic surfactant',
    costPerKg: 210.0, // ₹ 210/kg
    supplierSpec: 'Clariant Hostapur SAS 60 TDS',
    dataSource: 'Clariant Specification Sheet',
    dataStatus: 'VERIFIED_SPECIFICATION'
  },

  // --- NONIONIC SURFACTANTS ---
  {
    id: 'c12-14-pareth-7',
    chemicalName: 'Alcohol Ethoxylate C12-14 7EO',
    commercialName: 'Fatty Alcohol Ethoxylate 7EO (LA-7)',
    category: 'Nonionic Surfactant',
    casNumber: '68439-50-9',
    molecularWeight: 510.0,
    activeFraction: 1.0,
    commercialConcentrationPercent: 100,
    density: 0.98,
    typicalPH: 6.5,
    hlb: 12.1,
    ionicType: 'nonionic',
    functionalRole: 'Oily stain emulsifier and grease remover for liquid detergents',
    costPerKg: 175.0, // ₹ 175/kg
    supplierSpec: '100% Active Anhydrous Nonionic, Cloud Point ~ 50-54°C in 1% water',
    dataSource: 'Sasol / Shell Chemical Specification',
    dataStatus: 'VERIFIED_SPECIFICATION'
  },
  {
    id: 'c9-11-pareth-6',
    chemicalName: 'Alcohol Ethoxylate C9-11 6EO',
    commercialName: 'Neodol 91-6',
    category: 'Nonionic Surfactant',
    casNumber: '68439-46-3',
    molecularWeight: 424.0,
    activeFraction: 1.0,
    commercialConcentrationPercent: 100,
    density: 0.98,
    typicalPH: 6.5,
    hlb: 12.5,
    ionicType: 'nonionic',
    functionalRole: 'Fast wetting & oil emulsification nonionic surfactant',
    costPerKg: 185.0, // ₹ 185/kg
    supplierSpec: 'Shell Chemicals Neodol 91-6 TDS',
    dataSource: 'Shell Chemicals TDS',
    dataStatus: 'VERIFIED_SPECIFICATION'
  },
  {
    id: 'lauryl-glucoside',
    chemicalName: 'Lauryl Glucoside',
    commercialName: 'Plantacare 1200 UP (APG 50%)',
    category: 'Nonionic Surfactant',
    casNumber: '110615-47-9',
    molecularWeight: 420.0,
    activeFraction: 0.50,
    commercialConcentrationPercent: 50,
    density: 1.08,
    typicalPH: 11.5,
    hlb: 13.0,
    ionicType: 'nonionic',
    functionalRole: '100% bio-based nonionic alkyl polyglucoside for mild dishwash and laundry',
    costPerKg: 230.0, // ₹ 230/kg
    supplierSpec: 'BASF Plantacare 1200 TDS, 50-53% Solids',
    dataSource: 'BASF Technical Specification',
    dataStatus: 'VERIFIED_SPECIFICATION'
  },
  {
    id: 'coco-glucoside',
    chemicalName: 'Coco Glucoside',
    commercialName: 'Plantacare 818 UP (APG 50%)',
    category: 'Nonionic Surfactant',
    casNumber: '141464-42-8',
    molecularWeight: 380.0,
    activeFraction: 0.50,
    commercialConcentrationPercent: 50,
    density: 1.07,
    typicalPH: 11.5,
    hlb: 13.2,
    ionicType: 'nonionic',
    functionalRole: 'Plant-derived mild nonionic surfactant with high foaming profile',
    costPerKg: 220.0, // ₹ 220/kg
    supplierSpec: '50% Active Aqueous Liquid',
    dataSource: 'BASF Technical Specification',
    dataStatus: 'VERIFIED_SPECIFICATION'
  },
  {
    id: 'pluronic-pe6200',
    chemicalName: 'EO/PO Block Copolymer',
    commercialName: 'Pluronic PE 6200 (Low Foam Nonionic)',
    category: 'Nonionic Surfactant',
    casNumber: '9003-11-6',
    molecularWeight: 2450.0,
    activeFraction: 1.0,
    commercialConcentrationPercent: 100,
    density: 1.04,
    typicalPH: 7.0,
    hlb: 7.0,
    ionicType: 'non_ionic_special',
    functionalRole: 'Strict low-foaming nonionic surfactant for automatic dishwash machines',
    costPerKg: 290.0, // ₹ 290/kg
    supplierSpec: 'BASF Pluronic PE 6200 TDS, 100% Active Liquid',
    dataSource: 'BASF Specification Sheet',
    dataStatus: 'VERIFIED_SPECIFICATION'
  },
  {
    id: 'cdea',
    chemicalName: 'Cocamide Diethanolamine',
    commercialName: 'CDEA 85% (Coconut Diethanolamide)',
    category: 'Nonionic Surfactant',
    casNumber: '68603-42-9',
    molecularWeight: 280.0,
    activeFraction: 0.85,
    commercialConcentrationPercent: 85,
    density: 0.99,
    typicalPH: 9.5,
    hlb: 13.5,
    ionicType: 'nonionic',
    functionalRole: 'Foam booster, suds stabilizer, and viscosity builder',
    costPerKg: 165.0, // ₹ 165/kg
    supplierSpec: '85% Active Viscous Liquid, Free Amine < 5%',
    dataSource: 'Godrej / Galaxy Surfactants TDS',
    dataStatus: 'VERIFIED_SPECIFICATION'
  },

  // --- AMPHOTERIC SURFACTANTS ---
  {
    id: 'capb-30',
    chemicalName: 'Cocamidopropyl Betaine',
    commercialName: 'CAPB 30% Liquid',
    category: 'Amphoteric Surfactant',
    casNumber: '61789-40-0',
    molecularWeight: 342.5,
    activeFraction: 0.30,
    commercialConcentrationPercent: 30,
    density: 1.04,
    typicalPH: 6.0,
    ionicType: 'amphoteric',
    functionalRole: 'Foam booster, skin mildness additive, and viscosity building co-surfactant',
    costPerKg: 85.0, // ₹ 85/kg
    supplierSpec: '30% Aqueous Betaine Solution, NaCl ~ 4.5-5.5%',
    dataSource: 'Evonik / Galaxy Surfactants Specification Sheet',
    dataStatus: 'VERIFIED_SPECIFICATION'
  },
  {
    id: 'lauryl-amine-oxide-30',
    chemicalName: 'Lauramine Oxide',
    commercialName: 'Aromox MMC-12 (30%)',
    category: 'Amphoteric Surfactant',
    casNumber: '1643-20-5',
    molecularWeight: 229.4,
    activeFraction: 0.30,
    commercialConcentrationPercent: 30,
    density: 0.97,
    typicalPH: 7.0,
    ionicType: 'amphoteric',
    functionalRole: 'High grease emulsifier, flash foam booster, and bleach stable amine oxide',
    costPerKg: 135.0, // ₹ 135/kg
    supplierSpec: 'Nouryon Aromox TDS',
    dataSource: 'Nouryon Technical Datasheet',
    dataStatus: 'VERIFIED_SPECIFICATION'
  },

  // --- NEUTRALIZING AGENTS & BASES ---
  {
    id: 'naoh-50',
    chemicalName: 'Sodium Hydroxide Solution (Caustic Soda Lye)',
    commercialName: 'Caustic Soda 50% Liquid (Lye)',
    category: 'Neutralizing Agent / Base',
    casNumber: '1310-73-2',
    molecularWeight: 40.0,
    activeFraction: 0.50,
    commercialConcentrationPercent: 50,
    density: 1.52,
    typicalPH: 14.0,
    isBasic: true,
    equivalentWeight: 40.0,
    functionalRole: 'Primary alkaline neutralizing base for LABSA and saponification',
    costPerKg: 38.0, // ₹ 38/kg
    supplierSpec: '50% Rayon Grade Caustic Soda Solution (GACL / DCM Shriram)',
    dataSource: 'Gujarat Alkalies & Chemicals Ltd (GACL) TDS',
    dataStatus: 'VERIFIED_SPECIFICATION'
  },
  {
    id: 'naoh-flakes',
    chemicalName: 'Sodium Hydroxide Flakes',
    commercialName: 'Caustic Soda 98% Flakes',
    category: 'Neutralizing Agent / Base',
    casNumber: '1310-73-2',
    molecularWeight: 40.0,
    activeFraction: 0.98,
    commercialConcentrationPercent: 98,
    density: 2.13,
    typicalPH: 14.0,
    isBasic: true,
    equivalentWeight: 40.0,
    functionalRole: 'Solid alkaline neutralizing agent',
    costPerKg: 62.0, // ₹ 62/kg
    supplierSpec: '98% Minimum Purity Technical Flakes (GACL)',
    dataSource: 'GACL Technical Specification',
    dataStatus: 'VERIFIED_SPECIFICATION'
  },
  {
    id: 'koh-45',
    chemicalName: 'Potassium Hydroxide Solution (Caustic Potash)',
    commercialName: 'Caustic Potash 45% Liquid',
    category: 'Neutralizing Agent / Base',
    casNumber: '1310-58-3',
    molecularWeight: 56.11,
    activeFraction: 0.45,
    commercialConcentrationPercent: 45,
    density: 1.45,
    typicalPH: 14.0,
    isBasic: true,
    equivalentWeight: 56.11,
    functionalRole: 'High solubility potassium base for liquid laundry concentrates',
    costPerKg: 78.0, // ₹ 78/kg
    supplierSpec: '45% Potassium Hydroxide Liquid',
    dataSource: 'Standard Chemical Specification',
    dataStatus: 'VERIFIED_SPECIFICATION'
  },
  {
    id: 'triethanolamine-99',
    chemicalName: 'Triethanolamine (TEA)',
    commercialName: 'TEA 99% Neutralizing Base',
    category: 'Neutralizing Agent / Base',
    casNumber: '102-71-6',
    molecularWeight: 149.19,
    activeFraction: 0.99,
    commercialConcentrationPercent: 99,
    density: 1.12,
    typicalPH: 10.5,
    pKaValues: [7.76],
    isBasic: true,
    equivalentWeight: 149.19,
    functionalRole: 'Mild organic amine neutralizing agent for soft, clear liquid detergents',
    costPerKg: 190.0, // ₹ 190/kg
    supplierSpec: '99% Pure Technical Grade TEA',
    dataSource: 'Dow Chemical Technical Datasheet',
    dataStatus: 'VERIFIED_SPECIFICATION'
  },
  {
    id: 'monoethanolamine-99',
    chemicalName: 'Monoethanolamine (MEA)',
    commercialName: 'MEA 99% Liquid',
    category: 'Neutralizing Agent / Base',
    casNumber: '141-43-5',
    molecularWeight: 61.08,
    activeFraction: 0.99,
    commercialConcentrationPercent: 99,
    density: 1.01,
    typicalPH: 12.0,
    pKaValues: [9.5],
    isBasic: true,
    equivalentWeight: 61.08,
    functionalRole: 'Compact low molecular weight amine for concentrated liquid laundry',
    costPerKg: 175.0, // ₹ 175/kg
    supplierSpec: 'Huntsman / Dow Technical Specification',
    dataSource: 'Huntsman Corporation TDS',
    dataStatus: 'VERIFIED_SPECIFICATION'
  },

  // --- CHELATING AGENTS & BUILDERS ---
  {
    id: 'glda-47',
    chemicalName: 'Tetrasodium Glutamate Diacetate',
    commercialName: 'Dissolvine GL-47-S (GLDA 47%)',
    category: 'Chelating Agent / Builder',
    casNumber: '51981-21-6',
    molecularWeight: 351.1,
    activeFraction: 0.47,
    commercialConcentrationPercent: 47,
    density: 1.30,
    typicalPH: 11.5,
    chelationCapacityMgCaCO3PerG: 150.0, // Commercial product as-supplied basis
    theoreticalActiveCapacityMgPerG: 319.15, // Pure active basis (1000 * 100.09 / 351.1 * 1.12)
    capacityBasis: 'COMMERCIAL_PRODUCT',
    functionalRole: 'Readily biodegradable eco-friendly chelator for hard water binding',
    costPerKg: 195.0, // ₹ 195/kg
    supplierSpec: 'Nouryon Dissolvine GL-47-S TDS (47% Active Aqueous)',
    dataSource: 'Nouryon Technical Datasheet',
    dataStatus: 'VERIFIED_SPECIFICATION'
  },
  {
    id: 'sodium-citrate-dihydrate',
    chemicalName: 'Trisodium Citrate Dihydrate',
    commercialName: 'Sodium Citrate Dihydrate Powder',
    category: 'Chelating Agent / Builder',
    casNumber: '6132-04-3',
    molecularWeight: 294.1,
    activeFraction: 1.0,
    commercialConcentrationPercent: 100,
    density: 1.85,
    typicalPH: 8.5,
    chelationCapacityMgCaCO3PerG: 120.0, // Commercial product as-supplied basis (HERA project)
    theoreticalActiveCapacityMgPerG: 340.33, // Pure anhydrous basis
    capacityBasis: 'COMMERCIAL_PRODUCT',
    functionalRole: 'Environmentally safe primary builder and pH buffer',
    costPerKg: 85.0, // ₹ 85/kg
    supplierSpec: 'USP / Food Grade Powder',
    dataSource: 'Jungbunzlauer Specification',
    dataStatus: 'VERIFIED_SPECIFICATION'
  },
  {
    id: 'citric-acid-monohydrate',
    chemicalName: 'Citric Acid Monohydrate',
    commercialName: 'Citric Acid Monohydrate',
    category: 'Acid / pH Adjuster',
    casNumber: '5949-29-1',
    molecularWeight: 210.14,
    activeFraction: 1.0,
    commercialConcentrationPercent: 100,
    density: 1.54,
    typicalPH: 2.2,
    pKaValues: [3.13, 4.76, 6.40],
    isAcidic: true,
    equivalentWeight: 70.05,
    chelationCapacityMgCaCO3PerG: 140.0,
    theoreticalActiveCapacityMgPerG: 476.3,
    capacityBasis: 'COMMERCIAL_PRODUCT',
    functionalRole: 'pH adjusting organic acid and weak calcium sequestrant',
    costPerKg: 92.0, // ₹ 92/kg
    supplierSpec: '100% Granular Citric Acid',
    dataSource: 'Jungbunzlauer Datasheet',
    dataStatus: 'VERIFIED_SPECIFICATION'
  },
  {
    id: 'hedp-60',
    chemicalName: '1-Hydroxyethylidene-1,1-Diphosphonic Acid',
    commercialName: 'Dequest 2010 (HEDP 60%)',
    category: 'Chelating Agent / Builder',
    casNumber: '2809-21-4',
    molecularWeight: 206.03,
    activeFraction: 0.60,
    commercialConcentrationPercent: 60,
    density: 1.45,
    typicalPH: 1.5,
    pKaValues: [1.35, 2.87, 7.04, 11.3],
    isAcidic: true,
    chelationCapacityMgCaCO3PerG: 250.0, // Commercial 60% as-supplied basis
    theoreticalActiveCapacityMgPerG: 485.79, // Pure active threshold inhibition basis
    capacityBasis: 'COMMERCIAL_PRODUCT',
    functionalRole: 'High-performance phosphonate threshold scale inhibitor & chelator',
    costPerKg: 235.0, // ₹ 235/kg
    supplierSpec: 'Italmatch Dequest 2010 TDS (60% Aqueous Acid)',
    dataSource: 'Italmatch Chemicals TDS',
    dataStatus: 'VERIFIED_SPECIFICATION'
  },
  {
    id: 'edta-na4',
    chemicalName: 'Tetrasodium Ethylenediaminetetraacetate',
    commercialName: 'Tetrasodium EDTA Powder (Na4EDTA)',
    category: 'Chelating Agent / Builder',
    casNumber: '64-02-8',
    molecularWeight: 380.17,
    activeFraction: 1.0,
    commercialConcentrationPercent: 100,
    density: 1.60,
    typicalPH: 10.5,
    chelationCapacityMgCaCO3PerG: 220.0, // Commercial 99% solid basis
    theoreticalActiveCapacityMgPerG: 263.27, // Pure active stoichiometric basis
    capacityBasis: 'COMMERCIAL_PRODUCT',
    functionalRole: 'Heavy metal and calcium sequestration agent',
    costPerKg: 170.0, // ₹ 170/kg
    supplierSpec: '99% Anhydrous Powder',
    dataSource: 'Dow / BASF Datasheet',
    dataStatus: 'VERIFIED_SPECIFICATION'
  },
  {
    id: 'sodium-gluconate',
    chemicalName: 'Sodium Gluconate',
    commercialName: 'Sodium Gluconate Technical Grade',
    category: 'Chelating Agent / Builder',
    casNumber: '527-07-1',
    molecularWeight: 218.14,
    activeFraction: 1.0,
    commercialConcentrationPercent: 100,
    density: 1.79,
    typicalPH: 7.0,
    chelationCapacityMgCaCO3PerG: 76.0, // Commercial product as-supplied basis
    theoreticalActiveCapacityMgPerG: 458.82,
    capacityBasis: 'COMMERCIAL_PRODUCT',
    functionalRole: 'High alkalinity calcium and iron chelator for machine dishwash (pH > 10.5)',
    costPerKg: 72.0, // ₹ 72/kg
    supplierSpec: 'Technical Crystalline Powder',
    dataSource: 'Jungbunzlauer Datasheet',
    dataStatus: 'VERIFIED_SPECIFICATION'
  },

  // --- ALKALINE BUILDERS (AUTOMATIC DISHWASH & HEAVY DUTY) ---
  {
    id: 'sodium-metasilicate-pentahydrate',
    chemicalName: 'Sodium Metasilicate Pentahydrate',
    commercialName: 'Sodium Metasilicate Pentahydrate',
    category: 'Alkaline Builder',
    casNumber: '10213-79-3',
    molecularWeight: 212.14,
    activeFraction: 1.0,
    commercialConcentrationPercent: 100,
    density: 1.75,
    typicalPH: 12.5,
    isBasic: true,
    functionalRole: 'Alkaline builder, saponification agent, and metal corrosion inhibitor for auto dishwash',
    costPerKg: 55.0, // ₹ 55/kg
    supplierSpec: 'Granular Metasilicate (SiO2:Na2O ~ 1:1)',
    dataSource: 'PQ Corporation Technical Datasheet',
    dataStatus: 'VERIFIED_SPECIFICATION'
  },
  {
    id: 'sodium-carbonate-soda-ash',
    chemicalName: 'Sodium Carbonate',
    commercialName: 'Soda Ash Light',
    category: 'Alkaline Builder',
    casNumber: '497-19-8',
    molecularWeight: 105.99,
    activeFraction: 1.0,
    commercialConcentrationPercent: 100,
    density: 2.54,
    typicalPH: 11.2,
    pKaValues: [6.35, 10.33],
    isBasic: true,
    functionalRole: 'Alkalinity reserve source for fat saponification and hard water precipitation',
    costPerKg: 28.0, // ₹ 28/kg (Tata Chemicals / GHCL)
    supplierSpec: '99.2% Sodium Carbonate Light (Tata Chemicals)',
    dataSource: 'Tata Chemicals Specification Sheet',
    dataStatus: 'VERIFIED_SPECIFICATION'
  },
  {
    id: 'sodium-bicarbonate',
    chemicalName: 'Sodium Bicarbonate',
    commercialName: 'Baking Soda Powder',
    category: 'Alkaline Builder',
    casNumber: '144-55-8',
    molecularWeight: 84.01,
    activeFraction: 1.0,
    commercialConcentrationPercent: 100,
    density: 2.20,
    typicalPH: 8.3,
    pKaValues: [6.35, 10.33],
    isBasic: true,
    functionalRole: 'Mild pH buffer for delicate wash liquids',
    costPerKg: 36.0, // ₹ 36/kg
    supplierSpec: 'Technical / USP Grade Powder',
    dataSource: 'Tata Chemicals Datasheet',
    dataStatus: 'VERIFIED_SPECIFICATION'
  },

  // --- HYDROTROPES & SOLVENTS ---
  {
    id: 'sodium-xylene-sulfonate',
    chemicalName: 'Sodium Xylene Sulfonate',
    commercialName: 'SXS 40% Hydrotrope',
    category: 'Hydrotrope / Solvent',
    casNumber: '1300-72-7',
    molecularWeight: 208.23,
    activeFraction: 0.40,
    commercialConcentrationPercent: 40,
    density: 1.18,
    typicalPH: 8.0,
    functionalRole: 'Solubilizing hydrotrope to lower cloud point and prevent formulation phase separation',
    costPerKg: 90.0, // ₹ 90/kg
    supplierSpec: '40% Active Liquid',
    dataSource: 'Stepan STEPANATE SXS TDS',
    dataStatus: 'VERIFIED_SPECIFICATION'
  },
  {
    id: 'propylene-glycol',
    chemicalName: '1,2-Propanediol',
    commercialName: 'Propylene Glycol USP',
    category: 'Hydrotrope / Solvent',
    casNumber: '57-55-6',
    molecularWeight: 76.10,
    activeFraction: 1.0,
    commercialConcentrationPercent: 100,
    density: 1.036,
    typicalPH: 7.0,
    functionalRole: 'Solvent, freeze-thaw stabilizer, and enzyme liquid stabilizer',
    costPerKg: 155.0, // ₹ 155/kg
    supplierSpec: 'USP / Industrial Grade (Manali Petrochemicals)',
    dataSource: 'Dow Chemical / Manali Petro Technical Datasheet',
    dataStatus: 'VERIFIED_SPECIFICATION'
  },
  {
    id: 'ethanol-denatured',
    chemicalName: 'Ethanol (Denatured)',
    commercialName: 'Ethanol 96% Solvent',
    category: 'Hydrotrope / Solvent',
    casNumber: '64-17-5',
    molecularWeight: 46.07,
    activeFraction: 0.96,
    commercialConcentrationPercent: 96,
    density: 0.81,
    typicalPH: 7.0,
    functionalRole: 'Viscosity reducer and clarity aid in heavy duty concentrated liquids',
    costPerKg: 95.0, // ₹ 95/kg
    supplierSpec: '96% Denatured Alcohol',
    dataSource: 'Industrial Distillery Specification',
    dataStatus: 'VERIFIED_SPECIFICATION'
  },

  // --- POLYMER THICKENERS & RHEOLOGY MODIFIERS ---
  {
    id: 'sodium-chloride',
    chemicalName: 'Sodium Chloride',
    commercialName: 'Industrial Vacuum Salt (NaCl)',
    category: 'Polymer Thickener / Rheology',
    casNumber: '7647-14-5',
    molecularWeight: 58.44,
    activeFraction: 1.0,
    commercialConcentrationPercent: 100,
    density: 2.16,
    typicalPH: 7.0,
    functionalRole: 'Electrolyte viscosity builder for SLES / Betaine micellar thickening',
    costPerKg: 8.0, // ₹ 8/kg
    supplierSpec: '99.5% Pure Refined Salt',
    dataSource: 'Tata Salt / Commercial Grade Spec',
    dataStatus: 'VERIFIED_SPECIFICATION'
  },
  {
    id: 'cmc-viscosity',
    chemicalName: 'Sodium Carboxymethyl Cellulose',
    commercialName: 'CMC Thickener Grade',
    category: 'Polymer Thickener / Rheology',
    casNumber: '9004-32-4',
    activeFraction: 1.0,
    commercialConcentrationPercent: 100,
    density: 1.59,
    typicalPH: 7.0,
    functionalRole: 'Polymer thickener and anti-redeposition agent for laundry liquids',
    costPerKg: 250.0, // ₹ 250/kg
    supplierSpec: 'High Viscosity Grade Powder (1% aq: ~2000-3000 cP)',
    dataSource: 'Ashland Aqualon Datasheet',
    dataStatus: 'ESTIMATED_WITH_ASSUMPTIONS'
  },
  {
    id: 'xanthan-gum',
    chemicalName: 'Xanthan Gum',
    commercialName: 'Xanthan Gum Technical Grade',
    category: 'Polymer Thickener / Rheology',
    casNumber: '11138-66-2',
    activeFraction: 1.0,
    commercialConcentrationPercent: 100,
    density: 1.50,
    typicalPH: 7.0,
    functionalRole: 'Pseudoplastic rheology modifier for acidic or highly alkaline liquids',
    costPerKg: 450.0, // ₹ 450/kg
    supplierSpec: 'CP Kelco Keltrol TDS (80 Mesh Powder)',
    dataSource: 'CP Kelco Technical Specification',
    dataStatus: 'VERIFIED_SPECIFICATION'
  },

  // --- ENZYMES ---
  {
    id: 'protease-liquid',
    chemicalName: 'Subtilisin Protease Enzyme',
    commercialName: 'Savinase 16L Ultra (Protease)',
    category: 'Enzyme',
    casNumber: '9014-01-1',
    activeFraction: 1.0,
    commercialConcentrationPercent: 100,
    density: 1.15,
    typicalPH: 8.0,
    functionalRole: 'Protein stain removal (blood, egg, grass, milk) in liquid laundry',
    costPerKg: 680.0, // ₹ 680/kg
    supplierSpec: 'Novonesis / Novozymes Savinase TDS',
    dataSource: 'Novozymes Product Sheet',
    dataStatus: 'ESTIMATED_WITH_ASSUMPTIONS'
  },
  {
    id: 'amylase-liquid',
    chemicalName: 'Alpha-Amylase Enzyme',
    commercialName: 'Stainzyme 12L (Amylase)',
    category: 'Enzyme',
    casNumber: '9000-90-2',
    activeFraction: 1.0,
    commercialConcentrationPercent: 100,
    density: 1.15,
    typicalPH: 8.0,
    functionalRole: 'Starch soil degradation (pasta, sauce, gravy) for laundry and dishwash',
    costPerKg: 720.0, // ₹ 720/kg
    supplierSpec: 'Novonesis / Novozymes Stainzyme TDS',
    dataSource: 'Novozymes Product Sheet',
    dataStatus: 'ESTIMATED_WITH_ASSUMPTIONS'
  },

  // --- PRESERVATIVES & ADDITIVES ---
  {
    id: 'isothiazolinone-preservative',
    chemicalName: 'CMIT/MIT (5-Chloro-2-methyl-4-isothiazolin-3-one / 2-Methyl-4-isothiazolin-3-one)',
    commercialName: 'Kathon CG / Isothiazolinone 1.5%',
    category: 'Preservative / Biocide',
    casNumber: '55965-84-9',
    activeFraction: 0.015,
    commercialConcentrationPercent: 1.5,
    density: 1.02,
    typicalPH: 4.0,
    functionalRole: 'Broad-spectrum liquid preservative against bacteria, yeast, and fungi',
    costPerKg: 310.0, // ₹ 310/kg
    supplierSpec: '1.5% Active Aqueous Preservative',
    dataSource: 'DuPont / Dow Kathon Specification',
    dataStatus: 'VERIFIED_SPECIFICATION'
  },
  {
    id: 'sodium-benzoate',
    chemicalName: 'Sodium Benzoate',
    commercialName: 'Sodium Benzoate Powder',
    category: 'Preservative / Biocide',
    casNumber: '532-32-1',
    molecularWeight: 144.11,
    activeFraction: 1.0,
    commercialConcentrationPercent: 100,
    density: 1.44,
    typicalPH: 8.0,
    functionalRole: 'Eco-certified preservative for acidic formulations (pH < 6.5)',
    costPerKg: 130.0, // ₹ 130/kg
    supplierSpec: 'FCC Grade Granular',
    dataSource: 'Manufacturer Specification',
    dataStatus: 'VERIFIED_SPECIFICATION'
  },
  {
    id: 'optical-brightener-cbs-x',
    chemicalName: 'Disodium 4,4\'-bis(2-sulfostyryl)biphenyl',
    commercialName: 'Tinopal CBS-X (Fluorescent Brightener)',
    category: 'Other Additive',
    casNumber: '27344-41-8',
    molecularWeight: 562.56,
    activeFraction: 1.0,
    commercialConcentrationPercent: 100,
    density: 1.40,
    typicalPH: 8.5,
    functionalRole: 'Optical brightening whitening agent for cotton and cellulose laundry',
    costPerKg: 1450.0, // ₹ 1450/kg
    supplierSpec: 'BASF Tinopal CBS-X TDS',
    dataSource: 'BASF Specification Sheet',
    dataStatus: 'VERIFIED_SPECIFICATION'
  },
  {
    id: 'fresh-lemon-fragrance',
    chemicalName: 'Fragrance Blend',
    commercialName: 'Fresh Citrus Lemon Fragrance Oil',
    category: 'Fragrance / Colorant',
    activeFraction: 1.0,
    commercialConcentrationPercent: 100,
    density: 0.92,
    typicalPH: 7.0,
    functionalRole: 'Aesthetic fragrance scent addition for dishwash and laundry',
    costPerKg: 1100.0, // ₹ 1100/kg
    supplierSpec: 'Concentrated Industrial Fragrance Compound',
    dataSource: 'Fragrance House Specification',
    dataStatus: 'ESTIMATED_WITH_ASSUMPTIONS'
  },
  {
    id: 'deionized-water',
    chemicalName: 'Deionized Water (Purified Water)',
    commercialName: 'Deionized / Demineralized Water (DI Water)',
    category: 'Water / Base Solvent',
    casNumber: '7732-18-5',
    molecularWeight: 18.015,
    activeFraction: 0.0,
    commercialConcentrationPercent: 0,
    density: 1.00,
    typicalPH: 7.0,
    functionalRole: 'Continuous phase carrier solvent for liquid formulation',
    costPerKg: 0.50, // ₹ 0.50/kg DM Water
    supplierSpec: 'Purified Water Conductivity < 5 µS/cm',
    dataSource: 'Standard Reference Water',
    dataStatus: 'VERIFIED_SPECIFICATION'
  }
];

export function isSurfactantCategory(category: string): boolean {
  return (
    category === 'Anionic Surfactant' ||
    category === 'Nonionic Surfactant' ||
    category === 'Amphoteric Surfactant' ||
    category === 'Cationic Surfactant'
  );
}

export function getMasterIngredient(id: string): MasterIngredient {
  const found = MASTER_INGREDIENTS.find(i => i.id === id);
  if (found) return found;
  return {
    id,
    chemicalName: `Unknown Raw Material (${id})`,
    commercialName: `Commercial Ingredient ${id}`,
    category: 'Other Additive',
    activeFraction: 1.0,
    commercialConcentrationPercent: 100,
    density: 1.0,
    typicalPH: 7.0,
    functionalRole: 'Unclassified Additive',
    costPerKg: 100.0,
    dataSource: 'User Custom Input',
    dataStatus: 'UNKNOWN',
    missingInformationNotes: 'Missing supplier specifications and chemical CAS number.'
  };
}
