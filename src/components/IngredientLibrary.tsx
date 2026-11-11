/**
 * Master Ingredient Library Manager
 * Searchable, editable raw material catalog with 3-tier data status flags.
 */

import React, { useState } from 'react';
import { MasterIngredient } from '../domain/types';
import { saveUserPrice, exportUserPricesJson, importUserPricesJson } from '../domain/userPrices';
import { Search, Edit3, Check, X, ShieldCheck, Download, Upload, AlertCircle, DollarSign, Package } from 'lucide-react';

interface IngredientLibraryProps {
  ingredients: MasterIngredient[];
  onUpdateIngredient: (ingredient: MasterIngredient) => void;
  onRefreshPrices?: () => void;
}

export const IngredientLibrary: React.FC<IngredientLibraryProps> = ({
  ingredients,
  onUpdateIngredient,
  onRefreshPrices
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<MasterIngredient>>({});
  const [importStatus, setImportStatus] = useState<string | null>(null);

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
    setEditForm({
      ...ing,
      costPerKg: ing.costPerKg,
      supplierName: ing.supplierName || '',
      gradePurchased: ing.gradePurchased || '',
      purchaseDate: ing.purchaseDate || new Date().toISOString().split('T')[0],
      notes: ing.notes || ''
    });
  };

  const handleSaveEdit = () => {
    if (editingId && editForm) {
      const updatedCost = editForm.costPerKg !== undefined && editForm.costPerKg !== null && !isNaN(editForm.costPerKg) && editForm.costPerKg >= 0
        ? editForm.costPerKg
        : null;

      const updatedIng: MasterIngredient = {
        ...(editForm as MasterIngredient),
        costPerKg: updatedCost,
        supplierName: editForm.supplierName || undefined,
        gradePurchased: editForm.gradePurchased || undefined,
        purchaseDate: editForm.purchaseDate || undefined,
        notes: editForm.notes || undefined
      };

      saveUserPrice({
        ingredientId: editingId,
        costPerKgINR: updatedCost,
        supplierName: editForm.supplierName || undefined,
        gradePurchased: editForm.gradePurchased || undefined,
        purchaseDate: editForm.purchaseDate || undefined,
        notes: editForm.notes || undefined
      });

      onUpdateIngredient(updatedIng);
      if (onRefreshPrices) onRefreshPrices();
      setEditingId(null);
    }
  };

  const handleExportPrices = () => {
    const jsonStr = exportUserPricesJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `user_ingredient_prices_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportPrices = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const res = importUserPricesJson(text);
      if (res.success) {
        setImportStatus(`Successfully imported ${res.importedCount} price records.`);
        if (onRefreshPrices) onRefreshPrices();
      } else {
        setImportStatus(`Import failed: ${res.error}`);
      }
      setTimeout(() => setImportStatus(null), 5000);
    };
    reader.readAsText(file);
  };

  const unpricedCount = ingredients.filter(i => i.costPerKg === null).length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Master Chemical Database (User-Controlled Pricing)</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">Internal Ingredient Master Library</h1>
          <p className="text-xs text-slate-400 mt-1">
            {ingredients.length} verified chemical raw materials. All purchase prices are 100% user-entered and stored locally.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {unpricedCount > 0 ? (
            <span className="text-xs px-3 py-1 bg-amber-950/80 border border-amber-800 text-amber-300 rounded-lg flex items-center gap-1 font-mono">
              <AlertCircle className="w-3.5 h-3.5" />
              {unpricedCount} Unpriced Ingredients
            </span>
          ) : (
            <span className="text-xs px-3 py-1 bg-emerald-950/80 border border-emerald-800 text-emerald-300 rounded-lg font-mono">
              All Ingredients Priced
            </span>
          )}

          <button
            onClick={handleExportPrices}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-all"
            title="Export price records to JSON file"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export Prices</span>
          </button>

          <label className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 cursor-pointer transition-all">
            <Upload className="w-3.5 h-3.5 text-emerald-400" />
            <span>Import Prices</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportPrices}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {importStatus && (
        <div className="p-3 bg-cyan-950 border border-cyan-800 rounded-lg text-xs font-mono text-cyan-200 flex items-center justify-between">
          <span>{importStatus}</span>
          <button onClick={() => setImportStatus(null)} className="text-cyan-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

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
                <th className="p-3 text-right">Purchase Price (₹/kg)</th>
                <th className="p-3">Supplier & Grade</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans text-slate-200">
              {filtered.map(ing => {
                const isEditing = editingId === ing.id;

                return (
                  <React.Fragment key={ing.id}>
                    <tr className="hover:bg-slate-800/40 transition-colors">
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
                        {ing.commercialConcentrationPercent}%
                      </td>

                      <td className="p-3 text-right font-mono text-slate-300">
                        {ing.density}
                      </td>

                      <td className="p-3 text-right font-mono">
                        {isEditing ? (
                          <input
                            type="number"
                            step="0.01"
                            placeholder="Unpriced"
                            value={editForm.costPerKg !== null && editForm.costPerKg !== undefined ? editForm.costPerKg : ''}
                            onChange={(e) => {
                              const val = e.target.value === '' ? null : parseFloat(e.target.value);
                              setEditForm({ ...editForm, costPerKg: val });
                            }}
                            className="w-24 bg-slate-950 border border-cyan-500 px-2 py-1 text-right rounded text-white font-bold"
                          />
                        ) : ing.costPerKg !== null ? (
                          <span className="text-emerald-400 font-bold">₹{ing.costPerKg.toFixed(2)}</span>
                        ) : (
                          <span className="text-amber-400 italic text-[11px] font-semibold bg-amber-950/60 border border-amber-900/80 px-2 py-0.5 rounded">
                            Unpriced
                          </span>
                        )}
                      </td>

                      <td className="p-3 text-slate-400 text-[11px]">
                        {ing.supplierName || ing.gradePurchased ? (
                          <div>
                            <div className="text-slate-200 font-medium">{ing.supplierName || '—'}</div>
                            <div className="text-[10px] text-slate-500">{ing.gradePurchased}</div>
                          </div>
                        ) : (
                          <span className="text-slate-600 font-mono">—</span>
                        )}
                      </td>

                      <td className="p-3 text-center">
                        {isEditing ? (
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={handleSaveEdit}
                              className="p-1.5 text-emerald-400 hover:bg-emerald-950 rounded border border-emerald-800"
                              title="Save Price & Specifications"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="p-1.5 text-slate-400 hover:bg-slate-800 rounded border border-slate-700"
                              title="Cancel"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleStartEdit(ing)}
                            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 rounded text-[11px] font-semibold flex items-center gap-1 mx-auto transition-colors"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Set Price</span>
                          </button>
                        )}
                      </td>
                    </tr>

                    {/* Inline Expanded Price Details Editor */}
                    {isEditing && (
                      <tr className="bg-slate-950/90 border-b border-cyan-900/60">
                        <td colSpan={8} className="p-4 space-y-3">
                          <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                            <DollarSign className="w-4 h-4" />
                            <span>User Price & Commercial Specification Entry — {ing.commercialName}</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                            <div>
                              <label className="text-[11px] text-slate-400 font-semibold block mb-1">
                                Purchase Price per kg (INR ₹)
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="Enter price in ₹/kg..."
                                value={editForm.costPerKg !== null && editForm.costPerKg !== undefined ? editForm.costPerKg : ''}
                                onChange={(e) => {
                                  const val = e.target.value === '' ? null : parseFloat(e.target.value);
                                  setEditForm({ ...editForm, costPerKg: val });
                                }}
                                className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white font-mono focus:border-cyan-500 focus:outline-none"
                              />
                            </div>

                            <div>
                              <label className="text-[11px] text-slate-400 font-semibold block mb-1">
                                Supplier Name
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. Galaxy Surfactants, BASF..."
                                value={editForm.supplierName || ''}
                                onChange={(e) => setEditForm({ ...editForm, supplierName: e.target.value })}
                                className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white focus:border-cyan-500 focus:outline-none"
                              />
                            </div>

                            <div>
                              <label className="text-[11px] text-slate-400 font-semibold block mb-1">
                                Commercial Grade / Spec
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. Technical Grade, 90% Liquid..."
                                value={editForm.gradePurchased || ''}
                                onChange={(e) => setEditForm({ ...editForm, gradePurchased: e.target.value })}
                                className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white focus:border-cyan-500 focus:outline-none"
                              />
                            </div>

                            <div>
                              <label className="text-[11px] text-slate-400 font-semibold block mb-1">
                                Purchase Date
                              </label>
                              <input
                                type="date"
                                value={editForm.purchaseDate || ''}
                                onChange={(e) => setEditForm({ ...editForm, purchaseDate: e.target.value })}
                                className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white focus:border-cyan-500 focus:outline-none"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-[11px] text-slate-400 font-semibold block mb-1">
                              Sourcing & Quality Notes
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. MOQ 200kg drum, 2% moisture allowance..."
                              value={editForm.notes || ''}
                              onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                              className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white focus:border-cyan-500 focus:outline-none"
                            />
                          </div>

                          <div className="flex justify-end gap-2 pt-1">
                            <button
                              onClick={() => setEditingId(null)}
                              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded font-medium"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleSaveEdit}
                              className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs rounded font-bold flex items-center gap-1 shadow-md shadow-cyan-950"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Save Price Record</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

