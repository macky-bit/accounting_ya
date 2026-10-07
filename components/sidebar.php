<?php declare(strict_types=1); ?>
<aside id="sidebar" class="sidebar-expanded bg-slate-900 text-slate-300 flex flex-col transition-all duration-300 ease-in-out z-30 shadow-xl border-r border-slate-800 shrink-0">
    <!-- Logo & Brand Section -->
    <div class="h-16 flex items-center px-4 bg-slate-950 border-b border-slate-800 justify-between">
        <div class="flex items-center space-x-3 overflow-hidden">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-emerald-900/30">
                <i class="fa-solid fa-utensils text-lg"></i>
            </div>
            <div class="logo-text flex flex-col truncate">
                <span class="font-bold text-white text-sm tracking-wide uppercase truncate">Compañero Rafon</span>
                <span class="text-[10px] text-emerald-400 font-medium tracking-wider uppercase truncate">Resto Grill & Seafoods</span>
            </div>
        </div>
    </div>

    <button id="sidebar-close" type="button" aria-label="Close navigation"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>

    <!-- Navigation Links Block -->
    <div class="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        <!-- Overview Group -->
        <div>
            <div class="nav-header text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">Overview</div>
            <nav class="space-y-1">
                <button id="nav-home" aria-current="page" data-tab="home" class="nav-item nav-active w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors">
                    <i class="fa-solid fa-house w-5 text-center text-base"></i>
                    <span class="nav-text truncate">Home</span>
                </button>
                <button id="nav-dashboard" data-tab="dashboard" class="nav-item w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors">
                    <i class="fa-solid fa-chart-pie w-5 text-center text-base"></i>
                    <span class="nav-text truncate">Dashboard</span>
                </button>
            </nav>
        </div>

        <!-- Supplier Contacts Group -->
        <div>
            <div class="nav-header text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">Contacts</div>
            <nav class="space-y-1">
                <button id="nav-suppliers" data-tab="suppliers" class="nav-item w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors">
                    <i class="fa-solid fa-truck-field w-5 text-center text-base"></i>
                    <span class="nav-text truncate">Supplier List</span>
                </button>
            </nav>
        </div>

        <!-- Books of Accounts Group -->
        <div>
            <div class="nav-header text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">Books of Accounts</div>
            <nav class="space-y-1">
                <button id="nav-journal" data-tab="journal" class="nav-item w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors">
                    <i class="fa-solid fa-book w-5 text-center text-base"></i>
                    <span class="nav-text truncate">General Journal</span>
                </button>
                <button id="nav-ledger" data-tab="ledger" class="nav-item w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors">
                    <i class="fa-solid fa-book-open w-5 text-center text-base"></i>
                    <span class="nav-text truncate">General Ledger</span>
                </button>
            </nav>
        </div>

        <!-- Financial Reports Group -->
        <div>
            <div class="nav-header text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">Financial Statements</div>
            <nav class="space-y-1">
                <button id="nav-trial-balance" data-tab="trial-balance" class="nav-item w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors">
                    <i class="fa-solid fa-scale-balanced w-5 text-center text-base"></i>
                    <span class="nav-text truncate">Trial Balance</span>
                </button>
                <button id="nav-income-statement" data-tab="income-statement" class="nav-item w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors">
                    <i class="fa-solid fa-file-invoice-dollar w-5 text-center text-base"></i>
                    <span class="nav-text truncate">Income Statement</span>
                </button>
                <button id="nav-balance-sheet" data-tab="balance-sheet" class="nav-item w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors">
                    <i class="fa-solid fa-building-columns w-5 text-center text-base"></i>
                    <span class="nav-text truncate">Balance Sheet</span>
                </button>
            </nav>
        </div>

        <!-- System Audit Group -->
        <div>
            <div class="nav-header text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2">Security & Logs</div>
            <nav class="space-y-1">
                <button id="nav-audit-trail" data-tab="audit-trail" class="nav-item w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors">
                    <i class="fa-solid fa-list-check w-5 text-center text-base"></i>
                    <span class="nav-text truncate">Audit Trail</span>
                </button>
            </nav>
        </div>
    </div>

    <!-- System User Status Header -->
    <div class="p-4 bg-slate-950 border-t border-slate-800 flex items-center space-x-3">
        <div class="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs text-emerald-400 shrink-0">
            CR
        </div>
        <div class="logo-text truncate">
            <p class="text-xs font-medium text-slate-200 truncate">Senior Accountant</p>
            <p class="text-[10px] text-slate-500 truncate">Bauang, La Union Branch</p>
        </div>
    </div>
</aside>
