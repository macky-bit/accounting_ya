/* Shared database-backed state + tiny change-notification bus. */

export const chartOfAccounts = [];
export const journalEntries = [];
export const auditLogs = [];

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
    const data = await apiRequest();
    chartOfAccounts.splice(0, chartOfAccounts.length, ...(data.chartOfAccounts || []));
    journalEntries.splice(0, journalEntries.length, ...(data.journalEntries || []));
    auditLogs.splice(0, auditLogs.length, ...(data.auditLogs || []));
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
