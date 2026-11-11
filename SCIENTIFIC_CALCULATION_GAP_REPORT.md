# SCIENTIFIC CALCULATION GAP REPORT

This report evaluates calculation gaps, missing input variables, and handling strategy for uncertainty in the detergent formulation application.

---

## 1. Identified Gaps & Mitigation Strategy

| Calculation Module | Scientific Gap / Challenge | Handling Strategy |
|---|---|---|
| **pH Estimation** | Commercial surfactant mixtures contain unknown buffer traces, unsulfated matter, and ionic strength variations. | Report estimated pH range rather than falsely precise single numbers when activity coefficients are uncalibrated. Output solver status and thermodynamic assumptions. |
| **Viscosity Estimation** | Polymer entanglement and surfactant salt-curve thickening depend strongly on shear rate and exact salt peak positions. | Require user to supply electrolyte content and thickener levels. If parameters are insufficient, output `INSUFFICIENT_DATA` rather than guessing viscosity. |
| **Water Hardness Chelation** | Temperature and presence of heavy metals (Fe3+, Mn2+) alter conditional stability constants ($K_{\text{eff}}$). | Calculate theoretical binding capacity based on standard calcium carbonate equivalents ($25^\circ\text{C}$, $\text{pH } 8-10$). Flag conditional limitations in the analysis report. |
| **Surfactant HLB** | Ionic surfactants (LABSA, SLES) do not conform well to Griffin's HLB system due to electrical double-layer contributions. | Restrict HLB calculations strictly to nonionic surfactant components. Display nonionic ratio. |
| **Density Prediction** | Partial molar volumes of complex aqueous surfactant mixtures deviate slightly from linear ideal mixing rules. | Use volumetric mass balance as first-order physical estimate. Note $\pm 2\%$ physical density tolerance. |

---

## 2. Mathematical Transparency Protocol

Every calculated parameter displayed in the application UI must provide:
1. Standard Mathematical Equation
2. Explicit Input Variable Listing with SI Units
3. Assumptions & Validity Bounds
4. Error handling & `INSUFFICIENT_DATA` fallback
