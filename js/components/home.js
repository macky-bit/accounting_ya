import { loadTemplate } from '../loader.js';
import { menuItems, restaurantServices } from '../state.js';
import { escapeHtml, formatPHP } from '../utils.js';

export async function mount(parent) {
    parent.insertAdjacentHTML('beforeend', await loadTemplate('home'));
}

const serviceIcons = ['fa-fire-burner', 'fa-fish-fins', 'fa-champagne-glasses', 'fa-utensils'];
const dishAccents = ['', 'accent-red', 'accent-green', 'accent-dark'];

function safeImagePath(value) {
    const path = String(value || '').trim();
    return /^(https?:\/\/|\/|\.\/|img\/|uploads\/)[^\s]+$/i.test(path) ? path : '';
}

export function render() {
    const servicesGrid = document.getElementById('services-grid');
    const menuGrid = document.getElementById('menu-items-grid');
    if (!servicesGrid || !menuGrid) return;

    servicesGrid.innerHTML = restaurantServices.length
        ? restaurantServices.map((service, index) => {
            const requestedIcon = String(service.iconName || '');
            const icon = /^fa-[a-z0-9-]+$/.test(requestedIcon) ? requestedIcon : serviceIcons[index % serviceIcons.length];
            return `
                <article class="service-card">
                    <span>${String(index + 1).padStart(2, '0')}</span>
                    <i class="fa-solid ${icon}"></i>
                    <h3>${escapeHtml(service.title)}</h3>
                    ${service.description ? `<p>${escapeHtml(service.description)}</p>` : ''}
                </article>
            `;
        }).join('')
        : '<div class="data-empty"><i class="fa-solid fa-concierge-bell"></i><strong>No services yet</strong><p>Add records to the <code>restaurant_services</code> table.</p></div>';

    menuGrid.innerHTML = menuItems.length
        ? menuItems.map((item, index) => {
            const imagePath = safeImagePath(item.imagePath);
            return `
            <article class="dish-card">
                <div class="dish-image ${dishAccents[index % dishAccents.length]}">
                    ${imagePath
                        ? `<img src="${escapeHtml(imagePath)}" alt="${escapeHtml(item.name)}" loading="lazy">`
                        : '<i class="fa-regular fa-image"></i><span>No image</span>'}
                </div>
                <div class="dish-info">
                    <div><span>${escapeHtml(item.category)}</span><h3>${escapeHtml(item.name)}</h3></div>
                    <strong>${formatPHP(item.price)}</strong>
                </div>
            </article>
        `;
        }).join('')
        : '<div class="data-empty"><i class="fa-solid fa-bowl-food"></i><strong>No menu items yet</strong><p>Add records to the <code>menu_items</code> table.</p></div>';
}
