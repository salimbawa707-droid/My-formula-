# MISSING DEPENDENCY REPORT

**Target Application**: My-formula-
**Report Date**: 2026-11-11

---

## 1. Dependencies Required from Source Repository

To support the genuine chemical equilibrium pH engine and stoichiometric neutralization without heuristics, the following module dependencies from `/tmp/source_repo/src/domain/ph/` must be integrated into `src/engines/ph/`:

1. `types.ts`: Chemical species definitions, `DetailedPHResult`, `PHCalculationOptions`, `ActivityModelType`.
2. `acidBaseDataModel.ts`: Thermodynamic database of $pKa$ values, molar masses, charge numbers, basicity/acidity classifications, and reactive equivalent models.
3. `activityModel.ts`: Extended Debye-Hückel and Davies ionic activity coefficient models.
4. `chemicalSpeciesRegistry.ts`: Authoritative mapping between commercial ingredient IDs, CAS numbers, and ionic chemical species.
5. `compositionNormalizer.ts`: Normalization of formulation batches, water volume extraction, and unrecognized ingredient detection.
6. `equilibriumSystem.ts`: Mathematical charge balance residual equation and derivative formulation for Newton-Raphson.
7. `numericalSolver.ts`: Safeguarded 1D Newton-Raphson numerical solver with bracketed bisection fallback and root convergence tracking.
8. `confidenceEvaluator.ts`: Scientific confidence scoring and model limitation auditing.
9. `pHEngineV2.ts`: Master orchestrator coordinating composition normalization, species mapping, equilibrium solving, and reporting.

---

## 2. Unnecessary & Prohibited Dependencies to Remove

1. `@google/genai` in `package.json`:
   - Application is strictly self-contained and offline.
   - No external AI API calls or keys are required.
   - Must be removed from `package.json` and `.env.example`.
2. Prohibited modules from source repository:
   - No LIMS (`src/utils/lims/*`).
   - No Lab Automation / Opentrons (`src/utils/labAutomation/*`).
   - No Spectroscopy readers (`src/utils/spectroscopy/*`).
   - No Powder Detergent engines (`src/utils/powderEngine/*`).
   - No Synthetic empirical validation dashboards.
