# SOURCE FILE AUDIT REPORT

**Repository**: https://github.com/salimbawa707-droid/Formula-expert-.git
**Branch**: main
**Audit Date**: 2026-11-11
**Auditor**: Senior Formulation Science & Software Architecture Engine

---

## 1. Executive Summary

This audit recursively inspected the source repository `Formula-expert-` to evaluate data structures, calculation engines, chemical data libraries, and software components. The objective is to extract only mathematically defensible calculation logic and verified chemical ingredient data, while discarding LIMS, empirical validation dashboards, lab hardware integrations, fake accuracy/confidence scores, synthetic research generators, and unsupported powder category models.

Each audited component was classified into exactly one of three strict categories:
- `A. MATHEMATICALLY_CONSISTENT`
- `B. USEFUL_WITH_LIMITATIONS`
- `C. NOT_USEFUL`

---

## 2. Comprehensive File Evaluation Matrix

| Source Path | Purpose | Mathematical / Chemical Status | Classification | Reusability / Action Plan |
|---|---|---|---|---|
| `src/data/universalIngredientLibrary.ts` | 430+ raw material ingredient records | Structured ingredient database with CAS, active matter, molecular weight, density, pH properties | **B. USEFUL_WITH_LIMITATIONS** | Extract & normalize for Liquid Detergent and Dishwash ingredients. Clean missing/placeholder data. |
| `src/data/formulas.ts` | 39 commercial formulation templates | Pre-configured ingredient recipes across 13 categories | **B. USEFUL_WITH_LIMITATIONS** | Extract Liquid Laundry & Dishwash formulas only (14 formulas). Reject all powder and surface cleaner formulas. |
| `src/domain/ingredients/ingredientIdentitySSOT.ts` | Single Source of Truth for ingredient identity | Canonical mapping of chemical identity, CAS numbers, and synonyms | **A. MATHEMATICALLY_CONSISTENT** | Adapt into centralized internal Ingredient Master Library with 3-tier data status (`VERIFIED_SPECIFICATION`, `ESTIMATED_WITH_ASSUMPTIONS`, `UNKNOWN`). |
| `src/domain/ph/pHEngineV2.ts` | Equilibrium pH calculation engine | Weak/strong acid-base equilibrium, solver convergence check, dissociation models | **A. MATHEMATICALLY_CONSISTENT** | Core pH estimation engine. Explicitly display assumptions, input uncertainties, and solver convergence status. |
| `src/domain/ph/stoichiometricNeutralizationEngine.ts` | Neutralization stoichiometry for LABSA/Caustic | Stoichiometric NaOH/KOH molar calculations accounting for active % and acid equivalent weight | **A. MATHEMATICALLY_CONSISTENT** | Reuse directly. Strictly accounts for LABSA active fraction (e.g. 90%) and NaOH purity/concentration. |
| `src/domain/ph/acidBaseDataModel.ts` | Dissociation constants (pKa) and molar masses | Thermodynamic data for chemical species | **A. MATHEMATICALLY_CONSISTENT** | Re-use as underlying thermodynamic reference for pH & neutralization calculations. |
| `src/utils/activeMatterEngine.ts` | Surfactant active content calculation | Active Matter (%) = ∑(Qty_i × Active_Fraction_i) / Total_Weight × 100 | **A. MATHEMATICALLY_CONSISTENT** | Re-use for active surfactant analysis. Correctly treats commercial active fractions (e.g. LABSA 90%, SLES 28%, AOS 38%, CAPB 30%). |
| `src/utils/chelatorEngine.ts` | Water hardness chelation capacity calculation | Stoichiometric binding capacity for CaCO3 per gram of GLDA, Citrate, HEDP, EDTA, Gluconate | **A. MATHEMATICALLY_CONSISTENT** | Re-use for chelation capacity & water hardness load evaluation. Expose safety margin and assumptions. |
| `src/utils/hlbEngine.ts` | Hydrophilic-Lipophilic Balance (HLB) calculation | Mass-weighted average HLB for nonionic surfactants | **A. MATHEMATICALLY_CONSISTENT** | Re-use for nonionic surfactant blends. Only calculate when HLB values are known; do not invent HLB for non-surfactants. |
| `src/utils/costingEngine.ts` | Batch & product unit costing | Cost per kg, cost per L, total batch cost, gross margin, distributor/retailer margins | **A. MATHEMATICALLY_CONSISTENT** | Re-use costing logic. Require user-entered prices. |
| `src/utils/densityEngine.ts` | Liquid formulation density calculation | Volumetric mass balance calculation based on raw material densities | **A. MATHEMATICALLY_CONSISTENT** | Re-use for mass-to-volume conversions and costing per liter. |
| `src/utils/viscosityEngine.ts` | Empirical viscosity estimation | Rheology estimation based on electrolyte and polymer concentration | **B. USEFUL_WITH_LIMITATIONS** | Return `INSUFFICIENT_DATA` when polymer or electrolyte parameters are missing. Do not claim to replace rheometer testing. |
| `src/utils/compatibilityEngine.ts` | Ionic charge & chemical compatibility check | Anionic-cationic precipitation warnings, pH instability checks | **A. MATHEMATICALLY_CONSISTENT** | Re-use for compatibility checking in formula analysis. |
| `src/utils/powderEngine/*` | Powder detergent physical & chemical models | Slurry, spray drying, moisture balance for washing powders | **C. NOT_USEFUL** | Discard completely. Washing powder category is prohibited in the new application. |
| `src/utils/lims/*` | Laboratory Information Management System | Sample tracking, lab certificates, validation workflows | **C. NOT_USEFUL** | Discard completely. Prohibited laboratory validation module. |
| `src/utils/labAutomation/*` | Opentrons liquid handler protocol generators | Automated lab pipette protocols | **C. NOT_USEFUL** | Discard completely. Prohibited hardware module. |
| `src/utils/spectroscopy/*` | Spectral analysis (JCAMP-DX / CSV) | IR/UV spectroscopy reading and matching | **C. NOT_USEFUL** | Discard completely. Prohibited lab instrument module. |
| `src/utils/closedLoopRAndD/*` | Closed loop simulation and feedback engines | Synthetic R&D learning loops | **C. NOT_USEFUL** | Discard completely. Prohibited closed-loop / fake research module. |
| `src/utils/empirical*.ts` | Empirical calibration & score generators | Simulated empirical validation dashboards | **C. NOT_USEFUL** | Discard completely. Prohibited synthetic validation architecture. |

---

## 3. Scientific Limitations & Required Modifications

1. **pH Solver Limits**: `pHEngineV2` relies on numerical solver convergence. In non-aqueous or high-electrolyte systems, activity coefficient models (e.g., Extended Debye-Hückel) may have higher uncertainties. The new engine will report solver convergence, estimated pH range, and list missing thermodynamic data.
2. **Viscosity Prediction**: Mathematical formulas cannot fully account for micellar structure transitions (wormlike micelle formation). The viscosity engine must yield `INSUFFICIENT_DATA` unless salt and surfactant parameters are fully defined.
3. **Data Integrity**: Commercial raw materials often lack supplier specifications for CAS or exact active content. All ingredients in the internal database will bear explicit status flags (`VERIFIED_SPECIFICATION`, `ESTIMATED_WITH_ASSUMPTIONS`, or `UNKNOWN`).
