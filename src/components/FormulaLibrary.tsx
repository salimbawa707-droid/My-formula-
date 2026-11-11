/**
 * Saved Formulation Library Manager
 * Manage, duplicate, delete, and open formulas for analysis or editing.
 */

import React, { useState } from 'react';
import { Formula } from '../domain/types';
import { calculateActiveMatter } from '../engines/activeMatterEngine';
import { calculateCosting } from '../engines/costingEngine';
import { estimatePH } from '../engines/phEngine';
import {
  BookOpen,
  Plus,
  Copy,
  Trash2,
  Play,
  Edit3,
  GitCompare,
  Download
} from 'lucide-react';

interface FormulaLibraryProps {
  formulas: Formula[];
  onSelectFormula: (formula: Formula) => void;
  onRunAnalysis: (formula: Formula) => void;
  onDuplicateFormula: (formula: Formula) => void;
  onDeleteFormula: (id: string) => void;
  onNewFormula: () => void;
  onOpenCompare: (selectedFormulas: [Formula, Formula]) => void;
}

export const FormulaLibrary: React.FC<FormulaLibraryProps> = ({
  formulas,
  onSelectFormula,
  onRunAnalysis,
  onDuplicateFormula,
  onDeleteFormula,
  onNewFormula,
  onOpenCompare
}) => {
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const filteredFormulas = formulas.filter(f => {
    if (filterCategory === 'ALL') return true;
    return f.mainCategory === filterCategory;
  });

  const toggleSelectCompare = (id: string) => {
    if (selectedForCompare.includes(id)) {
      setSelectedForCompare(prev => prev.filter(item => item !== id));
    } else {
      if (selectedForCompare.length >= 2) {
        setSelectedForCompare([selectedForCompare[1], id]);
      } else {
        setSelectedForCompare(prev => [...prev, id]);
      }
    }
  };

  const handleStartCompare = () => {
    if (selectedForCompare.length === 2) {
      const f1 = formulas.find(f => f.id === selectedForCompare[0]);
      const f2 = formulas.find(f => f.id === selectedForCompare[1]);
      if (f1 && f2) onOpenCompare([f1, f2]);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Controls */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-semibold">
            <BookOpen className="w-4 h-4" />
            <span>Recipe Storage & Management</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">Saved Formulation Library</h1>
          <p className="text-xs text-slate-400 mt-1">
            {formulas.length} stored formulation recipes across Liquid Detergents and Dish Wash categories.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {selectedForCompare.length === 2 && (
            <button
              onClick={handleStartCompare}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-blue-900/40 transition-all"
            >
              <GitCompare className="w-4 h-4" />
              <span>Compare Selected (2)</span>
            </button>
          )}

          <button
            onClick={onNewFormula}
            className="flex items-center gap-1.5 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-cyan-900/40 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Blank Formula</span>
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-3 rounded-xl text-xs">
        <span className="text-slate-400 font-semibold uppercase font-mono px-2">Filter Category:</span>
        <button
          onClick={() => setFilterCategory('ALL')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
            filterCategory === 'ALL' ? 'bg-cyan-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-slate-200'
          }`}
        >
          All Formulations ({formulas.length})
        </button>

        <button
          onClick={() => setFilterCategory('LIQUID DETERGENTS')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
            filterCategory === 'LIQUID DETERGENTS' ? 'bg-cyan-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-slate-200'
          }`}
        >
          Liquid Detergents ({formulas.filter(f => f.mainCategory === 'LIQUID DETERGENTS').length})
        </button>

        <button
          onClick={() => setFilterCategory('DISH WASH')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
            filterCategory === 'DISH WASH' ? 'bg-cyan-600 text-white' : 'bg-slate-950 text-slate-400 hover:text-slate-200'
          }`}
        >
          Dish Wash ({formulas.filter(f => f.mainCategory === 'DISH WASH').length})
        </button>
      </div>

      {/* Formulas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredFormulas.map(f => {
          const activeMatter = calculateActiveMatter(f.items);
          const costing = calculateCosting(f.items, f.batchSizeKg);
          const phRes = estimatePH(f.items);
          const isSelected = selectedForCompare.includes(f.id);

          return (
            <div
              key={f.id}
              className={`bg-slate-900 border rounded-xl p-5 flex flex-col justify-between gap-4 transition-all ${
                isSelected ? 'border-cyan-500 bg-slate-900/90 shadow-lg shadow-cyan-950/50' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-cyan-400 uppercase font-semibold">
                      {f.mainCategory}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1">{f.name}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2">{f.description}</p>
                  </div>

                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelectCompare(f.id)}
                    className="w-4 h-4 rounded border-slate-700 text-cyan-600 focus:ring-cyan-500 bg-slate-950 cursor-pointer mt-1"
                    title="Select for comparison"
                  />
                </div>

                {/* Quick Spec Metrics */}
                <div className="grid grid-cols-3 gap-2 bg-slate-950 p-2.5 rounded-lg text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Active %</span>
                    <span className="font-bold text-cyan-400">{activeMatter.totalActiveMatterPercent.toFixed(1)}%</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 block">Estimated pH</span>
                    <span className="font-bold text-slate-200">{phRes.estimatedPH}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 block">Cost / kg</span>
                    <span className="font-bold text-emerald-400">₹{costing.costPerKgINR.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between border-t border-slate-800/80 pt-3 text-xs">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onSelectFormula(f)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-all"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => onDuplicateFormula(f)}
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-all"
                    title="Duplicate recipe"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  {!f.isTemplate && (
                    <button
                      onClick={() => onDeleteFormula(f.id)}
                      className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-400 rounded-lg transition-all"
                      title="Delete recipe"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <button
                  onClick={() => onRunAnalysis(f)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>CHECK FORMULA</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
