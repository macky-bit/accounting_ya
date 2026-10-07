/* Executive Dashboard: metric cards + recent activity */
import { loadTemplate } from '../loader.js';import { chartOfAccounts, journalEntries } from '../state.js';
import { formatPHP } from '../utils.js';

export async function mount(parent) {
    parent.insertAdjacentHTML('beforeend', await loadTemplate('dashboard'));
}

// 6. Render Executive Dashboard
export function render() {
    let totalAssets = 0;
    let totalLiabilities = 0;
    let totalEquity = 0;
    let totalRevenue = 0;
    let totalExpense = 0;

    chartOfAccounts.forEach(acc => {
        let dr = 0, cr = 0;
        journalEntries.forEach(e => {
            if (e.debitAcc === acc.title) dr += e.debitAmount;
            if (e.creditAcc === acc.title) cr += e.creditAmount;
        });

        if (acc.category === 'Asset') totalAssets += (dr - cr);
        if (acc.category === 'Liability') totalLiabilities += (cr - dr);
        if (acc.category === 'Equity') totalEquity += (cr - dr);
        if (acc.category === 'Revenue') totalRevenue += (cr - dr);
        if (acc.category === 'Expense') totalExpense += (dr - cr);
    });

    const netProfit = totalRevenue - totalExpense;

    document.getElementById('dash-assets').innerText = formatPHP(totalAssets);
    document.getElementById('dash-liabilities').innerText = formatPHP(totalLiabilities);
    document.getElementById('dash-equity').innerText = formatPHP(totalEquity + netProfit);

    const netEl = document.getElementById('dash-net-income');
    netEl.innerText = formatPHP(netProfit);
    if (netProfit < 0) {
        netEl.className = "text-2xl font-bold text-red-600 mono mt-2";
    } else {
        netEl.className = "text-2xl font-bold text-emerald-600 mono mt-2";
    }

    // Populate Recent Transactions Table
    const recentTable = document.getElementById('dash-recent-table');
    recentTable.innerHTML = '';

    const recentEntries = [...journalEntries].reverse().slice(0, 5);
    if (!recentEntries.length) {
        recentTable.innerHTML = '<tr><td colspan="5" class="empty-state">No entries yet. Use Post Entry to record your first transaction.</td></tr>';
    }
    recentEntries.forEach(e => {
        recentTable.innerHTML += `
            <tr class="hover:bg-slate-50 transition-colors">
                <td class="py-3 px-4 font-medium text-xs text-slate-500">${e.date}</td>
                <td class="py-3 px-4 font-semibold text-slate-800">
                    ${e.debitAcc} <span class="text-slate-400 font-normal">/</span> ${e.creditAcc}
                    <div class="text-xs text-slate-600 font-normal italic">${e.explanation}</div>
                </td>
                <td class="py-3 px-4 font-mono text-xs text-slate-500">${e.ref}</td>
                <td class="py-3 px-4 text-right mono font-medium text-emerald-600">${formatPHP(e.debitAmount)}</td>
                <td class="py-3 px-4 text-right mono font-medium text-red-600">${formatPHP(e.creditAmount)}</td>
            </tr>
        `;
    });
}
