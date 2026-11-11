/**
 * Master Ingredient Library Manager
 * Searchable, editable raw material catalog with 3-tier data status flags.
 */

import React, { useState } from 'react';
import { MasterIngredient } from '../domain/types';
import { MASTER_INGREDIENTS } from '../domain/ingredientsMaster';
import { Search, Edit3, Check, X, ShieldCheck, AlertCircle, HelpCircle } from 'lucide-react';

interface IngredientLibraryProps {
  ingredients: MasterIngredient[];
  onUpdateIngredient: (ingredient: MasterIngredient) => void;
}

export const IngredientLibrary: React.FC<IngredientLibraryProps> = ({
  ingredients,
  onUpdateIngredient
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<MasterIngredient>>({});

  const categories = ['ALL', ...Array.from(new Set(ingredients.map(i => i.category)))];

  const filtered = ingredients.filter(item => {
    const matchesSearch = item.commercialName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.chemicalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.casNumber && item.casNumber.includes(searchTerm));
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleStartEdit = (ing: MasterIngredient) => {
    setEditingId(ing.id);
    setEditForm(ing);
  };

  const handleSaveEdit = () => {
    if (editingId && editForm) {
      onUpdateIngredient(editForm as MasterIngredient);
      setEditingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Master Chemical Database</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">Internal Ingredient Master Library</h1>
          <p className="text-xs text-slate-400 mt-1">
            {ingredients.length} verified chemical raw materials with commercial concentration, molecular weight, density, and price specifications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 font-mono">
            3-Tier Traceability Status
          </span>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search ingredient by commercial name, chemical name, or CAS..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 w-full sm:w-64"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Ingredient Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-3">Commercial Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">CAS Number</th>
                <th className="p-3 text-right">Active %</th>
                <th className="p-3 text-right">Density (g/mL)</th>
                <th className="p-3 text-right">Cost/kg (₹)</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-center">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans text-slate-200">
              {filtered.map(ing => {
                const isEditing = editingId === ing.id;

                return (
                  <tr key={ing.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-semibold text-slate-100">
                      <div>{ing.commercialName}</div>
                      <div className="text-[10px] text-slate-500 font-normal">{ing.chemicalName}</div>
                    </td>

                    <td className="p-3 text-slate-400">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-950 border border-slate-800">
                        {ing.category}
                      </span>
                    </td>

                    <td className="p-3 font-mono text-slate-400">
                      {ing.casNumber || 'N/A'}
                    </td>

                    <td className="p-3 text-right font-mono text-cyan-400 font-semibold">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editForm.commercialConcentrationPercent}
                          onChange={(e) => setEditForm({
                            ...editForm,
                            commercialConcentrationPercent: parseFloat(e.target.value) || 0,
                            activeFraction: (parseFloat(e.target.value) || 0) / 100
                          })}
                          className="w-16 bg-slate-950 border border-slate-700 px-1 py-0.5 text-right rounded"
                        />
                      ) : (
                        `${ing.commercialConcentrationPercent}%`
                      )}
                    </td>

                    <td className="p-3 text-right font-mono text-slate-300">
                      {isEditing ? (
                        <input
                          type="number"
                          step="0.01"
                          value={editForm.density}
                          onChange={(e) => setEditForm({ ...editForm, density: parseFloat(e.target.value) || 1.0 })}
                          className="w-16 bg-slate-950 border border-slate-700 px-1 py-0.5 text-right rounded"
                        />
                      ) : (
                        ing.density
                      )}
                    </td>

                    <td className="p-3 text-right font-mono text-emerald-400 font-semibold">
                      {isEditing ? (
                        <input
                          type="number"
                          step="0.01"
                          value={editForm.costPerKg}
                          onChange={(e) => setEditForm({ ...editForm, costPerKg: parseFloat(e.target.value) || 0 })}
                          className="w-16 bg-slate-950 border border-slate-700 px-1 py-0.5 text-right rounded"
                        />
                      ) : (
                        `₹${ing.costPerKg.toFixed(2)}`
                      )}
                    </td>

                    <td className="p-3">
                      {ing.dataStatus === 'VERIFIED_SPECIFICATION' && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-400 font-semibold">
                          VERIFIED
                        </span>
                      )}
                      {ing.dataStatus === 'ESTIMATED_WITH_ASSUMPTIONS' && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 border border-amber-800 text-amber-400 font-semibold">
                          ESTIMATED
                        </span>
                      )}
                      {ing.dataStatus === 'UNKNOWN' && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400 font-semibold">
                          UNKNOWN
                        </span>
                      )}
                    </td>

                    <td className="p-3 text-center">
                      {isEditing ? (
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={handleSaveEdit}
                            className="p-1 text-emerald-400 hover:bg-emerald-950 rounded"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1 text-slate-400 hover:bg-slate-800 rounded"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleStartEdit(ing)}
                          className="p-1 text-slate-400 hover:text-cyan-400 transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
