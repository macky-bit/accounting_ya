import { loadTemplate } from '../loader.js';
import { suppliers } from '../state.js';
import { escapeHtml } from '../utils.js';

export async function mount(parent) {
    parent.insertAdjacentHTML('beforeend', await loadTemplate('suppliers'));
}

export function render() {
    const grid = document.getElementById('supplier-grid');
    const count = document.getElementById('supplier-count');
    if (!grid || !count) return;

    count.textContent = `${suppliers.length} active supplier${suppliers.length === 1 ? '' : 's'}`;
    grid.innerHTML = suppliers.length
        ? suppliers.map((supplier, index) => `
            <article class="supplier-card ${index % 4 === 3 ? 'supplier-card-dark' : ''}">
                <div class="supplier-top">
                    <div class="supplier-icon"><i class="fa-solid fa-truck-field"></i></div>
                    <span class="status-dot">${supplier.isPrimary ? 'Primary' : escapeHtml(supplier.status)}</span>
                </div>
                <span class="supplier-category">${escapeHtml(supplier.category)}</span>
                <h3>${escapeHtml(supplier.name)}</h3>
                ${supplier.description ? `<p>${escapeHtml(supplier.description)}</p>` : ''}
                <div class="supplier-contact">
                    ${supplier.contactPerson ? `<span><i class="fa-solid fa-user"></i>${escapeHtml(supplier.contactPerson)}</span>` : ''}
                    ${supplier.phone ? `<span><i class="fa-solid fa-phone"></i>${escapeHtml(supplier.phone)}</span>` : ''}
                    ${supplier.email ? `<span><i class="fa-solid fa-envelope"></i>${escapeHtml(supplier.email)}</span>` : ''}
                    ${supplier.address ? `<span><i class="fa-solid fa-location-dot"></i>${escapeHtml(supplier.address)}</span>` : ''}
                </div>
            </article>
        `).join('')
        : '<div class="data-empty"><i class="fa-solid fa-truck-field"></i><strong>No suppliers yet</strong><p>Add records to the <code>suppliers</code> table.</p></div>';
}
