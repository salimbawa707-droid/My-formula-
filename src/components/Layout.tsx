/**
 * Detergent Formula Expert — Application Header & Navigation Layout
 * Fully responsive, non-overlapping header with clean industrial visual design.
 */

import React from 'react';
import {
  FlaskConical,
  Beaker,
  Database,
  BookOpen,
  Calculator,
  ClipboardList,
  GitCompare,
  Layers,
  WifiOff
} from 'lucide-react';

export type ActiveTab =
  | 'categories'
  | 'builder'
  | 'analysis'
  | 'ingredients'
  | 'formulas'
  | 'compare'
  | 'calculators'
  | 'batches';

interface LayoutProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  children: React.ReactNode;
  activeFormulaName?: string;
}

export const Layout: React.FC<LayoutProps> = ({
  activeTab,
  setActiveTab,
  children,
  activeFormulaName
}) => {
  const navItems = [
    { id: 'categories' as ActiveTab, label: 'Product Categories', icon: Layers },
    { id: 'builder' as ActiveTab, label: 'Formula Builder', icon: Beaker },
    { id: 'ingredients' as ActiveTab, label: 'Ingredient Library', icon: Database },
    { id: 'formulas' as ActiveTab, label: 'Saved Formulas', icon: BookOpen },
    { id: 'compare' as ActiveTab, label: 'Formula Compare', icon: GitCompare },
    { id: 'calculators' as ActiveTab, label: 'Calculators', icon: Calculator },
    { id: 'batches' as ActiveTab, label: 'Batch Records', icon: ClipboardList }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Main Header */}
      <header className="bg-slate-950/95 border-b border-slate-800/90 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-0 sm:h-16 flex flex-wrap items-center justify-between gap-2.5">
          {/* Brand Logo & App Title */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setActiveTab('categories')}
          >
            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-2 rounded-xl text-white shadow-lg shadow-cyan-950/50 group-hover:scale-105 transition-transform shrink-0">
              <FlaskConical className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg text-white tracking-wide font-mono">
                  FORMULA EXPERT
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold bg-cyan-950/90 text-cyan-400 border border-cyan-800/80 rounded-md tracking-wider uppercase">
                  R&D
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Scientific Detergent Formulation Engine
              </p>
            </div>
          </div>

          {/* Active Recipe Display Pill (Desktop & Tablet) */}
          {activeFormulaName && (
            <div className="hidden lg:flex items-center gap-2 bg-slate-900/90 border border-slate-800/80 px-3 py-1.5 rounded-lg text-xs text-slate-300 shadow-inner">
              <span className="text-slate-500 font-medium">Active:</span>
              <span className="font-semibold text-cyan-400 max-w-[220px] truncate">
                {activeFormulaName}
              </span>
            </div>
          )}

          {/* Offline Status Badge */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono bg-slate-900/90 border border-slate-800 text-slate-300 px-2.5 py-1 rounded-full shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
              <span className="hidden sm:inline">Offline Engine</span>
              <span className="sm:hidden">Offline</span>
            </span>
          </div>
        </div>

        {/* Horizontal Scrollable Navigation Bar */}
        <div className="bg-slate-900/95 border-t border-slate-800/60 px-2 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center gap-1 py-1.5 overflow-x-auto no-scrollbar scroll-smooth">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive =
                activeTab === item.id || (item.id === 'builder' && activeTab === 'analysis');

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-950/40'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/70'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 lg:p-8">
        {children}
      </main>

      {/* Industrial Footer */}
      <footer className="bg-slate-950 border-t border-slate-800/80 py-3.5 px-4 sm:px-8 text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>© Detergent Formula Expert — Deterministic Chemical Formulation Engine</p>
        <p className="font-mono text-slate-400">LIQUID DETERGENTS & DISH WASH ONLY • 100% Offline</p>
      </footer>
    </div>
  );
};
