/* Shared database-backed state + tiny change-notification bus. */

export const chartOfAccounts = [];
export const journalEntries = [];
export const auditLogs = [];
export const restaurantServices = [];
export const menuItems = [];
export const suppliers = [];
export const ingredientUsage = [];

const listeners = [];

export function onChange(fn) {
    listeners.push(fn);
}

export function emitChange() {
    listeners.forEach(fn => fn());
}

async function apiRequest(options = {}) {
    const response = await fetch('api/accounting.php', {
        headers: { 'Content-Type': 'application/json' },
        ...options
    });
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(payload.error || `Database request failed (${response.status}).`);
    }

    return payload;
}

export async function loadState() {
    const [data, operationsResponse] = await Promise.all([
        apiRequest(),
        fetch('api/operations.php', { cache: 'no-store' })
    ]);
    const operations = await operationsResponse.json().catch(() => ({}));
    if (!operationsResponse.ok) {
        throw new Error(operations.error || `Operational data request failed (${operationsResponse.status}).`);
    }

    chartOfAccounts.splice(0, chartOfAccounts.length, ...(data.chartOfAccounts || []));
    journalEntries.splice(0, journalEntries.length, ...(data.journalEntries || []));
    auditLogs.splice(0, auditLogs.length, ...(data.auditLogs || []));
    restaurantServices.splice(0, restaurantServices.length, ...(operations.services || []));
    menuItems.splice(0, menuItems.length, ...(operations.menuItems || []));
    suppliers.splice(0, suppliers.length, ...(operations.suppliers || []));
    ingredientUsage.splice(0, ingredientUsage.length, ...(operations.ingredientUsage || []));
}

export async function postEntry(entry) {
    const result = await apiRequest({
        method: 'POST',
        body: JSON.stringify(entry)
    });

    journalEntries.push(result.entry);
    auditLogs.push(result.auditLog);
    emitChange();
    return result.entry;
}
