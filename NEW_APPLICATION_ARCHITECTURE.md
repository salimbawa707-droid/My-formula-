# NEW APPLICATION ARCHITECTURE

This document outlines the architecture, data structures, UI design, and product-routing rules for the new Detergent Formulation Application.

---

## 1. Core Principles

1. **Strict Two-Category Hierarchy**:
   - **Main Category 1: LIQUID DETERGENTS**
     - Hand-wash laundry liquid
     - Top-load washing machine liquid
     - Front-load washing machine liquid
     - General-purpose laundry liquid
     - Concentrated laundry liquid
   - **Main Category 2: DISH WASH**
     - Hand dishwashing liquid
     - Automatic dishwasher detergent (machine dishwash)

2. **Zero External API Dependencies & Offline Self-Containment**:
   - Runs 100% locally in the browser using React, TypeScript, and IndexedDB/localStorage.
   - Requires NO Gemini API, OpenAI, Anthropic, external databases, or cloud backends.

3. **Deterministic Staged Scientific Analysis**:
   - "CHECK MY FORMULA" triggers an 11-stage mathematical verification pipeline without arbitrary pass/fail scores.

---

## 2. Technical Stack & File Directory Structure

```
src/
├── domain/                      # Chemical Domain Data & Models
│   ├── types.ts                 # Product categories, ingredients, calculation types
│   ├── taxonomy.ts              # Two-category hierarchy definitions & routing rules
│   └── ingredientsMaster.ts     # Internal Ingredient Master Library (85+ items, 3-tier status)
├── engines/                     # Pure Deterministic Calculation Logic
│   ├── activeMatterEngine.ts    # Surfactant active content & system ratio
│   ├── neutralizationEngine.ts  # LABSA/Caustic stoichiometry
│   ├── phEngine.ts              # Equilibrium pH & buffer capacity estimation
│   ├── chelationEngine.ts       # CaCO3 hardness & binding capacity
│   ├── hlbEngine.ts             # Nonionic blend HLB calculator
│   ├── densityEngine.ts         # Volumetric mass balance
│   ├── viscosityEngine.ts       # Empirical rheology estimation (or INSUFFICIENT_DATA)
│   ├── costingEngine.ts         # Commercial cost, margin chain, retail pricing
│   ├── compatibilityEngine.ts   # Ionic & physical compatibility rules
│   └── formulaAnalysisPipeline.ts # 11-Stage "Check My Formula" staged evaluator
├── data/
│   └── defaultFormulas.ts       # 14 Verified Liquid Laundry & Dishwash templates
├── stores/
│   └── formulaStore.ts          # Local persistence (IndexedDB / LocalStorage)
├── components/                  # Clean Industrial R&D React UI Components
│   ├── Layout.tsx               # Navigation bar & industrial header
│   ├── CategorySelector.tsx     # Home screen category cards (ONLY 2 MAIN CATEGORIES)
│   ├── FormulaBuilder.tsx       # Live formulation workspace with water q.s.
│   ├── FormulaAnalysisView.tsx  # 11-Stage scientific evaluation report
│   ├── IngredientLibrary.tsx    # Ingredient Master Library editor
│   ├── FormulaLibrary.tsx       # Saved formulas, duplication, & exports
│   ├── FormulaComparison.tsx    # Side-by-side formula comparison
│   ├── CalculatorsView.tsx      # Standalone scientific calculators (pH, Active Matter, Chelation, Cost)
│   └── BatchRecordsView.tsx     # Manufacturing batch execution records
├── utils/
│   └── exportUtils.ts           # PDF / JSON / CSV formulation dossier exporter
├── App.tsx                      # Main app controller
└── main.tsx                     # Entry point
```

---

## 3. Product-Specific Routing Logic

- **Laundry Liquids**: Evaluates foam level against machine type (Front-load = strictly low foam; Top-load = moderate foam; Hand-wash = rich foam), enzyme stability range ($\text{pH } 7.0 - 9.0$), fabric safety, and builder reserve.
- **Hand Dishwashing**: Evaluates grease removal surfactant system (Anionic + Betaine + Nonionic synergy), mildness ($\text{pH } 5.5 - 7.5$), and rinseability.
- **Automatic Dishwasher (Machine)**: Evaluates strict low-foam anti-foaming requirement, high alkalinity builder system ($\text{pH } 9.5 - 11.5$), non-foaming nonionic surfactants, and scale prevention chelation load.

---

## 4. Design & Theme

- **Style**: Industrial Chemical R&D Workspace.
- **Color Palette**: Deep Navy Blue (`#0F172A`), Crisp White (`#FFFFFF`), Cyan/Light Blue accents (`#0284C7`), Neutral Grey surfaces (`#F8FAFC`).
- **Typography**: Inter / System Sans, tabular numbers for scientific tables.
