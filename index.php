<?php

declare(strict_types=1);
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
    <!-- Google Font Inter -->
    <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
        rel="stylesheet">

    <link rel="stylesheet" href="css/base.css">
    <link rel="stylesheet" href="css/layout.css">
    <link rel="stylesheet" href="css/components/accounting-table.css">
</head>

<body class="bg-slate-50 text-slate-800 antialiased flex h-screen overflow-hidden">

    <!-- Mount points (display: contents keeps the original flex layout intact) -->
    <div id="sidebar-root" class="contents"></div>

    <div class="flex-1 flex flex-col h-screen overflow-hidden">
        <div id="header-root" class="contents"></div>
        <main class="flex-1 overflow-y-auto p-6 bg-slate-100/60" id="content-area"></main>
    </div>

    <div id="modal-root" class="contents"></div>

    <script type="module" src="js/main.js"></script>
</body>

</html>
