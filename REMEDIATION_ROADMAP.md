# REMEDIATION ROADMAP

**Target Application**: My-formula-
**Execution Order**: Phase-by-phase implementation

---

## Roadmap Milestones

### Milestone 1: Dependencies & Environment Clean-up (Phase 11)
- Remove `@google/genai` from `package.json` and clean `.env.example`.
- Ensure application remains 100% self-contained and offline.

### Milestone 2: Ingredient Master Library & Indian INR (₹) Pricing (Phase 3)
- Update `src/domain/ingredientsMaster.ts` with commercial Indian raw material prices in INR (₹/kg).
- Clarify pure chemical active basis vs commercial as-supplied grade basis.
- Preserve 3-tier status (`VERIFIED_SPECIFICATION`, `ESTIMATED_WITH_ASSUMPTIONS`, `UNKNOWN`).

### Milestone 3: Active Matter Engine Remediation (Phase 4)
- Correct `src/engines/activeMatterEngine.ts`:
  - Calculate Surfactant Active Matter exclusively from surfactant classes (Anionic, Nonionic, Amphoteric, Cationic).
  - Exclude builders, chelators, salts, and non-surfactants from Surfactant Active Matter.
  - Report separate subtotals for each surfactant category and total non-volatile solids.

### Milestone 4: Stoichiometric Neutralization Engine Remediation (Phase 5)
- Replace simplified logic in `src/engines/neutralizationEngine.ts` with the source repository's stoichiometric neutralization engine.
- Support solid NaOH flakes (98–99%), KOH, MEA, TEA, and variable solution concentrations.
- Compute acid/base reactive equivalents, limiting reagents, reaction-generated water, and excess equivalents.

### Milestone 5: Real Equilibrium pH Engine Integration (Phase 6)
- Integrate `pHEngineV2` and its required modules under `src/engines/ph/`.
- Wire `src/engines/phEngine.ts` to execute numerical equilibrium charge balance solving.
- Report real solver convergence, iterations, buffer capacity ($\beta$), ionic strength, and honest `INSUFFICIENT_DATA` when species are unrecognized.

### Milestone 6: Chelation Engine Remediation (Phase 7)
- Integrate `AUTHORITATIVE_CHELATOR_DATABASE` into `src/engines/chelationEngine.ts`.
- Separate pure active capacity ($mg\text{ CaCO}_3 / g$) from commercial as-supplied capacity.
- Calculate actual formulation water volume for water hardness load.

### Milestone 7: Costing, Viscosity, and Compatibility Engine Polish (Phase 8)
- Update `costingEngine.ts` to compute in Indian Rupees (₹), cost per kg, and cost per liter without invented retail markups or overhead multipliers.
- Update `viscosityEngine.ts` and `compatibilityEngine.ts` with honest boundary handling.

### Milestone 8: Formula Database & 11-Stage Pipeline Remediation (Phases 9 & 10)
- Update `src/data/defaultFormulas.ts` and `src/engines/formulaAnalysisPipeline.ts` to use corrected calculation outputs and INR currency.
- Update UI components to display ₹ (INR) and accurate active surfactant matter.

### Milestone 9: Independent Verification & Regression Testing (Phase 12)
- Update `src/engines/tests/engines.test.ts` with comprehensive reference test cases.
- Run tests via `npx --yes tsx --test`, compile applet, lint, and verify in browser.
