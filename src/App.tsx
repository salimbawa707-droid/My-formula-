/**
 * Detergent Formula Expert — Main Application Controller
 */

import React, { useState } from 'react';
import { useFormulaStore } from './stores/formulaStore';
import { Formula, ProductSubcategory } from './domain/types';
import { DEFAULT_FORMULAS } from './data/defaultFormulas';
import { runFormulaAnalysisPipeline } from './engines/formulaAnalysisPipeline';

import { Layout, ActiveTab } from './components/Layout';
import { CategorySelector } from './components/CategorySelector';
import { FormulaBuilder } from './components/FormulaBuilder';
import { FormulaAnalysisView } from './components/FormulaAnalysisView';
import { IngredientLibrary } from './components/IngredientLibrary';
import { FormulaLibrary } from './components/FormulaLibrary';
import { FormulaComparison } from './components/FormulaComparison';
import { CalculatorsView } from './components/CalculatorsView';
import { BatchRecordsView } from './components/BatchRecordsView';

export default function App() {
  const {
    formulas,
    ingredients,
    batchRecords,
    saveFormula,
    deleteFormula,
    duplicateFormula,
    updateIngredient,
    addBatchRecord
  } = useFormulaStore();

  const [activeTab, setActiveTab] = useState<ActiveTab>('categories');
  const [activeFormula, setActiveFormula] = useState<Formula>(DEFAULT_FORMULAS[0]);
  const [analysisReport, setAnalysisReport] = useState(() => runFormulaAnalysisPipeline(DEFAULT_FORMULAS[0], ingredients));
  const [comparePair, setComparePair] = useState<[Formula, Formula] | null>(null);

  const handleSelectSubcategory = (subcat: ProductSubcategory, template?: Formula) => {
    const formulaToUse: Formula = template ? { ...template } : {
      id: `formula-custom-${Date.now()}`,
      name: `New ${subcat.replace(/_/g, ' ')} Recipe`,
      description: 'Custom formulation recipe.',
      mainCategory: subcat.includes('dishwash') || subcat.includes('dishwasher') ? 'DISH WASH' : 'LIQUID DETERGENTS',
      subcategory: subcat,
      batchSizeKg: 100,
      items: [
        { ingredientId: 'labsa-90', quantityKg: 8.0 },
        { ingredientId: 'naoh-50', quantityKg: 1.8 },
        { ingredientId: 'sles-28', quantityKg: 20.0 },
        { ingredientId: 'deionized-water', quantityKg: 70.2 }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setActiveFormula(formulaToUse);
    setActiveTab('builder');
  };

  const handleRunAnalysis = (formulaToAnalyze: Formula) => {
    setActiveFormula(formulaToAnalyze);
    const report = runFormulaAnalysisPipeline(formulaToAnalyze, ingredients);
    setAnalysisReport(report);
    setActiveTab('analysis');
  };

  const handleSaveFormula = (formulaToSave: Formula) => {
    saveFormula(formulaToSave);
    setActiveFormula(formulaToSave);
  };

  const handleNewFormula = () => {
    const blank: Formula = {
      id: `formula-new-${Date.now()}`,
      name: 'New Detergent Recipe',
      description: 'Custom liquid detergent recipe.',
      mainCategory: 'LIQUID DETERGENTS',
      subcategory: 'general_laundry',
      batchSizeKg: 100,
      items: [
        { ingredientId: 'labsa-90', quantityKg: 6.0 },
        { ingredientId: 'naoh-50', quantityKg: 1.35 },
        { ingredientId: 'sles-28', quantityKg: 18.0 },
        { ingredientId: 'deionized-water', quantityKg: 74.65 }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setActiveFormula(blank);
    setActiveTab('builder');
  };

  const handleOpenCompare = (pair: [Formula, Formula]) => {
    setComparePair(pair);
    setActiveTab('compare');
  };

  return (
    <Layout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      activeFormulaName={activeFormula?.name}
    >
      {activeTab === 'categories' && (
        <CategorySelector onSelectSubcategory={handleSelectSubcategory} />
      )}

      {activeTab === 'builder' && (
        <FormulaBuilder
          formula={activeFormula}
          onUpdateFormula={setActiveFormula}
          onRunAnalysis={handleRunAnalysis}
          onSaveFormula={handleSaveFormula}
          customIngredients={ingredients}
        />
      )}

      {activeTab === 'analysis' && (
        <FormulaAnalysisView
          formula={activeFormula}
          report={analysisReport}
          onBackToBuilder={() => setActiveTab('builder')}
        />
      )}

      {activeTab === 'ingredients' && (
        <IngredientLibrary
          ingredients={ingredients}
          onUpdateIngredient={updateIngredient}
        />
      )}

      {activeTab === 'formulas' && (
        <FormulaLibrary
          formulas={formulas}
          onSelectFormula={(f) => {
            setActiveFormula(f);
            setActiveTab('builder');
          }}
          onRunAnalysis={handleRunAnalysis}
          onDuplicateFormula={(f) => {
            const dup = duplicateFormula(f);
            setActiveFormula(dup);
          }}
          onDeleteFormula={deleteFormula}
          onNewFormula={handleNewFormula}
          onOpenCompare={handleOpenCompare}
        />
      )}

      {activeTab === 'compare' && (
        <FormulaComparison
          formulas={comparePair || [formulas[0] || DEFAULT_FORMULAS[0], formulas[1] || DEFAULT_FORMULAS[1]]}
          onBack={() => setActiveTab('formulas')}
          customIngredients={ingredients}
        />
      )}

      {activeTab === 'calculators' && (
        <CalculatorsView />
      )}

      {activeTab === 'batches' && (
        <BatchRecordsView
          formulas={formulas}
          batchRecords={batchRecords}
          onAddBatchRecord={addBatchRecord}
          customIngredients={ingredients}
        />
      )}
    </Layout>
  );
}
