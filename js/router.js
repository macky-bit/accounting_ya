/* Tab switching (single-page views) */
import { emitChange } from './state.js';

export function switchTab(tabId) {
    const tabs = ['home', 'dashboard', 'suppliers', 'journal', 'ledger', 'trial-balance', 'income-statement', 'balance-sheet', 'audit-trail'];

    tabs.forEach(tab => {
        const viewSection = document.getElementById(`${tab}-view`);
        const navBtn = document.getElementById(`nav-${tab}`);

        if (tab === tabId) {
            viewSection.classList.remove('hidden');
            if (navBtn) {
                navBtn.className = "nav-item nav-active w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors";
            }
        } else {
            viewSection.classList.add('hidden');
            if (navBtn) {
                navBtn.className = "nav-item w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors";
            }
        }
    });

    // Set Title dynamically
    const titleMap = {
        'home': 'Restaurant Home',
        'dashboard': 'Executive Dashboard',
        'suppliers': 'Supplier Contacts',
        'journal': 'General Journal (Book of Original Entry)',
        'ledger': 'General Ledger (T-Accounts)',
        'trial-balance': 'Trial Balance Summary Worksheet',
        'income-statement': 'Income & Expenditure Statement',
        'balance-sheet': 'Statement of Financial Position',
        'audit-trail': 'System Security & Audit Trail'
    };
    document.getElementById('page-title').innerText = titleMap[tabId] || 'Business Ledger';

    document.getElementById('content-area')?.focus({ preventScroll: true });

    // Re-render components upon view switch
    emitChange();
}

// Wire every [data-tab] button (sidebar items + "View Full Journal" link)
export function initNavigation() {
    document.querySelectorAll('[data-tab]').forEach(button => {
        button.addEventListener('click', () => {
            history.replaceState(null, '', `#${button.dataset.tab}`);
            switchTab(button.dataset.tab);
        });
    });

    const requestedTab = window.location.hash.slice(1);
    const availableTabs = ['home', 'dashboard', 'suppliers', 'journal', 'ledger', 'trial-balance', 'income-statement', 'balance-sheet', 'audit-trail'];
    if (requestedTab && availableTabs.includes(requestedTab)) switchTab(requestedTab);
}
