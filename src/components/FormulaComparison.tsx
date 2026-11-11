/**
 * Side-by-Side Formula Comparison View
 * Compares 2 formulations across active matter, ingredient percentages, estimated pH, chelation capacity, and costing.
 */

import React from 'react';
import { Formula, MasterIngredient } from '../domain/types';
import { calculateActiveMatter } from '../engines/activeMatterEngine';
import { calculateCosting } from '../engines/costingEngine';
import { estimatePH } from '../engines/phEngine';
import { calculateChelation } from '../engines/chelationEngine';
import { MASTER_INGREDIENTS } from '../domain/ingredientsMaster';
import { GitCompare, ArrowLeft } from 'lucide-react';

interface FormulaComparisonProps {
  formulas: [Formula, Formula];
  onBack: () => void;
  customIngredients?: MasterIngredient[];
}

export const FormulaComparison: React.FC<FormulaComparisonProps> = ({
  formulas,
  onBack,
  customIngredients = MASTER_INGREDIENTS
}) => {
  const [f1, f2] = formulas;

  const active1 = calculateActiveMatter(f1.items, customIngredients);
  const active2 = calculateActiveMatter(f2.items, customIngredients);

  const cost1 = calculateCosting(f1.items, f1.batchSizeKg, customIngredients);
  const cost2 = calculateCosting(f2.items, f2.batchSizeKg, customIngredients);

  const ph1 = estimatePH(f1.items, customIngredients);
  const ph2 = estimatePH(f2.items, customIngredients);

  const chel1 = calculateChelation(f1.items, f1.batchSizeKg, 150, customIngredients);
  const chel2 = calculateChelation(f2.items, f2.batchSizeKg, 150, customIngredients);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Library</span>
        </button>

        <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
          <GitCompare className="w-5 h-5" />
          <span>Side-by-Side Scientific Recipe Comparison</span>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Formula 1 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl">
          <div className="border-b border-slate-800 pb-3">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-cyan-400 font-bold uppercase">
              Formula A ({f1.mainCategory})
            </span>
            <h2 className="text-lg font-bold text-white mt-1">{f1.name}</h2>
            <p className="text-xs text-slate-400">{f1.subcategory}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono bg-slate-950 p-3 rounded-lg">
            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-sans">Active Matter</span>
              <span className="text-base font-bold text-cyan-400">{active1.totalActiveMatterPercent.toFixed(1)}%</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-sans">Estimated pH</span>
              <span className="text-base font-bold text-slate-200">{ph1.estimatedPH}</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-sans">Cost / kg</span>
              <span className="text-base font-bold text-emerald-400">${cost1.costPerKgUSD.toFixed(3)}</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-sans">Chelation Cap.</span>
              <span className="text-base font-bold text-blue-400">{chel1.ppmCaCO3ChelationCapacity.toFixed(0)} ppm</span>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Ingredient Breakdown</span>
            <div className="space-y-1.5 font-mono text-xs text-slate-300 bg-slate-950/50 p-3 rounded-lg max-h-60 overflow-y-auto">
              {f1.items.map((item, idx) => {
                const ing = customIngredients.find(i => i.id === item.ingredientId);
                return (
                  <div key={idx} className="flex justify-between border-b border-slate-800/60 pb-1">
                    <span>{ing?.commercialName || item.ingredientId}</span>
                    <span className="font-bold text-cyan-400">{item.quantityKg} kg</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Formula 2 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl">
          <div className="border-b border-slate-800 pb-3">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-cyan-400 font-bold uppercase">
              Formula B ({f2.mainCategory})
            </span>
            <h2 className="text-lg font-bold text-white mt-1">{f2.name}</h2>
            <p className="text-xs text-slate-400">{f2.subcategory}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-mono bg-slate-950 p-3 rounded-lg">
            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-sans">Active Matter</span>
              <span className="text-base font-bold text-cyan-400">{active2.totalActiveMatterPercent.toFixed(1)}%</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-sans">Estimated pH</span>
              <span className="text-base font-bold text-slate-200">{ph2.estimatedPH}</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-sans">Cost / kg</span>
              <span className="text-base font-bold text-emerald-400">${cost2.costPerKgUSD.toFixed(3)}</span>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-sans">Chelation Cap.</span>
              <span className="text-base font-bold text-blue-400">{chel2.ppmCaCO3ChelationCapacity.toFixed(0)} ppm</span>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Ingredient Breakdown</span>
            <div className="space-y-1.5 font-mono text-xs text-slate-300 bg-slate-950/50 p-3 rounded-lg max-h-60 overflow-y-auto">
              {f2.items.map((item, idx) => {
                const ing = customIngredients.find(i => i.id === item.ingredientId);
                return (
                  <div key={idx} className="flex justify-between border-b border-slate-800/60 pb-1">
                    <span>{ing?.commercialName || item.ingredientId}</span>
                    <span className="font-bold text-cyan-400">{item.quantityKg} kg</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
