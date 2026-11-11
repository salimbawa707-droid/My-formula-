/**
 * Detergent Category Selection Hub
 * Displays ONLY TWO MAIN PRODUCT CATEGORIES: LIQUID DETERGENTS & DISH WASH
 */

import React from 'react';
import { MAIN_CATEGORIES, SubcategoryInfo } from '../domain/taxonomy';
import { ProductSubcategory, Formula } from '../domain/types';
import { DEFAULT_FORMULAS } from '../data/defaultFormulas';
import { Shirt, Utensils, ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

interface CategorySelectorProps {
  onSelectSubcategory: (subcat: ProductSubcategory, templateFormula?: Formula) => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({ onSelectSubcategory }) => {
  return (
    <div className="space-y-6 sm:space-y-8 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950/80 border border-slate-800 rounded-2xl p-5 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-950/80 border border-cyan-800/80 text-cyan-400 text-xs font-mono font-semibold rounded-full shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Scientifically Defensible • 100% Deterministic Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Select Detergent Category
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Formulate commercial-grade detergent products backed by thermodynamic pH equilibrium models, stoichiometric acid-base neutralization, and calcium carbonate water hardness chelation.
            </p>
          </div>

          {/* Quick Specs Badge Panel */}
          <div className="bg-slate-950/90 border border-slate-800/90 p-4 rounded-xl space-y-2 text-xs text-slate-300 shadow-inner shrink-0 lg:min-w-[260px]">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
              <span className="text-slate-400">Main Categories:</span>
              <span className="font-bold text-cyan-400 font-mono">2 MAIN ONLY</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
              <span className="text-slate-400">Subcategory Formulations:</span>
              <span className="font-semibold text-slate-100 font-mono">7 Profiles</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Calculations:</span>
              <span className="font-semibold text-emerald-400 flex items-center gap-1 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" /> 100% Local / Offline
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Categories Section: EXACTLY 2 CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {MAIN_CATEGORIES.map(mainCat => {
          const isLaundry = mainCat.id === 'LIQUID DETERGENTS';
          const IconComponent = isLaundry ? Shirt : Utensils;

          return (
            <div
              key={mainCat.id}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-xl hover:border-slate-700/80 transition-all"
            >
              {/* Category Header */}
              <div className="p-5 sm:p-6 border-b border-slate-800 bg-slate-950/80 flex items-start gap-4">
                <div className="p-3 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800/80 shadow-lg shrink-0">
                  <IconComponent className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase font-bold">
                    Main Category {isLaundry ? 'A' : 'B'}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{mainCat.title}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">{mainCat.shortDescription}</p>
                </div>
              </div>

              {/* Subcategories List */}
              <div className="p-5 sm:p-6 flex-1 space-y-3.5">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                  Select Formulation Subtype:
                </p>

                <div className="space-y-3">
                  {mainCat.subcategories.map((sub: SubcategoryInfo) => {
                    const template = DEFAULT_FORMULAS.find(f => f.subcategory === sub.id);

                    return (
                      <div
                        key={sub.id}
                        onClick={() => onSelectSubcategory(sub.id, template)}
                        className="group bg-slate-950/60 border border-slate-800/90 hover:border-cyan-500/70 p-4 rounded-xl cursor-pointer transition-all hover:bg-slate-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-sm font-bold text-slate-100 group-hover:text-cyan-400 transition-colors">
                              {sub.title}
                            </h3>
                            <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-slate-900 border border-slate-800 text-cyan-400 font-semibold">
                              Target Active: {sub.targetActiveMatterMin}%-{sub.targetActiveMatterMax}%
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed">{sub.description}</p>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectSubcategory(sub.id, template);
                          }}
                          className="shrink-0 flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-slate-800 group-hover:bg-gradient-to-r group-hover:from-cyan-600 group-hover:to-blue-600 text-slate-200 group-hover:text-white rounded-lg transition-all shadow-sm"
                        >
                          <span>Formulate</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Category Footer */}
              <div className="bg-slate-950 px-5 py-3 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-between font-mono">
                <span>Separate product chemistry rules</span>
                <span className="text-cyan-400 font-semibold">Deterministic</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
