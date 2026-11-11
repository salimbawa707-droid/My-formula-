/**
 * User Price Management Module
 * Manages user purchase prices in local storage.
 * All built-in ingredient prices are removed; prices are 100% user-controlled.
 */

import { MasterIngredient } from './types';

export interface UserPriceRecord {
  ingredientId: string;
  costPerKgINR: number | null;
  supplierName?: string;
  gradePurchased?: string;
  purchaseDate?: string;
  notes?: string;
  updatedAt?: string;
}

const STORAGE_KEY = 'my_formula_user_ingredient_prices';

/**
 * Loads all user-entered price records from localStorage.
 */
export function getUserPriceMap(): Record<string, UserPriceRecord> {
  if (typeof window === 'undefined' || !window.localStorage) {
    return {};
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      return parsed;
    }
  } catch (err) {
    console.warn('Failed to parse user ingredient price records:', err);
  }
  return {};
}

/**
 * Gets a user price record for a specific ingredient ID.
 */
export function getUserPrice(ingredientId: string): UserPriceRecord | null {
  const map = getUserPriceMap();
  return map[ingredientId] || null;
}

/**
 * Saves or updates a single user price record in localStorage.
 */
export function saveUserPrice(record: UserPriceRecord): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  const map = getUserPriceMap();
  map[record.ingredientId] = {
    ...record,
    updatedAt: new Date().toISOString()
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch (err) {
    console.error('Failed to save user ingredient price:', err);
  }
}

/**
 * Saves all user price records at once.
 */
export function saveAllUserPrices(map: Record<string, UserPriceRecord>): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch (err) {
    console.error('Failed to save user ingredient price map:', err);
  }
}

/**
 * Exports all user price records as a JSON string for user backup/export.
 */
export function exportUserPricesJson(): string {
  const map = getUserPriceMap();
  return JSON.stringify(map, null, 2);
}

/**
 * Imports user price records from a JSON string.
 */
export function importUserPricesJson(jsonString: string): { success: boolean; importedCount: number; error?: string } {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== 'object') {
      return { success: false, importedCount: 0, error: 'Invalid JSON structure' };
    }
    const currentMap = getUserPriceMap();
    let count = 0;

    for (const [id, record] of Object.entries(parsed)) {
      if (record && typeof record === 'object') {
        const cost = (record as any).costPerKgINR;
        currentMap[id] = {
          ingredientId: id,
          costPerKgINR: typeof cost === 'number' && Number.isFinite(cost) && cost >= 0 ? cost : null,
          supplierName: (record as any).supplierName || undefined,
          gradePurchased: (record as any).gradePurchased || undefined,
          purchaseDate: (record as any).purchaseDate || undefined,
          notes: (record as any).notes || undefined,
          updatedAt: new Date().toISOString()
        };
        count++;
      }
    }

    saveAllUserPrices(currentMap);
    return { success: true, importedCount: count };
  } catch (err: any) {
    return { success: false, importedCount: 0, error: err?.message || 'Failed to parse JSON' };
  }
}

/**
 * Applies user price records to a list of master ingredients.
 * If no user price exists for an ingredient, its costPerKg remains null (unpriced).
 */
export function applyUserPricesToIngredients(ingredients: MasterIngredient[]): MasterIngredient[] {
  const userMap = getUserPriceMap();
  return ingredients.map(ing => {
    const userRec = userMap[ing.id];
    if (userRec && userRec.costPerKgINR !== undefined) {
      return {
        ...ing,
        costPerKg: userRec.costPerKgINR,
        supplierName: userRec.supplierName,
        gradePurchased: userRec.gradePurchased,
        purchaseDate: userRec.purchaseDate,
        notes: userRec.notes
      };
    }
    return {
      ...ing,
      costPerKg: null
    };
  });
}
