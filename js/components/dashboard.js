/* Executive Dashboard: metric cards + recent activity */
import { loadTemplate } from '../loader.js';import { chartOfAccounts, ingredientUsage, journalEntries } from '../state.js';
import { escapeHtml, formatPHP } from '../utils.js';

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

    const ingredientRanking = document.getElementById('ingredient-ranking');
    const ingredientPeriod = document.getElementById('ingredient-period');
    if (ingredientRanking && ingredientPeriod) {
        ingredientPeriod.textContent = ingredientUsage.length ? `Updated ${ingredientUsage[0].recordedOn}` : 'No usage period';
        ingredientRanking.innerHTML = ingredientUsage.length
            ? ingredientUsage.map((usage, index) => {
                const percentage = Math.max(0, Math.min(100, Number(usage.usagePercentage) || 0));
                return `
                    <div class="ingredient-row">
                        <span class="ingredient-rank">${String(index + 1).padStart(2, '0')}</span>
                        <div><strong>${escapeHtml(usage.ingredientName)}</strong>${usage.details ? `<span>${escapeHtml(usage.details)}</span>` : ''}</div>
                        <div class="usage-track"><i style="width: ${percentage}%"></i></div>
                        <b>${percentage.toLocaleString('en-US', { maximumFractionDigits: 2 })}%</b>
                    </div>
                `;
            }).join('')
            : '<div class="data-empty data-empty-dark"><i class="fa-solid fa-wheat-awn"></i><strong>No ingredient usage yet</strong><p>Add records to the <code>ingredient_usage</code> table.</p></div>';
    }

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
    recentEntries.forEach(e => {
        recentTable.innerHTML += `
            <tr class="hover:bg-slate-50 transition-colors">
                <td class="py-3 px-4 font-medium text-xs text-slate-500">${e.date}</td>
                <td class="py-3 px-4 font-semibold text-slate-800">
                    ${e.debitAcc} <span class="text-slate-400 font-normal">/</span> ${e.creditAcc}
                    <div class="text-[10px] text-slate-400 font-normal italic">${e.explanation}</div>
                </td>
                <td class="py-3 px-4 font-mono text-xs text-slate-500">${e.ref}</td>
                <td class="py-3 px-4 text-right mono font-medium text-emerald-600">${formatPHP(e.debitAmount)}</td>
                <td class="py-3 px-4 text-right mono font-medium text-red-600">${formatPHP(e.creditAmount)}</td>
            </tr>
        `;
    });
}
