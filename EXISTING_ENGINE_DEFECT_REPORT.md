# EXISTING ENGINE DEFECT REPORT

**Target Application**: My-formula-
**Report Date**: 2026-11-11
**Engine Audit**: Complete Codebase Analysis

---

## 1. Active Matter Engine Defect (Critical)

**File**: `src/engines/activeMatterEngine.ts`

### Defect Analysis
Lines 37–44:
```typescript
const activeContributionMassKg = qtyKg * activeFraction;
totalActiveMassKg += activeContributionMassKg;
```
The calculation iterates over all ingredients in the formula and accumulates `qtyKg * activeFraction` into `totalActiveMassKg`.
Because non-surfactant raw materials in `ingredientsMaster.ts` such as:
- `sodium-metasilicate-pentahydrate` (`activeFraction: 1.0`)
- `sodium-carbonate-soda-ash` (`activeFraction: 1.0`)
- `glda-47` (`activeFraction: 0.47`)
- `sodium-chloride` (`activeFraction: 1.0`)
- `citric-acid-monohydrate` (`activeFraction: 1.0`)

all possess non-zero active fractions, their masses are erroneously added into `totalActiveMassKg`.

### Manifestation in UI
In automatic dishwasher formulations containing 8 kg metasilicate (100% active) + 5 kg soda ash (100% active) + 6 kg GLDA (47% active) + 2.5 kg nonionic surfactant (100% active), the reported "Active Surfactant Matter" is falsely displayed as **20.02%**, when the actual surfactant active content is only **2.50%** (Pluronic PE 6200).

### Required Remediation
- Restrict `Surfactant Active Matter` exclusively to ingredients whose category is `Anionic Surfactant`, `Nonionic Surfactant`, `Amphoteric Surfactant`, or `Cationic Surfactant`.
- Report individual categories: Anionic, Nonionic, Amphoteric, and Cationic Active Matter.
- Report Total Non-Volatile Solids separately if supported, and never conflate it with Surfactant Active Matter.

---

## 2. pH Estimation Engine Defect (Critical)

**File**: `src/engines/phEngine.ts`

### Defect Analysis
Lines 80–117:
```typescript
if (hasSilicate) {
  estimatedPH = 11.2;
} else if (hasCarbonate) {
  estimatedPH = 10.5;
} else if (hasCitrate && hasCitricAcid) {
  estimatedPH = 6.2;
}
```
The engine relies on hardcoded string searches and fixed pH values rather than solving chemical charge balance or thermodynamic equilibrium.
- Buffer capacity is hardcoded (`bufferCapacityBeta = 0.04`).
- Solver convergence is hardcoded to `'CONVERGED'` even when no solver executed.
- No chemical species equilibrium, activity coefficients, or ionic strength calculations are executed.

### Required Remediation
Integrate the complete `pHEngineV2` and its required scientific dependencies from `Formula-expert-` (`chemicalSpeciesRegistry.ts`, `acidBaseDataModel.ts`, `compositionNormalizer.ts`, `equilibriumSystem.ts`, `numericalSolver.ts`, `activityModel.ts`, and `confidenceEvaluator.ts`).
Report `INSUFFICIENT_DATA` when chemical species are unrecognized or active assay data is missing.

---

## 3. Stoichiometric Neutralization Engine Defect (Major)

**File**: `src/engines/neutralizationEngine.ts`

### Defect Analysis
Lines 26 & 64:
- Hardcodes a 50% caustic concentration (`0.50 * 1000`) for caustic solution kg calculation.
- Ignores solid caustic soda flakes (98–99% NaOH).
- Does not calculate reaction-generated water ($H^+ + OH^- \rightarrow H_2O$).
- Fails to model multiple base competition (e.g. TEA + NaOH or MEA + KOH) or polyprotic acid behavior.

### Required Remediation
Integrate `StoichiometricNeutralizationEngine` from `Formula-expert-` with explicit equivalent calculations, limiting reagent tracking, and commercial assay corrections.

---

## 4. Chelation Capacity Engine Defect (Major)

**File**: `src/engines/chelationEngine.ts`

### Defect Analysis
Lines 31–41 & 56:
- Conflates theoretical pure active binding capacity with commercial as-supplied grade capacity.
- Assumes batch mass in kg is identical to water volume in liters without evaluating water concentration or formulation density.
- Does not account for pH operating windows (e.g., Sodium Gluconate is inactive at pH 6–7 but highly active at pH > 11).

### Required Remediation
Integrate `AUTHORITATIVE_CHELATOR_DATABASE` and explicit distinction between:
- Pure active chemical capacity ($mg\text{ CaCO}_3 / g\text{ active}$)
- As-supplied commercial product capacity ($mg\text{ CaCO}_3 / g\text{ commercial}$)
- Realistic water volume based on formulation water mass.

---

## 5. Costing Engine Defect (Major)

**File**: `src/engines/costingEngine.ts`

### Defect Analysis
Lines 60–67:
- All prices are formatted and calculated in USD (`$`) instead of Indian Rupees (`₹`).
- Arbitrarily invents manufacturing overhead (`cost * 1.25`) and retail price (`manufacturingCost * 2.2`), in direct contradiction with the instruction: "Do not invent manufacturing overhead, retail prices or distributor margins."

### Required Remediation
- Change currency across the application to Indian Rupee (₹ / INR).
- Compute direct material cost per kg and cost per liter based on user-entered ingredient prices and actual formula density.
- Remove invented arbitrary multipliers.
