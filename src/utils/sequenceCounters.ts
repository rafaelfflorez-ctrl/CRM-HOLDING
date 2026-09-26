// Utility to track and persist sequential counters for Purchase Orders (ODC) and Quotations (COT)

const ODC_COUNTER_KEY = "wpc_odc_counters_v3";
const COT_COUNTER_KEY = "wpc_cot_counters_v3";

export function getStoredCounters(key: string): Record<string, number> {
  try {
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error("Failed to read counter from localStorage", e);
  }
  return { WPC: 1, RAEZ: 1, HELENAMAR: 1, FUNDACION: 1 };
}

export function saveStoredCounters(key: string, counters: Record<string, number>) {
  try {
    localStorage.setItem(key, JSON.stringify(counters));
  } catch (e) {
    console.error("Failed to save counter to localStorage", e);
  }
}

/**
 * Extracts the highest consecutive numeric value present in existing documents
 */
export function getMaxConsecutiveFromList(
  list: Array<{ id: string; companyId?: string }>,
  prefix: "COT" | "ODC",
  companyId: string
): number {
  const normCompany = (companyId || "WPC").toUpperCase();
  let maxNum = 0;
  const regex = new RegExp(`^${prefix}-(?:${normCompany}-)?(\\d+)`, "i");
  for (const item of list) {
    if (!item || !item.id) continue;
    // Check match
    const match = item.id.match(regex);
    if (match && match[1]) {
      const n = parseInt(match[1], 10);
      if (!isNaN(n) && n > maxNum) {
        maxNum = n;
      }
    }
  }
  return maxNum;
}

/**
 * Peeks the upcoming sequential Quotation ID without incrementing the counter
 */
export function peekNextCOTId(
  companyId: string = "WPC",
  existingEstimates?: Array<{ id: string; companyId?: string }>
): { nextId: string; nextNumber: number } {
  const normCompany = (companyId || "WPC").toUpperCase();
  const counters = getStoredCounters(COT_COUNTER_KEY);
  const maxExisting = existingEstimates ? getMaxConsecutiveFromList(existingEstimates, "COT", normCompany) : 0;
  const currentCount = Math.max(counters[normCompany] ?? 1, maxExisting + 1);
  const padded = String(currentCount).padStart(4, "0");
  return {
    nextId: `COT-${normCompany}-${padded}`,
    nextNumber: currentCount,
  };
}

/**
 * Generates next sequential Quotation / Estimate ID (e.g. COT-WPC-0001, COT-WPC-0002)
 * Synchronizes with existing estimates to ensure no duplicate or skipped numbers,
 * and updates the stored consecutive counter immediately.
 */
export function generateNextCOTId(
  companyId: string = "WPC",
  existingEstimates?: Array<{ id: string; companyId?: string }>
): string {
  const normCompany = (companyId || "WPC").toUpperCase();
  const counters = getStoredCounters(COT_COUNTER_KEY);
  const maxExisting = existingEstimates ? getMaxConsecutiveFromList(existingEstimates, "COT", normCompany) : 0;
  const currentCount = Math.max(counters[normCompany] ?? 1, maxExisting + 1);

  const padded = String(currentCount).padStart(4, "0");
  const id = `COT-${normCompany}-${padded}`;

  // Increment and persist next consecutive
  counters[normCompany] = currentCount + 1;
  saveStoredCounters(COT_COUNTER_KEY, counters);

  return id;
}

/**
 * Calibrates or sets the next consecutive number for Quotations of a specific company
 */
export function setNextCOTConsecutive(companyId: string = "WPC", nextNumber: number) {
  const normCompany = (companyId || "WPC").toUpperCase();
  const counters = getStoredCounters(COT_COUNTER_KEY);
  counters[normCompany] = Math.max(1, Math.floor(nextNumber));
  saveStoredCounters(COT_COUNTER_KEY, counters);
}

/**
 * Peeks the upcoming sequential Purchase Order ID without incrementing
 */
export function peekNextODCId(
  companyId: string = "WPC",
  existingPOs?: Array<{ id: string; companyId?: string }>
): { nextId: string; nextNumber: number } {
  const normCompany = (companyId || "WPC").toUpperCase();
  const counters = getStoredCounters(ODC_COUNTER_KEY);
  const maxExisting = existingPOs ? getMaxConsecutiveFromList(existingPOs, "ODC", normCompany) : 0;
  const currentCount = Math.max(counters[normCompany] ?? 1, maxExisting + 1);
  const padded = String(currentCount).padStart(4, "0");
  return {
    nextId: `ODC-${normCompany}-${padded}`,
    nextNumber: currentCount,
  };
}

/**
 * Generates next sequential Purchase Order ID (e.g. ODC-WPC-0001, ODC-WPC-0002)
 */
export function generateNextODCId(
  companyId: string = "WPC",
  existingPOs?: Array<{ id: string; companyId?: string }>
): string {
  const normCompany = (companyId || "WPC").toUpperCase();
  const counters = getStoredCounters(ODC_COUNTER_KEY);
  const maxExisting = existingPOs ? getMaxConsecutiveFromList(existingPOs, "ODC", normCompany) : 0;
  const currentCount = Math.max(counters[normCompany] ?? 1, maxExisting + 1);

  const padded = String(currentCount).padStart(4, "0");
  const id = `ODC-${normCompany}-${padded}`;

  counters[normCompany] = currentCount + 1;
  saveStoredCounters(ODC_COUNTER_KEY, counters);

  return id;
}

/**
 * Calibrates or sets the next consecutive number for Purchase Orders of a specific company
 */
export function setNextODCConsecutive(companyId: string = "WPC", nextNumber: number) {
  const normCompany = (companyId || "WPC").toUpperCase();
  const counters = getStoredCounters(ODC_COUNTER_KEY);
  counters[normCompany] = Math.max(1, Math.floor(nextNumber));
  saveStoredCounters(ODC_COUNTER_KEY, counters);
}

/**
 * Resets counters back to 1 for all companies
 */
export function resetSequenceCounters() {
  const initial = { WPC: 1, RAEZ: 1, HELENAMAR: 1, FUNDACION: 1 };
  saveStoredCounters(ODC_COUNTER_KEY, initial);
  saveStoredCounters(COT_COUNTER_KEY, initial);
}


