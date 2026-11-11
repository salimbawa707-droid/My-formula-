# CURRENT APP STATUS — MY-FORMULA SCIENTIFIC ENGINE AUDIT

**Target Application**: My-formula-
**Audit Date**: 2026-11-11
**Environment**: Google AI Studio / Offline-Ready Web Application

---

## 1. Executive Summary

The target application **My-formula-** is an interactive React 19 + TypeScript + Tailwind CSS detergent formulation workbench with local persistence (`LocalStorage`), UI navigation, and interactive formula editing.

The application strictly adheres to the two-category mandate:
1. **LIQUID DETERGENTS** (Hand-wash, Top-load, Front-load, General-purpose, Concentrated 2X/3X)
2. **DISH WASH** (Hand dishwashing, Automatic dishwasher detergent)

However, an independent inspection of the calculation engines in `src/engines/` reveals several critical scientific defects, simplified placeholders, and heuristic shortcuts that must be replaced by mathematically defensible logic extracted from the main scientific repository (`Formula-expert-`).

---

## 2. Component Implementation Status

| Component / Subsystem | Implementation Status | Scientific Validity | Defect / Deficiency Summary |
|---|---|---|---|
| **Category Taxonomy (`src/domain/taxonomy.ts`)** | Fully Implemented | High | Strictly enforces 2 main categories (Liquid Detergents & Dish Wash); clean routing logic. |
| **Ingredient Library (`src/domain/ingredientsMaster.ts`)** | Implemented | Moderate | 85 ingredients with 3-tier status, but contains USD prices instead of Indian commercial INR (₹) rates, and needs active basis vs as-supplied clarity. |
| **Active Matter Engine (`src/engines/activeMatterEngine.ts`)** | Implemented with Critical Defect | **Incorrect** | Sums active fraction of ALL ingredients (including builders, salts, chelators), falsely inflating surfactant active matter. |
| **Neutralization Engine (`src/engines/neutralizationEngine.ts`)** | Partially Implemented | Limited | Hardcodes 50% liquid caustic assumption and single 322 g/mol MW; lacks solid flakes (98-99%), reaction-generated water, and multi-alkali limiting reagent solving. |
| **pH Estimation Engine (`src/engines/phEngine.ts`)** | Heuristic Placeholder | **Defective** | Uses hardcoded pH plateaus (`pH 11.2` for silicates, `10.5` for carbonates), fake buffer beta (`0.04`), and simulated convergence rather than chemical equilibrium. |
| **Chelation Engine (`src/engines/chelationEngine.ts`)** | Implemented with Flaws | Limited | Conflates pure active chemical capacity with as-supplied commercial grade capacity; assumes batch mass equals water volume without basis separation. |
| **HLB Engine (`src/engines/hlbEngine.ts`)** | Implemented | Defensible | Accurately calculates mass-weighted nonionic HLB; excludes ionic surfactants. |
| **Density Engine (`src/engines/densityEngine.ts`)** | Implemented | Defensible | Uses volumetric mass balance with explicit assumption logging. |
| **Costing Engine (`src/engines/costingEngine.ts`)** | Implemented with Defect | Incorrect Units & Inventions | Uses USD ($) instead of INR (₹); invents retail pricing (2.2x multiplier) and manufacturing overhead (1.25x) contrary to specifications. |
| **Viscosity Engine (`src/engines/viscosityEngine.ts`)** | Partially Implemented | Moderate | Has `INSUFFICIENT_DATA` fallback, but salt curve ranges need stricter boundary checks. |
| **Compatibility Engine (`src/engines/compatibilityEngine.ts`)** | Implemented | Moderate | Detects anionic/cationic precipitation and extreme pH; needs refined surfactant synergy matrix. |
| **11-Stage Pipeline (`src/engines/formulaAnalysisPipeline.ts`)** | Implemented | Moderate | Orchestrates 11 stages, but inherits defects from underlying pH, active matter, and chelation engines. |
| **UI Components (`src/components/*`)** | Fully Functional | Excellent | Clean industrial chemical R&D interface, responsive layout, print dossier, CSV/JSON export, comparison view, and batch records. |

---

## 3. Preserved Modules
All working UI components (`Layout.tsx`, `CategorySelector.tsx`, `FormulaBuilder.tsx`, `FormulaAnalysisView.tsx`, `IngredientLibrary.tsx`, `FormulaLibrary.tsx`, `FormulaComparison.tsx`, `CalculatorsView.tsx`, `BatchRecordsView.tsx`) and persistence mechanisms (`formulaStore.ts`) are preserved. Only underlying mathematical engines, chemical databases, and calculation pipelines are remediated.
