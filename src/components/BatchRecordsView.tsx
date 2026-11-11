/**
 * Batch Manufacturing Execution Records
 * Log production batches against saved recipes with actual weighed masses, measured pH, and operator sign-offs.
 */

import React, { useState } from 'react';
import { Formula, ManufacturingBatchRecord, MasterIngredient } from '../domain/types';
import { MASTER_INGREDIENTS } from '../domain/ingredientsMaster';
import { ClipboardList, Plus, CheckCircle2, ShieldCheck, FileSpreadsheet } from 'lucide-react';

interface BatchRecordsViewProps {
  formulas: Formula[];
  batchRecords: ManufacturingBatchRecord[];
  onAddBatchRecord: (record: ManufacturingBatchRecord) => void;
  customIngredients?: MasterIngredient[];
}

export const BatchRecordsView: React.FC<BatchRecordsViewProps> = ({
  formulas,
  batchRecords,
  onAddBatchRecord,
  customIngredients = MASTER_INGREDIENTS
}) => {
  const [selectedFormulaId, setSelectedFormulaId] = useState<string>(formulas[0]?.id || '');
  const [operatorName, setOperatorName] = useState<string>('');
  const [actualBatchKg, setActualBatchKg] = useState<number>(100);
  const [measuredPH, setMeasuredPH] = useState<number>(7.0);
  const [batchNotes, setBatchNotes] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  const handleCreateBatch = () => {
    const targetFormula = formulas.find(f => f.id === selectedFormulaId);
    if (!targetFormula) return;

    const scaleFactor = actualBatchKg / (targetFormula.batchSizeKg || 100);

    const newRecord: ManufacturingBatchRecord = {
      id: `batch-${Date.now()}`,
      formulaId: targetFormula.id,
      formulaName: targetFormula.name,
      batchNumber: `LOT-${Math.floor(100000 + Math.random() * 900000)}`,
      plannedBatchSizeKg: targetFormula.batchSizeKg,
      actualBatchSizeKg: actualBatchKg,
      date: new Date().toISOString(),
      operatorName: operatorName || 'Operator',
      ingredientAdditions: targetFormula.items.map(item => {
        const ing = customIngredients.find(i => i.id === item.ingredientId);
        return {
          ingredientId: item.ingredientId,
          commercialName: ing?.commercialName || item.ingredientId,
          targetQtyKg: parseFloat((item.quantityKg * scaleFactor).toFixed(2)),
          actualQtyKg: parseFloat((item.quantityKg * scaleFactor).toFixed(2))
        };
      }),
      measuredPH,
      notes: batchNotes,
      status: 'COMPLETED'
    };

    onAddBatchRecord(newRecord);
    setShowCreateModal(false);
    setOperatorName('');
    setBatchNotes('');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-semibold">
            <ClipboardList className="w-4 h-4" />
            <span>Manufacturing Batch Execution</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">Production Batch History Records</h1>
          <p className="text-xs text-slate-400 mt-1">
            Log shop-floor raw material weighing and batch manufacturing execution records.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-cyan-900/40 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Batch Record</span>
        </button>
      </div>

      {/* Batch Creation Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-2">
              Log Production Batch Execution
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Select Formulation Recipe</label>
                <select
                  value={selectedFormulaId}
                  onChange={(e) => setSelectedFormulaId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  {formulas.map(f => (
                    <option key={f.id} value={f.id}>{f.name} ({f.mainCategory})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Actual Batch Mass (kg)</label>
                  <input
                    type="number"
                    value={actualBatchKg}
                    onChange={(e) => setActualBatchKg(parseFloat(e.target.value) || 100)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-cyan-400 font-bold font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Operator Name</label>
                  <input
                    type="text"
                    placeholder="E.g., John Doe"
                    value={operatorName}
                    onChange={(e) => setOperatorName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Measured Batch Final pH</label>
                <input
                  type="number"
                  step="0.1"
                  value={measuredPH}
                  onChange={(e) => setMeasuredPH(parseFloat(e.target.value) || 7.0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Batch Notes</label>
                <textarea
                  rows={2}
                  placeholder="Observations during mixing, dissolution time..."
                  value={batchNotes}
                  onChange={(e) => setBatchNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateBatch}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-lg shadow-lg"
              >
                Save Production Batch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History List */}
      <div className="space-y-4">
        {batchRecords.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-500 text-xs">
            No production batches recorded yet. Click "New Batch Record" to log shop-floor production.
          </div>
        ) : (
          batchRecords.map(rec => (
            <div key={rec.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-cyan-400 text-xs font-bold">{rec.batchNumber}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                      {rec.status}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white mt-1">{rec.formulaName}</h3>
                </div>

                <div className="text-right text-xs font-mono text-slate-400">
                  <div>Date: {new Date(rec.date).toLocaleDateString()}</div>
                  <div>Operator: {rec.operatorName}</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 bg-slate-950 p-3 rounded-lg text-xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-sans">Batch Size</span>
                  <span className="font-bold text-white">{rec.actualBatchSizeKg} kg</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-sans">Measured pH</span>
                  <span className="font-bold text-cyan-400">{rec.measuredPH || 'N/A'}</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-sans">Raw Materials Added</span>
                  <span className="font-bold text-slate-200">{rec.ingredientAdditions.length} Items</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
