<?php declare(strict_types=1); ?>
<section id="journal-view" class="hidden space-y-6">
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div class="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-200 gap-4">
            <div>
                <h2 class="text-xl font-bold text-slate-900">General Journal</h2>
                <p class="text-xs text-slate-500">Official book of original entry formatted in standard split peso/cent layout</p>
            </div>
            <div class="flex items-center space-x-3">
                <button id="print-journal-button" class="px-3 py-1.5 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-medium flex items-center space-x-1.5">
                    <i class="fa-solid fa-print"></i>
                    <span>Print Journal</span>
                </button>
            </div>
        </div>

        <!-- Standard Two-Column Debit/Credit Classic Accounting Table -->
        <div class="mt-6 overflow-x-auto">
            <table class="w-full text-sm border-collapse border border-slate-300">
                <thead>
                    <tr class="bg-slate-800 text-white uppercase text-xs">
                        <th class="border border-slate-300 py-2.5 px-3 w-28 text-center">Date</th>
                        <th class="border border-slate-300 py-2.5 px-4 text-left">Account Titles & Explanation</th>
                        <th class="border border-slate-300 py-2.5 px-2 w-16 text-center">P.R.</th>
                        <th class="border border-slate-300 py-2.5 px-0 w-36 text-center" colspan="2">Debit (₱)</th>
                        <th class="border border-slate-300 py-2.5 px-0 w-36 text-center" colspan="2">Credit (₱)</th>
                    </tr>
                </thead>
                <tbody id="journal-table-body" class="divide-y divide-slate-200 bg-white">
                    <!-- JS Injected Content with split peso & cents columns -->
                </tbody>
            </table>
        </div>
    </div>
</section>
