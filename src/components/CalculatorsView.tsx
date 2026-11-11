/**
 * Standalone Scientific Formulation Calculators
 * Quick calculation utilities for LABSA neutralization, water hardness chelation, and HLB blends.
 */

import React, { useState } from 'react';
import { Calculator, ShieldCheck, Zap } from 'lucide-react';

export const CalculatorsView: React.FC = () => {
  // Calculator 1: LABSA Neutralization
  const [labsaKg, setLabsaKg] = useState<number>(10);
  const [labsaActivePct, setLabsaActivePct] = useState<number>(90);
  const [causticSolnPct, setCausticSolnPct] = useState<number>(50);

  // LABSA Moles = (kg * active * 1000) / 322
  const activeLabsaKg = labsaKg * (labsaActivePct / 100);
  const labsaMoles = (activeLabsaKg * 1000) / 322.0;
  const pureNaOHGrams = labsaMoles * 40.0;
  const causticSolutionKgNeeded = pureNaOHGrams / (causticSolnPct / 100 * 1000);

  // Calculator 2: Chelation Capacity
  const [gldaKg, setGldaKg] = useState<number>(2.0);
  const [citrateKg, setCitrateKg] = useState<number>(1.5);
  const [hedpKg, setHedpKg] = useState<number>(0.5);
  const [waterVolL, setWaterVolL] = useState<number>(100);

  const totalMgCaCO3 = (gldaKg * 1000 * 150) + (citrateKg * 1000 * 120) + (hedpKg * 1000 * 450);
  const ppmCaCO3Cap = totalMgCaCO3 / (waterVolL || 1);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-semibold">
            <Calculator className="w-4 h-4" />
            <span>Chemical Calculation Engines</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">Standalone Formulation Calculators</h1>
          <p className="text-xs text-slate-400 mt-1">
            Execute single-variable stoichiometric neutralization and chelation binding calculations instantly.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* LABSA Neutralization Calculator */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 shadow-xl">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              LABSA Caustic Soda Neutralization
            </h2>
            <span className="text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded">
              Stoichiometric 1:1
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">LABSA Mass (kg)</label>
              <input
                type="number"
                value={labsaKg}
                onChange={(e) => setLabsaKg(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-cyan-400 font-bold font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">LABSA Active %</label>
                <input
                  type="number"
                  value={labsaActivePct}
                  onChange={(e) => setLabsaActivePct(parseFloat(e.target.value) || 90)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Caustic Solution %</label>
                <input
                  type="number"
                  value={causticSolnPct}
                  onChange={(e) => setCausticSolnPct(parseFloat(e.target.value) || 50)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-lg space-y-2 border border-slate-800 font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Active Sulfonic Acid Mass:</span>
                <span className="text-white font-bold">{activeLabsaKg.toFixed(2)} kg</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Acid Equiv. Moles (322 g/mol):</span>
                <span className="text-white font-bold">{labsaMoles.toFixed(2)} moles</span>
              </div>
              <div className="flex justify-between text-cyan-400 text-sm font-bold pt-2 border-t border-slate-800">
                <span>Required {causticSolnPct}% Caustic Soda:</span>
                <span>{causticSolutionKgNeeded.toFixed(3)} kg</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chelation Capacity Calculator */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 shadow-xl">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Water Hardness Chelation Capacity
            </h2>
            <span className="text-[10px] font-mono bg-blue-950 text-blue-400 border border-blue-800 px-2 py-0.5 rounded">
              CaCO3 Sequestration
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">GLDA 47% (kg)</label>
                <input
                  type="number"
                  value={gldaKg}
                  onChange={(e) => setGldaKg(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Sodium Citrate (kg)</label>
                <input
                  type="number"
                  value={citrateKg}
                  onChange={(e) => setCitrateKg(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">HEDP 60% (kg)</label>
                <input
                  type="number"
                  value={hedpKg}
                  onChange={(e) => setHedpKg(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Batch Liquid Volume (Liters)</label>
              <input
                type="number"
                value={waterVolL}
                onChange={(e) => setWaterVolL(parseFloat(e.target.value) || 100)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="bg-slate-950 p-4 rounded-lg space-y-2 border border-slate-800 font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Total CaCO3 Binding Mass:</span>
                <span className="text-white font-bold">{(totalMgCaCO3 / 1000).toFixed(2)} g CaCO3</span>
              </div>
              <div className="flex justify-between text-blue-400 text-sm font-bold pt-2 border-t border-slate-800">
                <span>Chelation Capacity in Solution:</span>
                <span>{ppmCaCO3Cap.toFixed(0)} ppm CaCO3</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
