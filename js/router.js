/* Tab switching (single-page views) */
import { emitChange } from './state.js';

export function switchTab(tabId) {
    const tabs = ['dashboard', 'journal', 'ledger', 'trial-balance', 'income-statement', 'balance-sheet', 'audit-trail'];

    tabs.forEach(tab => {
        const viewSection = document.getElementById(`${tab}-view`);
        const navBtn = document.getElementById(`nav-${tab}`);

        if (tab === tabId) {
            viewSection.classList.remove('hidden');
            if (navBtn) {
                navBtn.className = "nav-item w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-white bg-emerald-600/20 text-emerald-400 border border-emerald-500/30";
            }
        } else {
            viewSection.classList.add('hidden');
            if (navBtn) {
                navBtn.className = "nav-item w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-slate-400 hover:bg-slate-800 hover:text-slate-200";
            }
        }
    });

    // Set Title dynamically
    const titleMap = {
        'dashboard': 'Executive Dashboard',
        'journal': 'General Journal (Book of Original Entry)',
        'ledger': 'General Ledger (T-Accounts)',
        'trial-balance': 'Trial Balance Summary Worksheet',
        'income-statement': 'Income & Expenditure Statement',
        'balance-sheet': 'Statement of Financial Position',
        'audit-trail': 'System Security & Audit Trail'
    };
    document.getElementById('page-title').innerText = titleMap[tabId] || 'Business Ledger';

    // Re-render components upon view switch
    emitChange();
}

// Wire every [data-tab] button (sidebar items + "View Full Journal" link)
export function initNavigation() {
    document.querySelectorAll('[data-tab]').forEach(button => {
        button.addEventListener('click', () => switchTab(button.dataset.tab));
    });
}
