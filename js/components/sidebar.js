/* Collapsible sidebar navigation */
import { loadTemplate } from '../loader.js';

export async function mount(parent) {
    parent.insertAdjacentHTML('beforeend', await loadTemplate('sidebar'));
}

// Toggle Sidebar Expanded / Collapsed States
export function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar.classList.contains('sidebar-expanded')) {
        sidebar.classList.remove('sidebar-expanded');
        sidebar.classList.add('sidebar-collapsed');
    } else {
        sidebar.classList.remove('sidebar-collapsed');
        sidebar.classList.add('sidebar-expanded');
    }
}
export function bindEvents() {
    document.getElementById('sidebar-toggle').addEventListener('click', toggleSidebar);
}
