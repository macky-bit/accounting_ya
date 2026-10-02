<?php declare(strict_types=1); ?>
<section id="dashboard-view" class="space-y-6">
    <!-- Summary Metrics Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <!-- Metric 1: Total Assets -->
        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div class="flex justify-between items-start">
                <div>
                    <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Assets</p>
                    <h3 id="dash-assets" class="text-2xl font-bold text-slate-900 mono mt-2">₱ 0.00</h3>
                </div>
                <div class="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                    <i class="fa-solid fa-vault text-xl"></i>
                </div>
            </div>
            <p class="text-xs text-emerald-600 mt-3 font-medium flex items-center">
                <i class="fa-solid fa-arrow-up text-[10px] mr-1"></i> Balance Verified
            </p>
        </div>

        <!-- Metric 2: Total Liabilities -->
        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div class="flex justify-between items-start">
                <div>
                    <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Liabilities</p>
                    <h3 id="dash-liabilities" class="text-2xl font-bold text-slate-900 mono mt-2">₱ 0.00</h3>
                </div>
                <div class="p-3 bg-red-50 rounded-xl text-red-600">
                    <i class="fa-solid fa-file-invoice-dollar text-xl"></i>
                </div>
            </div>
            <p class="text-xs text-slate-500 mt-3 font-medium">Accounts Payable & Obligations</p>
        </div>

        <!-- Metric 3: Total Equity -->
        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div class="flex justify-between items-start">
                <div>
                    <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">Capital & Equity</p>
                    <h3 id="dash-equity" class="text-2xl font-bold text-slate-900 mono mt-2">₱ 0.00</h3>
                </div>
                <div class="p-3 bg-blue-50 rounded-xl text-blue-600">
                    <i class="fa-solid fa-chart-line text-xl"></i>
                </div>
            </div>
            <p class="text-xs text-slate-500 mt-3 font-medium">Owner's Net Worth</p>
        </div>

        <!-- Metric 4: Net Revenue/Profit -->
        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div class="flex justify-between items-start">
                <div>
                    <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">Net Profit / (Loss)</p>
                    <h3 id="dash-net-income" class="text-2xl font-bold text-slate-900 mono mt-2">₱ 0.00</h3>
                </div>
                <div class="p-3 bg-amber-50 rounded-xl text-amber-600">
                    <i class="fa-solid fa-coins text-xl"></i>
                </div>
            </div>
            <p id="dash-net-income-sub" class="text-xs font-medium mt-3 text-emerald-600">Current Operating Margin</p>
        </div>
    </div>

    <!-- Recent Transactions Panel -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div class="flex justify-between items-center mb-4">
            <div>
                <h2 class="text-lg font-bold text-slate-800">Recent Accounting Activities</h2>
                <p class="text-xs text-slate-500">Latest posted double-entry journal items</p>
            </div>
            <button data-tab="journal" class="text-emerald-600 hover:text-emerald-700 font-semibold text-xs flex items-center">
                View Full Journal <i class="fa-solid fa-chevron-right ml-1 text-[10px]"></i>
            </button>
        </div>
        <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-slate-600">
                <thead class="bg-slate-50 text-slate-700 uppercase text-[11px] font-semibold border-y border-slate-200">
                    <tr>
                        <th class="py-3 px-4">Date</th>
                        <th class="py-3 px-4">Particulars</th>
                        <th class="py-3 px-4">Ref</th>
                        <th class="py-3 px-4 text-right">Debit</th>
                        <th class="py-3 px-4 text-right">Credit</th>
                    </tr>
                </thead>
                <tbody id="dash-recent-table" class="divide-y divide-slate-100">
                    <!-- Populated dynamically by JS -->
                </tbody>
            </table>
        </div>
    </div>
</section>
