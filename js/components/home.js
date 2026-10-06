import { loadTemplate } from '../loader.js';

export async function mount(parent) {
    parent.insertAdjacentHTML('beforeend', await loadTemplate('home'));
}
