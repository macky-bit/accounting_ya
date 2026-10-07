<?php

declare(strict_types=1);

header('Cache-Control: no-store');

?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Compañero Rafon Resto Grill & Seafoods - Business Ledger</title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- FontAwesome CDN for visual icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- Brand and interface fonts -->
    <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,600;9..144,700&family=JetBrains+Mono:wght@400;500;600&display=swap"
        rel="stylesheet">

    <link rel="stylesheet" href="css/base.css">
    <link rel="stylesheet" href="css/layout.css">
    <link rel="stylesheet" href="css/components/accounting-table.css">
    <link rel="stylesheet" href="css/design.css">
</head>

<body class="bg-slate-50 text-slate-800 antialiased flex h-screen overflow-hidden">

    <!-- Mount points (display: contents keeps the original flex layout intact) -->
    <div id="sidebar-root" class="contents"></div>

    <div class="flex-1 flex flex-col h-screen overflow-hidden">
        <div id="header-root" class="contents"></div>
        <main class="flex-1 overflow-y-auto p-6 bg-slate-100/60" id="content-area" tabindex="-1">
            <div id="view-loading" class="view-loading" role="status" aria-live="polite">
                <span class="view-loading-mark"><i class="fa-solid fa-utensils"></i></span>
                <div><strong>Preparing your workspace</strong><p>Loading restaurant and accounting components…</p></div>
            </div>
        </main>
    </div>

    <div id="modal-root" class="contents"></div>

    <script type="module">
        import('./js/main.js').catch(error => {
            console.error(error);
            const loading = document.getElementById('view-loading');
            if (!loading) return;
            loading.className = 'view-error';
            loading.innerHTML = `
                <span><i class="fa-solid fa-triangle-exclamation"></i></span>
                <div>
                    <strong>The interface could not start.</strong>
                    <p>${error.message}</p>
                    <button type="button" onclick="window.location.reload()">Reload components</button>
                </div>
            `;
        });
    </script>
</body>

</html>
