/**
 * 11-Stage Formula Analysis Report Display View
 * Displays transparent mathematical calculation steps, equations, inputs, assumptions, and missing data warnings.
 */

import React from 'react';
import { Formula, FormulaAnalysisReport } from '../domain/types';
import { printScientificDossier, exportFormulaAsJSON, exportFormulaAsCSV } from '../utils/exportUtils';
import {
  ShieldCheck,
  Printer,
  Download,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  FileText,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';

interface FormulaAnalysisViewProps {
  formula: Formula;
  report: FormulaAnalysisReport;
  onBackToBuilder: () => void;
}

export const FormulaAnalysisView: React.FC<FormulaAnalysisViewProps> = ({
  formula,
  report,
  onBackToBuilder
}) => {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Bar Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <button
          onClick={onBackToBuilder}
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Formula Builder</span>
        </button>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => exportFormulaAsCSV(formula)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-all"
          >
            <Download className="w-3.5 h-3.5" /> CSV
          </button>

          <button
            onClick={() => exportFormulaAsJSON(formula)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-all"
          >
            <Download className="w-3.5 h-3.5" /> JSON
          </button>

          <button
            onClick={() => printScientificDossier(formula, report)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-cyan-900/30 transition-all"
          >
            <Printer className="w-3.5 h-3.5" /> Print Dossier
          </button>
        </div>
      </div>

      {/* Overview Executive Summary Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-mono text-cyan-400 font-semibold uppercase tracking-wider">
              11-Stage Staged Analysis
            </span>
            <h1 className="text-2xl font-bold text-white">{report.formulaName}</h1>
            <p className="text-xs text-slate-400">
              {report.mainCategory} • {report.subcategory} • Batch Size: {report.batchSizeKg} kg
            </p>
          </div>

          <div className="text-right">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
              report.overallSummary.productRoutingSuitability === 'OPTIMAL'
                ? 'bg-emerald-950 border border-emerald-800 text-emerald-400'
                : 'bg-amber-950 border border-amber-800 text-amber-400'
            }`}>
              Routing Status: {report.overallSummary.productRoutingSuitability}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          <div className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-lg">
            <span className="text-[10px] text-slate-500 font-semibold uppercase">Active Matter</span>
            <div className="text-lg font-bold font-mono text-cyan-400">
              {report.overallSummary.activeMatterPercent}%
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-lg">
            <span className="text-[10px] text-slate-500 font-semibold uppercase">Estimated pH</span>
            <div className="text-lg font-bold font-mono text-slate-200">
              {report.overallSummary.estimatedPH}
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-lg">
            <span className="text-[10px] text-slate-500 font-semibold uppercase">Chelation Cap.</span>
            <div className="text-lg font-bold font-mono text-blue-400">
              {report.overallSummary.chelationCapacityPpm} ppm
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-lg">
            <span className="text-[10px] text-slate-500 font-semibold uppercase">Material Cost</span>
            <div className="text-lg font-bold font-mono text-emerald-400">
              ${report.overallSummary.costPerKgUSD.toFixed(3)} / kg
            </div>
          </div>
        </div>
      </div>

      {/* 11 Stages Timeline */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>Detailed Staged Calculation Stages (1 to 11)</span>
        </h2>

        {report.stages.map((stage) => {
          const isPassed = stage.status === 'PASSED';
          const isWarning = stage.status === 'WARNING';
          const isInsufficient = stage.status === 'INSUFFICIENT_DATA';

          return (
            <div
              key={stage.stageNumber}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 shadow-lg"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono text-xs font-bold flex items-center justify-center">
                    {stage.stageNumber}
                  </span>
                  <h3 className="text-sm font-bold text-white">{stage.stageName}</h3>
                </div>

                <div>
                  {isPassed && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2.5 py-0.5 rounded-md">
                      <CheckCircle className="w-3.5 h-3.5" /> PASSED
                    </span>
                  )}
                  {isWarning && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-amber-400 bg-amber-950/60 border border-amber-800 px-2.5 py-0.5 rounded-md">
                      <AlertTriangle className="w-3.5 h-3.5" /> WARNING
                    </span>
                  )}
                  {isInsufficient && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-slate-400 bg-slate-950 border border-slate-800 px-2.5 py-0.5 rounded-md">
                      <HelpCircle className="w-3.5 h-3.5" /> INSUFFICIENT DATA
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase">Calculation Method</span>
                  <p className="text-slate-300 leading-relaxed">{stage.calculationMethod}</p>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase">Equation Used</span>
                  <div className="font-mono text-cyan-300 bg-slate-950 border border-slate-800 p-2 rounded text-[11px]">
                    {stage.equationUsed}
                  </div>
                </div>
              </div>

              {/* Calculated Outputs */}
              <div className="bg-slate-950/80 border border-slate-800/80 p-3 rounded-lg space-y-1 text-xs font-mono">
                <span className="text-[10px] text-slate-500 font-bold uppercase font-sans">Calculated Stage Result:</span>
                <pre className="text-slate-200 overflow-x-auto text-[11px] whitespace-pre-wrap">
                  {JSON.stringify(stage.actualCalculatedResult, null, 2)}
                </pre>
              </div>

              {/* Warnings and Missing Info */}
              {stage.warnings.length > 0 && (
                <div className="bg-amber-950/40 border border-amber-800/60 p-3 rounded-lg text-xs text-amber-300 space-y-1">
                  <div className="font-semibold flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" /> Warnings & Observations:
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 text-amber-200/90 pl-1">
                    {stage.warnings.map((w, idx) => (
                      <li key={idx}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}

              {stage.missingData.length > 0 && (
                <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg text-xs text-slate-400 space-y-1">
                  <div className="font-semibold text-slate-300">Missing Specifications / Data Gaps:</div>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-400 pl-1">
                    {stage.missingData.map((m, idx) => (
                      <li key={idx}>{m}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
