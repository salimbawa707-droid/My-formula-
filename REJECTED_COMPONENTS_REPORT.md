# REJECTED COMPONENTS REPORT

This report details all prohibited architectural modules, unscientific features, and non-conforming category code rejected from the repository during the migration to the new formulation application.

---

## 1. Summary of Prohibited & Rejected Modules

| Rejected Path / Feature | Category | Reason for Rejection |
|---|---|---|
| `src/utils/lims/*`, `src/domain/lims/*` | LIMS & Lab Workflows | Prohibited module. Lab validation certificates, sample tracking, and LIMS gates do not belong in a mathematical formulation engine. |
| `src/utils/labAutomation/*` | Hardware & Robotics | Prohibited module. Opentrons liquid handler protocol generators and labware deck layouts are out of scope. |
| `src/utils/spectroscopy/*` | Instrument Integration | Prohibited module. JCAMP-DX readers and spectral curve matchers require laboratory equipment. |
| `src/utils/closedLoopRAndD/*` | Synthetic R&D / Fake Evidence | Prohibited module. Generates synthetic laboratory evidence and automated learning loops with unbacked claims. |
| `src/utils/empirical*.ts` | Empirical Validation Dashboards | Prohibited module. Displays simulated empirical scores and hardcoded performance percentages. |
| `src/utils/powderEngine/*` | Unsupported Category | Washing powders and solid powder formulations are explicitly excluded (only Liquid Detergents and Dish Wash permitted). |
| `src/data/formulas.ts` (Powder/Surface/Toilet/Glass entries) | Non-Conforming Formulas | Rejected 25 non-liquid detergent/dishwash formula templates (Powder Laundry, Floor Cleaner, Glass Cleaner, Hand Wash, Degreasers). |
| Hardcoded "Lab Validated" / "100% Proven" labels | Fake Accuracy Claims | Misleading and unscientific marketing labels replaced with transparent mathematical outputs. |

---

## 2. Forbidden Labels & UI Claims

The following terms are banned across the new application UI and documentation:
- ❌ "Lab Validated"
- ❌ "Laboratory Certified"
- ❌ "Scientifically Proven"
- ❌ "100% Accurate"
- ❌ "Empirical Cleaning Performance Score: 98/100"

---

## 3. Replacement Philosophy

All calculation outputs are strictly labeled as:
- **Mathematically Calculated**
- **Stoichiometrically Derived**
- **Thermodynamically Estimated (with defined assumptions)**
- **INSUFFICIENT_DATA** (when parameters are missing)
