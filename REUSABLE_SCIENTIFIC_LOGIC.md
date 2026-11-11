# REUSABLE SCIENTIFIC LOGIC REPORT

This document specifies the exact mathematical equations, chemical algorithms, and scientific algorithms extracted from the source repository for reuse in the new application.

---

## 1. Active Matter Calculation Engine

### Mathematical Formula
$$\text{Active Matter (\%)} = \frac{\sum_{i=1}^{n} (m_i \times a_i)}{M_{\text{batch}}} \times 100$$

Where:
- $m_i$ = Mass of ingredient $i$ (g or kg)
- $a_i$ = Commercial active fraction of ingredient $i$ ($0.0 \le a_i \le 1.0$)
- $M_{\text{batch}}$ = Total mass of formulation batch (g or kg)

### Supported Surfactants & Commercial Concentrations
- **LABSA (Linear Alkylbenzene Sulfonic Acid)**: Default 90% active ($a = 0.90$)
- **SLES (Sodium Lauryl Ether Sulfate)**: Default 28% active or 70% active ($a = 0.28$ or $0.70$)
- **AOS (Alpha Olefin Sulfonate)**: Default 38% active ($a = 0.38$)
- **CAPB (Cocamidopropyl Betaine)**: Default 30% active ($a = 0.30$)
- **Nonionic Surfactants (Alcohol Ethoxylates, APG)**: 100% active ($a = 1.00$) or commercial cut

---

## 2. Stoichiometric Neutralization Engine

### LABSA Neutralization with Caustic Soda (NaOH)
Neutralization reaction:
$$\text{R-SO}_3\text{H} + \text{NaOH} \rightarrow \text{R-SO}_3^-\text{Na}^+ + \text{H}_2\text{O}$$

Molar Ratio = $1 : 1$.

### Required NaOH Mass Formula
$$m_{\text{NaOH, pure}} = \frac{m_{\text{LABSA}} \times a_{\text{LABSA}}}{\text{MW}_{\text{LABSA}}} \times \text{MW}_{\text{NaOH}}$$

For commercial caustic soda solution:
$$m_{\text{Caustic Soln (g)}} = \frac{m_{\text{NaOH, pure}}}{C_{\text{NaOH solution}} \times P_{\text{NaOH}}}$$

Where:
- $\text{MW}_{\text{LABSA}} = 322.0 \text{ g/mol}$ (average equivalent weight)
- $\text{MW}_{\text{NaOH}} = 40.00 \text{ g/mol}$
- $a_{\text{LABSA}}$ = LABSA active concentration (e.g., 0.90)
- $C_{\text{NaOH solution}}$ = Solution concentration (e.g., 0.50 for 50% liquid lye)
- $P_{\text{NaOH}}$ = Purity factor of solid NaOH (e.g., 0.98 for 98% flakes)

---

## 3. Equilibrium pH Estimation Engine

### Weak & Strong Acid-Base Equilibrium Model
System charge balance equation:
$$\sum z_i [C_i] + [\text{H}^+] - [\text{OH}^-] = 0$$

Equilibrium constant expression for weak acids $\text{HA} \rightleftharpoons \text{H}^+ + \text{A}^-$:
$$K_a = \frac{[\text{H}^+][\text{A}^-]}{[\text{HA}]}$$

Numerical Solver Method:
- Newton-Raphson bisection bounded solver in $\text{pH} \in [0, 14]$.
- Temperature reference: $25^\circ\text{C}$ ($K_w = 1.0 \times 10^{-14}$).
- Output includes solver convergence check, buffer capacity ($\beta$), and estimated pH bounds.

---

## 4. Water Hardness & Chelation Capacity Engine

### CaCO3 Binding Capacity Formula
$$\text{Theoretical Chelation Capacity (ppm CaCO}_3\text{)} = \frac{\sum (m_{\text{chelator}, j} \times B_j)}{V_{\text{water (L)}}}$$

Where:
- $B_j$ = Specific CaCO3 binding capacity of chelator $j$ (mg CaCO3 per g chelator)
  - **GLDA (Tetrasodium Glutamate Diacetate)**: 150 mg CaCO3 / g
  - **Sodium Citrate Dihydrate**: 120 mg CaCO3 / g
  - **HEDP (Etidronic Acid)**: 450 mg CaCO3 / g
  - **Tetrasodium EDTA**: 220 mg CaCO3 / g
  - **Sodium Gluconate**: 80 mg CaCO3 / g

### Hardness Load Ratio & Safety Margin
$$\text{Hardness Load (mg CaCO}_3\text{)} = \text{Water Volume (L)} \times \text{Hardness (ppm as CaCO}_3\text{)}$$
$$\text{Safety Margin (\%)} = \left( \frac{\text{Theoretical Chelation Capacity}}{\text{Hardness Load}} - 1 \right) \times 100$$

---

## 5. Hydrophilic-Lipophilic Balance (HLB) Engine

### Blend HLB Formula
$$\text{HLB}_{\text{blend}} = \sum_{k=1}^{p} \left( \frac{w_k}{\sum w} \times \text{HLB}_k \right)$$

Applied exclusively to nonionic surfactants with verified HLB numbers (e.g., Fatty Alcohol Ethoxylates, Polysorbates). Non-surfactants and ionic surfactants are excluded from the HLB weighted sum.

---

## 6. Formulation Density & Costing Engines

### Volumetric Mass Balance Density
$$\rho_{\text{formulation}} = \frac{M_{\text{batch}}}{\sum_{i=1}^{n} \frac{m_i}{\rho_i}}$$

### Commercial Costing Structure
- $\text{Direct Material Cost (\$/kg)} = \frac{\sum (m_i \times \text{Price}_i)}{M_{\text{batch}}}$
- $\text{Manufacturing Cost} = \text{Direct Material Cost} + \text{Processing Overhead}$
- $\text{Gross Margin (\%)} = \frac{\text{Wholesale Price} - \text{Manufacturing Cost}}{\text{Wholesale Price}} \times 100$
