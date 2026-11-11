# INGREDIENT DATA EXTRACTION REPORT

This report documents the extraction, cleaning, and normalization of ingredient records from the repository's `universalIngredientLibrary.ts` and `ingredientIdentitySSOT.ts`.

---

## 1. Extraction Scope & Statistics

- **Source Database Size**: 430 raw material records.
- **Target Products**:
  1. Liquid Detergents (Hand-wash, Top-load, Front-load, General Laundry, Concentrated Laundry)
  2. Dish Wash (Hand dishwashing, Automatic machine dishwasher)
- **Extracted Active Ingredient Library**: 85 core detergent raw materials filtered for liquid detergent and dishwashing applications.

---

## 2. Three-Tier Data Status Classification

Every raw material in the extracted library is classified with an explicit data status:

1. `VERIFIED_SPECIFICATION`: Complete chemical identity, CAS number, verified commercial concentration, molecular weight, and pKa/density data from technical datasheets.
2. `ESTIMATED_WITH_ASSUMPTIONS`: Commercial active range or density estimated based on standard chemical industry defaults (e.g. standard commercial grades).
3. `UNKNOWN`: Ingredients with missing technical properties where properties are explicitly flagged rather than filled with dummy values.

---

## 3. Key Extracted Ingredients Summary

| Ingredient ID | Commercial Name | Category | Active % | Default Density (g/mL) | Data Status |
|---|---|---|---|---|---|
| `labsa-90` | Linear Alkylbenzene Sulfonic Acid (LABSA) | Anionic Surfactant | 90% | 1.06 | `VERIFIED_SPECIFICATION` |
| `sles-28` | Sodium Lauryl Ether Sulfate (SLES 2EO) | Anionic Surfactant | 28% | 1.04 | `VERIFIED_SPECIFICATION` |
| `sles-70` | Sodium Lauryl Ether Sulfate Paste (SLES 70%) | Anionic Surfactant | 70% | 1.10 | `VERIFIED_SPECIFICATION` |
| `aos-38` | Alpha Olefin Sulfonate (AOS 38%) | Anionic Surfactant | 38% | 1.05 | `VERIFIED_SPECIFICATION` |
| `capb-30` | Cocamidopropyl Betaine (CAPB 30%) | Amphoteric Surfactant | 30% | 1.04 | `VERIFIED_SPECIFICATION` |
| `lauryl-glucoside` | Lauryl Glucoside (APG 50%) | Nonionic Surfactant | 50% | 1.08 | `VERIFIED_SPECIFICATION` |
| `c9-11-pareth-6` | Alcohol Ethoxylate C9-11 6EO | Nonionic Surfactant | 100% | 0.98 | `VERIFIED_SPECIFICATION` |
| `naoh-50` | Caustic Soda Liquid (NaOH 50%) | Neutralizing Agent / Base | 50% | 1.52 | `VERIFIED_SPECIFICATION` |
| `naoh-flakes` | Caustic Soda Flakes (NaOH 98%) | Neutralizing Agent / Base | 98% | 2.13 | `VERIFIED_SPECIFICATION` |
| `glda-47` | Tetrasodium Glutamate Diacetate (GLDA 47%) | Chelating Agent | 47% | 1.30 | `VERIFIED_SPECIFICATION` |
| `citric-acid-monohydrate` | Citric Acid Monohydrate | pH Adjuster / Chelator | 100% | 1.54 | `VERIFIED_SPECIFICATION` |
| `sodium-citrate-dihydrate` | Sodium Citrate Dihydrate | Builder / Chelator | 100% | 1.85 | `VERIFIED_SPECIFICATION` |
| `hedp-60` | Etidronic Acid (HEDP 60%) | Scale Inhibitor / Chelator | 60% | 1.45 | `VERIFIED_SPECIFICATION` |
| `sodium-metasilicate-pentahydrate` | Sodium Metasilicate Pentahydrate | Alkaline Builder (Machine Dish) | 100% | 1.75 | `VERIFIED_SPECIFICATION` |
| `protease-liquid` | Subtilisin Protease Enzyme | Enzyme | 100% | 1.15 | `ESTIMATED_WITH_ASSUMPTIONS` |
| `amylase-liquid` | Alpha-Amylase Enzyme | Enzyme | 100% | 1.15 | `ESTIMATED_WITH_ASSUMPTIONS` |
| `sodium-xylene-sulfonate` | Sodium Xylene Sulfonate (SXS 40%) | Hydrotrope | 40% | 1.18 | `VERIFIED_SPECIFICATION` |
| `cmc-viscosity` | Sodium Carboxymethyl Cellulose | Polymer Thickener | 100% | 1.59 | `ESTIMATED_WITH_ASSUMPTIONS` |
| `deionized-water` | Deionized / Purified Water | Solvent | 100% | 1.00 | `VERIFIED_SPECIFICATION` |

---

## 4. User Customization & Editing

The application provides a built-in Ingredient Master Library UI where users can edit raw material costs, commercial active concentrations, density values, and supplier specs. Chemical identity is kept strictly separate from commercial-grade specifications.
