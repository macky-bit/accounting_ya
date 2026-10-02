<?php declare(strict_types=1); ?>
<div id="post-modal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center hidden p-4">
    <div class="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-100 transform transition-all">
        <!-- Modal Header -->
        <div class="bg-slate-900 px-6 py-4 flex justify-between items-center text-white">
            <div class="flex items-center space-x-2">
                <i class="fa-solid fa-file-circle-plus text-emerald-400"></i>
                <h3 class="font-bold text-base">New Double-Entry Transaction</h3>
            </div>
            <button class="js-close-modal text-slate-400 hover:text-white transition-colors">
                <i class="fa-solid fa-xmark text-lg"></i>
            </button>
        </div>

        <!-- Modal Form Body -->
        <form id="entry-form" class="p-6 space-y-4">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-1">Transaction Date</label>
                    <input type="date" id="entry-date" required class="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                </div>
                <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-1">PR Reference Code</label>
                    <input type="text" id="entry-ref" placeholder="e.g. GJ-105" required class="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                </div>
            </div>

            <!-- Debit Entry -->
            <div class="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-3">
                <span class="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center">
                    <i class="fa-solid fa-arrow-down-left mr-1"></i> Debit Account Line
                </span>
                <div class="grid grid-cols-3 gap-3">
                    <div class="col-span-2">
                        <select id="entry-debit-account" required class="w-full text-xs p-2 border border-slate-300 rounded-lg focus:ring-emerald-500">
                            <!-- Options dynamically rendered -->
                        </select>
                    </div>
                    <div>
                        <input type="number" step="0.01" id="entry-debit-amount" placeholder="Amount (₱)" required class="w-full text-xs p-2 border border-slate-300 rounded-lg mono focus:ring-emerald-500">
                    </div>
                </div>
            </div>

            <!-- Credit Entry -->
            <div class="p-3 bg-red-50/50 rounded-xl border border-red-100 space-y-3">
                <span class="text-xs font-bold text-red-800 uppercase tracking-wider flex items-center">
                    <i class="fa-solid fa-arrow-up-right mr-1"></i> Credit Account Line
                </span>
                <div class="grid grid-cols-3 gap-3">
                    <div class="col-span-2">
                        <select id="entry-credit-account" required class="w-full text-xs p-2 border border-slate-300 rounded-lg focus:ring-red-500">
                            <!-- Options dynamically rendered -->
                        </select>
                    </div>
                    <div>
                        <input type="number" step="0.01" id="entry-credit-amount" placeholder="Amount (₱)" required class="w-full text-xs p-2 border border-slate-300 rounded-lg mono focus:ring-red-500">
                    </div>
                </div>
            </div>

            <!-- Explanation -->
            <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Transaction Particulars / Explanation</label>
                <input type="text" id="entry-explanation" placeholder="To record daily seafood purchases, sales, etc." required class="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none">
            </div>

            <!-- Action Buttons -->
            <div class="pt-4 flex justify-end space-x-3 border-t border-slate-100">
                <button type="button" class="js-close-modal px-4 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50">
                    Cancel
                </button>
                <button type="submit" class="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-md shadow-emerald-600/20">
                    Post Entry to Ledger
                </button>
            </div>
        </form>
    </div>
</div>
