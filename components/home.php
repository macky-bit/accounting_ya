<?php declare(strict_types=1); ?>
<section id="home-view" class="space-y-8">
    <div class="restaurant-hero">
        <div class="hero-copy">
            <span class="hero-kicker">Resto Grill & Seafoods · Bauang</span>
            <h2>Good food, honest books, <em>one better business.</em></h2>
            <p>Welcome to the central workspace for Compañero Rafon—where menu operations, supplier contacts, and financial records stay connected.</p>
            <div class="hero-actions">
                <button data-tab="dashboard" class="primary-action">Open dashboard <i class="fa-solid fa-arrow-right"></i></button>
                <button data-tab="journal" class="secondary-action">View journal</button>
            </div>
        </div>
        <div class="hero-image-placeholder" aria-label="Restaurant hero image placeholder">
            <div class="placeholder-mark"><i class="fa-regular fa-image"></i><span>kahit anong pic</span><small>Add your photo later</small></div>
            <div class="hero-stamp"><strong>Fresh</strong><span>Grill · Seafood · Local</span></div>
        </div>
    </div>

    <div class="services-section">
        <div class="section-heading">
            <div><span class="eyebrow">Services offered</span><h2>What we bring to the table</h2></div>
            <p>Built around good food, thoughtful service, and the warm welcome our guests remember.</p>
        </div>
        <div id="services-grid" class="service-grid">
            <div class="data-empty"><i class="fa-solid fa-concierge-bell"></i><strong>No services yet</strong><p>Add records to the <code>restaurant_services</code> table.</p></div>
        </div>
    </div>

    <div class="menu-section">
        <div class="section-heading">
            <div><span class="eyebrow">Menu highlights</span><h2>Popular dishes</h2></div>
            <p>Image spaces are ready for the dish photos you will add later.</p>
        </div>
        <div id="menu-items-grid" class="dish-grid">
            <div class="data-empty"><i class="fa-solid fa-bowl-food"></i><strong>No menu items yet</strong><p>Add records to the <code>menu_items</code> table.</p></div>
        </div>
    </div>
</section>
