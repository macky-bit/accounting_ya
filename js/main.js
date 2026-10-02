/* Entry point: mounts every component, wires events, first render */
import { loadState, onChange } from './state.js';
import { initNavigation } from './router.js';

import * as sidebar from './components/sidebar.js';
import * as header from './components/header.js';
import * as dashboard from './components/dashboard.js';
import * as journal from './components/journal.js';
import * as ledger from './components/ledger.js';
import * as trialBalance from './components/trialBalance.js';
import * as incomeStatement from './components/incomeStatement.js';
import * as balanceSheet from './components/balanceSheet.js';
import * as auditTrail from './components/auditTrail.js';
import * as postModal from './components/postModal.js';

// Refresh all accounting views & data dependencies
function refreshAllViews() {
    journal.render();
    ledger.render();
    trialBalance.render();
    incomeStatement.render();
    balanceSheet.render();
    dashboard.render();
    auditTrail.render();
}

// 1) Mount markup: each component fetches its own components/*.php view.
//    Views are awaited in order so the DOM structure is deterministic.
async function init() {
    await sidebar.mount(document.getElementById('sidebar-root'));
    await header.mount(document.getElementById('header-root'));
    const content = document.getElementById('content-area');
    for (const view of [dashboard, journal, ledger, trialBalance, incomeStatement, balanceSheet, auditTrail]) {
        await view.mount(content);
    }
    await postModal.mount(document.getElementById('modal-root'));

    // Load all accounting records from MySQL through the PHP API.
    try {
        await loadState();
    } catch (error) {
        console.error(error);
        alert(`Could not load the accounting database: ${error.message}`);
    }

    // 2) Wire events
    initNavigation();
    sidebar.bindEvents();
    header.bindEvents({ onNewEntry: postModal.openModal });
    journal.bindEvents();
    ledger.bindEvents();
    postModal.bindEvents();

    // 3) Re-render whenever state changes (new posting, tab switch)
    onChange(refreshAllViews);

    // 4) First paint
    ledger.populateFilter();
    postModal.populateOptions();
    refreshAllViews();
}

init();
