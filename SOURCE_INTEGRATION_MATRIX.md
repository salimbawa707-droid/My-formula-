# SOURCE INTEGRATION MATRIX

**Source Repository**: `https://github.com/salimbawa707-droid/Formula-expert-.git`
**Target Repository**: `https://github.com/salimbawa707-droid/My-formula-.git`
**Date**: 2026-11-11

---

## 1. Module Mapping & Migration Strategy

| Source Repository Path | Target Engine / Destination | Mathematical Basis | Required Source Dependencies | Integration & Remediation Action |
|---|---|---|---|---|
| `src/domain/ph/pHEngineV2.ts` | `src/engines/ph/pHEngineV2.ts` & `src/engines/phEngine.ts` | Safeguarded Newton-Raphson bisection root-finding on charge balance equation $\sum z_i [C_i] + [H^+] - [OH^-] = 0$ | `activityModel.ts`, `compositionNormalizer.ts`, `confidenceEvaluator.ts`, `equilibriumSystem.ts`, `numericalSolver.ts`, `chemicalSpeciesRegistry.ts`, `acidBaseDataModel.ts`, `types.ts` | Import full self-contained chemical equilibrium engine into `src/engines/ph/`. Replace heuristic `estimatePH` with rigorous equilibrium speciation. |
| `src/domain/ph/stoichiometricNeutralizationEngine.ts` | `src/engines/neutralizationEngine.ts` | Stoichiometric reaction extent: $n_{\text{reactive}} = \frac{m_{\text{acid}} \times a}{\text{EW}_{\text{acid}}}$; limiting reagent & equivalent consumption; water generation: $\text{Moles } H_2O = \min(Eq_{\text{acid}}, Eq_{\text{base}})$ | `acidBaseDataModel.ts`, `types.ts` | Integrate full neutralization engine. Eliminate 50% hardcoding. Add support for NaOH flakes (98-99%), KOH, MEA, TEA, and multi-acid/base scenarios. |
| `src/utils/activeMatterEngine.ts` | `src/engines/activeMatterEngine.ts` | $\text{Surfactant Active Matter (\%)} = \frac{\sum_{\text{surfactants}} (m_i \times a_i)}{M_{\text{batch}}} \times 100$ | `activeMatterInputGuard.ts` | Exclude non-surfactants from surfactant active matter. Distinguish anionic, nonionic, amphoteric, cationic, and non-volatile solids. |
| `src/utils/chelatorEngine.ts` | `src/engines/chelationEngine.ts` | $\text{Hardness Load (mg CaCO}_3) = V_{\text{water}} \times \text{Hardness (mg/L)}$; $\text{Capacity} = \sum m_i \times \text{Capacity}_i$ | `AUTHORITATIVE_CHELATOR_DATABASE` in source chelator engine | Separate pure active basis ($mg/g\text{ active}$) from commercial product basis ($mg/g\text{ product}$). Calculate water volume accurately. |
| `src/utils/costingEngine.ts` | `src/engines/costingEngine.ts` | Direct Material Cost: $\frac{\sum (m_i \times \text{Price}_i)}{M_{\text{batch}}}$; Density scaling for cost per liter | None | Convert currency to Indian Rupee (₹ / INR). Remove invented retail/overhead multipliers. |
| `src/utils/densityEngine.ts` | `src/engines/densityEngine.ts` | Volumetric mass balance: $\rho = \frac{M_{\text{batch}}}{\sum \frac{m_i}{\rho_i}}$ | None | Maintain defensible density estimation; avoid silent 1.0 fallbacks. |
| `src/utils/hlbEngine.ts` | `src/engines/hlbEngine.ts` | Mass-weighted nonionic HLB: $\sum \frac{w_i}{\sum w} \times \text{HLB}_i$ | None | Restrict strictly to nonionic surfactants with verified HLB numbers. |
| `src/utils/viscosityEngine.ts` | `src/engines/viscosityEngine.ts` | Wormlike micellar salt curve & polymer rheology models | None | Enforce strict `INSUFFICIENT_DATA` when electrolyte or polymer curves are uncalibrated. |
| `src/utils/compatibilityEngine.ts` | `src/engines/compatibilityEngine.ts` | Incompatible ionic pairs, pH extremes, precipitation risks | None | Verify ionic classification and formula pH bounds. |
| `src/data/universalIngredientLibrary.ts` | `src/domain/ingredientsMaster.ts` | Empirical & verified raw material specifications | None | Update pricing to realistic Indian commercial INR rates; clarify active vs commercial basis. |
