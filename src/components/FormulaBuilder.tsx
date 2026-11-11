/**
 * Formula Builder Workspace
 * Interactive formulation builder with live mass balance, active matter, water q.s., and 11-Stage "CHECK MY FORMULA" trigger.
 */

import React, { useState, useEffect } from 'react';
import { Formula, FormulaItem, MasterIngredient, ProductSubcategory, MainCategory } from '../domain/types';
import { MASTER_INGREDIENTS } from '../domain/ingredientsMaster';
import { getSubcategoryInfo, MAIN_CATEGORIES } from '../domain/taxonomy';
import { calculateActiveMatter } from '../engines/activeMatterEngine';
import { calculateCosting } from '../engines/costingEngine';
import {
  Plus,
  Trash2,
  Play,
  Save,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Droplets,
  DollarSign
} from 'lucide-react';

interface FormulaBuilderProps {
  formula: Formula;
  onUpdateFormula: (formula: Formula) => void;
  onRunAnalysis: (formula: Formula) => void;
  onSaveFormula: (formula: Formula) => void;
  customIngredients?: MasterIngredient[];
}

export const FormulaBuilder: React.FC<FormulaBuilderProps> = ({
  formula,
  onUpdateFormula,
  onRunAnalysis,
  onSaveFormula,
  customIngredients = MASTER_INGREDIENTS
}) => {
  const [items, setItems] = useState<FormulaItem[]>(formula.items);
  const [batchSizeKg, setBatchSizeKg] = useState<number>(formula.batchSizeKg || 100);
  const [formulaName, setFormulaName] = useState<string>(formula.name);
  const [subcategory, setSubcategory] = useState<ProductSubcategory>(formula.subcategory);
  const [selectedIngredientToAdd, setSelectedIngredientToAdd] = useState<string>('');

  useEffect(() => {
    setItems(formula.items);
    setBatchSizeKg(formula.batchSizeKg || 100);
    setFormulaName(formula.name);
    setSubcategory(formula.subcategory);
  }, [formula]);

  const subcatInfo = getSubcategoryInfo(subcategory);

  const getIngredient = (id: string): MasterIngredient => {
    return customIngredients.find(i => i.id === id) || {
      id,
      chemicalName: `Unknown (${id})`,
      commercialName: `Commercial ${id}`,
      category: 'Other Additive',
      activeFraction: 1.0,
      commercialConcentrationPercent: 100,
      density: 1.0,
      costPerKg: 1.0,
      functionalRole: 'Additive',
      dataSource: 'Custom',
      dataStatus: 'UNKNOWN'
    };
  };

  const updateItemQty = (index: number, newQtyKg: number) => {
    const updated = [...items];
    updated[index].quantityKg = Math.max(0, newQtyKg);
    setItems(updated);
    triggerParentUpdate(updated, batchSizeKg, formulaName, subcategory);
  };

  const removeItem = (index: number) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
    triggerParentUpdate(updated, batchSizeKg, formulaName, subcategory);
  };

  const addIngredientItem = () => {
    if (!selectedIngredientToAdd) return;
    const exists = items.some(i => i.ingredientId === selectedIngredientToAdd);
    if (exists) return;

    const ing = getIngredient(selectedIngredientToAdd);
    const newItem: FormulaItem = {
      ingredientId: selectedIngredientToAdd,
      quantityKg: ing.id.includes('water') ? 50 : 2.0
    };
    const updated = [...items, newItem];
    setItems(updated);
    setSelectedIngredientToAdd('');
    triggerParentUpdate(updated, batchSizeKg, formulaName, subcategory);
  };

  const calculateWaterQS = () => {
    const nonWaterSum = items
      .filter(i => !i.ingredientId.includes('water'))
      .reduce((acc, curr) => acc + (curr.quantityKg || 0), 0);

    const neededWater = Math.max(0, batchSizeKg - nonWaterSum);

    let waterIndex = items.findIndex(i => i.ingredientId.includes('water'));
    let updated = [...items];

    if (waterIndex >= 0) {
      updated[waterIndex].quantityKg = parseFloat(neededWater.toFixed(2));
    } else {
      updated.push({
        ingredientId: 'deionized-water',
        quantityKg: parseFloat(neededWater.toFixed(2))
      });
    }

    setItems(updated);
    triggerParentUpdate(updated, batchSizeKg, formulaName, subcategory);
  };

  const triggerParentUpdate = (
    currentItems: FormulaItem[],
    batchKg: number,
    name: string,
    subcat: ProductSubcategory
  ) => {
    const mainCat: MainCategory = subcat.includes('dishwash') || subcat.includes('dishwasher')
      ? 'DISH WASH'
      : 'LIQUID DETERGENTS';

    const updatedFormula: Formula = {
      ...formula,
      name,
      mainCategory: mainCat,
      subcategory: subcat,
      batchSizeKg: batchKg,
      items: currentItems,
      updatedAt: new Date().toISOString()
    };
    onUpdateFormula(updatedFormula);
  };

  // Live Calculations
  const totalWeightKg = items.reduce((sum, i) => sum + (i.quantityKg || 0), 0);
  const massDiscrepancyKg = totalWeightKg - batchSizeKg;
  const isBalanced = Math.abs(massDiscrepancyKg) < 0.01;

  const activeMatter = calculateActiveMatter(items, customIngredients);
  const costing = calculateCosting(items, batchSizeKg, customIngredients);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex-1 space-y-2 w-full">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Formula Name</label>
            <input
              type="text"
              value={formulaName}
              onChange={(e) => {
                setFormulaName(e.target.value);
                triggerParentUpdate(items, batchSizeKg, e.target.value, subcategory);
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-white font-bold text-lg focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={() => onSaveFormula({ ...formula, items, batchSizeKg, name: formulaName, subcategory })}
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-all"
            >
              <Save className="w-4 h-4 text-cyan-400" />
              <span>Save Recipe</span>
            </button>

            <button
              onClick={() => onRunAnalysis({ ...formula, items, batchSizeKg, name: formulaName, subcategory })}
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-cyan-900/40 transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>CHECK MY FORMULA</span>
            </button>
          </div>
        </div>

        {/* Subcategory & Batch Size Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-400">Target Subcategory</label>
            <select
              value={subcategory}
              onChange={(e) => {
                const newSub = e.target.value as ProductSubcategory;
                setSubcategory(newSub);
                triggerParentUpdate(items, batchSizeKg, formulaName, newSub);
              }}
              className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              {MAIN_CATEGORIES.flatMap(m => m.subcategories).map(sub => (
                <option key={sub.id} value={sub.id}>
                  {sub.parentCategory}: {sub.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400">Batch Size (kg)</label>
            <input
              type="number"
              min="1"
              value={batchSizeKg}
              onChange={(e) => {
                const val = Math.max(1, parseFloat(e.target.value) || 100);
                setBatchSizeKg(val);
                triggerParentUpdate(items, val, formulaName, subcategory);
              }}
              className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={calculateWaterQS}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-800 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-700 text-cyan-400 text-xs font-medium rounded-lg transition-all"
            >
              <Droplets className="w-4 h-4" />
              <span>Water q.s. to 100% Batch</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Formulation Metrics Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-[11px] font-semibold text-slate-400">Total Batch Mass</span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold font-mono text-white">{totalWeightKg.toFixed(2)}</span>
            <span className="text-xs text-slate-500">/ {batchSizeKg} kg</span>
          </div>
          <div className="text-[10px] text-slate-500">
            {isBalanced ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Exact 100% Mass
              </span>
            ) : (
              <span className="text-amber-400 font-semibold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Discrepancy: {massDiscrepancyKg > 0 ? '+' : ''}{massDiscrepancyKg.toFixed(2)} kg
              </span>
            )}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-[11px] font-semibold text-slate-400">Surfactant Active Matter</span>
          <div className="text-xl font-bold font-mono text-cyan-400">
            {activeMatter.totalActiveMatterPercent.toFixed(1)}%
          </div>
          <p className="text-[10px] text-slate-500">Target: {subcatInfo.targetActiveMatterMin}% - {subcatInfo.targetActiveMatterMax}%</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-[11px] font-semibold text-slate-400">Material Cost</span>
          <div className="text-xl font-bold font-mono text-emerald-400">
            {costing.isCostingComplete ? (
              <>₹{costing.costPerKgINR.toFixed(2)} <span className="text-xs text-slate-500">/ kg</span></>
            ) : (
              <span className="text-amber-400 text-sm">₹{costing.costPerKgINR.toFixed(2)} (Partial)</span>
            )}
          </div>
          <p className="text-[10px] text-slate-500">
            {costing.isCostingComplete ? `Batch total: ₹${costing.directMaterialCostINR.toFixed(2)}` : `Subtotal: ₹${costing.knownSubtotalCostINR.toFixed(2)} (Incomplete)`}
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-[11px] font-semibold text-slate-400">Cost per Liter</span>
          <div className="text-xl font-bold font-mono text-slate-200">
            ₹{costing.costPerLiterINR.toFixed(2)} <span className="text-xs text-slate-500">/ L</span>
          </div>
          <p className="text-[10px] text-slate-500">Density estimated</p>
        </div>
      </div>

      {!costing.isCostingComplete && (
        <div className="bg-amber-950/80 border border-amber-800 p-4 rounded-xl text-xs text-amber-200 flex items-start gap-3 shadow-lg">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-amber-300 text-sm">INCOMPLETE FORMULA COSTING</div>
            <p>
              The following ingredient(s) have no purchase price entered:{' '}
              <span className="font-mono text-white font-semibold">{costing.unpricedIngredientNames.join(', ')}</span>.
            </p>
            <p className="text-[11px] text-amber-400/90">
              Material cost subtotal reflects known priced ingredients only (₹{costing.knownSubtotalCostINR.toFixed(2)}). Go to the Ingredient Library tab to enter ingredient purchase prices.
            </p>
          </div>
        </div>
      )}

      {/* Ingredient Formulation Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Recipe Ingredients ({items.length})
          </h2>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedIngredientToAdd}
              onChange={(e) => setSelectedIngredientToAdd(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 w-full sm:w-64 focus:outline-none focus:border-cyan-500"
            >
              <option value="">-- Add Ingredient --</option>
              {customIngredients.map(ing => (
                <option key={ing.id} value={ing.id}>
                  {ing.commercialName} ({ing.category})
                </option>
              ))}
            </select>

            <button
              onClick={addIngredientItem}
              disabled={!selectedIngredientToAdd}
              className="flex items-center gap-1 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-mono uppercase text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-3">Ingredient Commercial Name</th>
                <th className="p-3">Category</th>
                <th className="p-3 text-right">Qty (kg)</th>
                <th className="p-3 text-right">Weight %</th>
                <th className="p-3 text-right">Active %</th>
                <th className="p-3 text-right">Active Contribution</th>
                <th className="p-3 text-right">Cost/kg (₹)</th>
                <th className="p-3 text-right">Item Total (₹)</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-200">
              {items.map((item, index) => {
                const ing = getIngredient(item.ingredientId);
                const qtyKg = item.quantityKg || 0;
                const weightPct = totalWeightKg > 0 ? (qtyKg / batchSizeKg) * 100 : 0;
                const activePct = item.activeConcentrationPercentOverride !== undefined
                  ? item.activeConcentrationPercentOverride
                  : ing.commercialConcentrationPercent;
                const activeContribPct = (qtyKg * (activePct / 100) / batchSizeKg) * 100;
                const costPerKg = item.costPerKgOverride !== undefined && item.costPerKgOverride !== null
                  ? item.costPerKgOverride
                  : ing.costPerKg;
                const hasPrice = costPerKg !== null && costPerKg !== undefined && !isNaN(costPerKg);
                const itemTotalCost = hasPrice ? qtyKg * (costPerKg as number) : null;

                return (
                  <tr key={`${item.ingredientId}-${index}`} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-sans font-semibold text-slate-100">
                      <div>{ing.commercialName}</div>
                      <div className="text-[10px] text-slate-500 font-normal">{ing.chemicalName}</div>
                    </td>

                    <td className="p-3 font-sans text-slate-400">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-950 border border-slate-800">
                        {ing.category}
                      </span>
                    </td>

                    <td className="p-3 text-right">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={qtyKg}
                        onChange={(e) => updateItemQty(index, parseFloat(e.target.value) || 0)}
                        className="w-20 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-right text-cyan-400 font-bold focus:outline-none focus:border-cyan-500"
                      />
                    </td>

                    <td className="p-3 text-right text-slate-300">
                      {weightPct.toFixed(2)}%
                    </td>

                    <td className="p-3 text-right text-slate-400">
                      {activePct}%
                    </td>

                    <td className="p-3 text-right text-cyan-400 font-semibold">
                      {activeContribPct.toFixed(2)}%
                    </td>

                    <td className="p-3 text-right">
                      {hasPrice ? (
                        <span className="text-slate-200">₹{(costPerKg as number).toFixed(2)}</span>
                      ) : (
                        <span className="text-amber-400 italic text-[10px]">Unpriced</span>
                      )}
                    </td>

                    <td className="p-3 text-right font-semibold">
                      {itemTotalCost !== null ? (
                        <span className="text-emerald-400">₹{itemTotalCost.toFixed(2)}</span>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>

                    <td className="p-3 text-center">
                      <button
                        onClick={() => removeItem(index)}
                        className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                        title="Remove Ingredient"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="text-slate-400">
            Total Batch Formula Weight: <span className="font-bold font-mono text-white">{totalWeightKg.toFixed(2)} kg</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={calculateWaterQS}
              className="text-cyan-400 hover:underline text-xs flex items-center gap-1 font-medium"
            >
              <Droplets className="w-3.5 h-3.5" /> Auto Balance Water q.s.
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
