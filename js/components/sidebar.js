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
    document.getElementById('sidebar-toggle').setAttribute('aria-expanded', sidebar.classList.contains('sidebar-expanded'));
}
export function bindEvents() {
    const sidebar = document.getElementById('sidebar');
    if (window.matchMedia('(max-width: 780px)').matches) {
        sidebar.classList.replace('sidebar-expanded', 'sidebar-collapsed');
    }
    const toggle = document.getElementById('sidebar-toggle');
    toggle.setAttribute('aria-expanded', sidebar.classList.contains('sidebar-expanded'));
    sidebar.querySelectorAll('[data-tab]').forEach(button => {
        const label = button.querySelector('.nav-text').textContent;
        button.setAttribute('aria-label', label);
        button.title = label;
        button.addEventListener('click', () => {
            if (window.matchMedia('(max-width: 560px)').matches && sidebar.classList.contains('sidebar-expanded')) toggleSidebar();
        });
    });
    document.getElementById('sidebar-toggle').addEventListener('click', toggleSidebar);
    document.getElementById('sidebar-close').addEventListener('click', () => {
        toggleSidebar();
        toggle.focus();
    });
}
