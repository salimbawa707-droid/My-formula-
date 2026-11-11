/**
 * Formula Expert — Local State & Persistence Store
 * Self-contained offline state management using LocalStorage
 */

import { useState, useEffect } from 'react';
import { Formula, MasterIngredient, ManufacturingBatchRecord } from '../domain/types';
import { DEFAULT_FORMULAS } from '../data/defaultFormulas';
import { MASTER_INGREDIENTS } from '../domain/ingredientsMaster';

const STORAGE_KEYS = {
  FORMULAS: 'detergent_formulas_v2',
  CUSTOM_INGREDIENTS: 'detergent_custom_ingredients_v2',
  BATCH_RECORDS: 'detergent_batch_records_v2'
};

export function useFormulaStore() {
  const [formulas, setFormulas] = useState<Formula[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FORMULAS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading formulas from storage', e);
    }
    return DEFAULT_FORMULAS;
  });

  const [ingredients, setIngredients] = useState<MasterIngredient[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOM_INGREDIENTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading ingredients from storage', e);
    }
    return MASTER_INGREDIENTS;
  });

  const [batchRecords, setBatchRecords] = useState<ManufacturingBatchRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BATCH_RECORDS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading batch records from storage', e);
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FORMULAS, JSON.stringify(formulas));
    } catch (e) {
      console.error('Failed to save formulas', e);
    }
  }, [formulas]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_INGREDIENTS, JSON.stringify(ingredients));
    } catch (e) {
      console.error('Failed to save ingredients', e);
    }
  }, [ingredients]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BATCH_RECORDS, JSON.stringify(batchRecords));
    } catch (e) {
      console.error('Failed to save batch records', e);
    }
  }, [batchRecords]);

  const saveFormula = (formula: Formula) => {
    setFormulas(prev => {
      const exists = prev.some(f => f.id === formula.id);
      if (exists) {
        return prev.map(f => f.id === formula.id ? { ...formula, updatedAt: new Date().toISOString() } : f);
      }
      return [{ ...formula, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...prev];
    });
  };

  const deleteFormula = (id: string) => {
    setFormulas(prev => prev.filter(f => f.id !== id));
  };

  const duplicateFormula = (formula: Formula) => {
    const copy: Formula = {
      ...formula,
      id: `formula-copy-${Date.now()}`,
      name: `${formula.name} (Copy)`,
      isTemplate: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    saveFormula(copy);
    return copy;
  };

  const updateIngredient = (updated: MasterIngredient) => {
    setIngredients(prev => {
      const exists = prev.some(i => i.id === updated.id);
      if (exists) {
        return prev.map(i => i.id === updated.id ? updated : i);
      }
      return [...prev, updated];
    });
  };

  const addBatchRecord = (record: ManufacturingBatchRecord) => {
    setBatchRecords(prev => [record, ...prev]);
  };

  const resetToDefaults = () => {
    setFormulas(DEFAULT_FORMULAS);
    setIngredients(MASTER_INGREDIENTS);
    setBatchRecords([]);
    localStorage.removeItem(STORAGE_KEYS.FORMULAS);
    localStorage.removeItem(STORAGE_KEYS.CUSTOM_INGREDIENTS);
    localStorage.removeItem(STORAGE_KEYS.BATCH_RECORDS);
  };

  return {
    formulas,
    ingredients,
    batchRecords,
    saveFormula,
    deleteFormula,
    duplicateFormula,
    updateIngredient,
    addBatchRecord,
    resetToDefaults
  };
}
