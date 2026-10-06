<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function respondOperations(array $payload, int $status = 200): never
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

try {
    if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'GET') {
        header('Allow: GET');
        respondOperations(['error' => 'Method not allowed.'], 405);
    }

    $pdo = Database::connection();

    $services = $pdo->query(
        "SELECT id, title, description, icon_name AS iconName, display_order AS displayOrder
         FROM restaurant_services
         WHERE is_active = TRUE
         ORDER BY display_order, id"
    )->fetchAll();

    $menuItems = $pdo->query(
        "SELECT id, name, category, description, price, image_path AS imagePath, display_order AS displayOrder
         FROM menu_items
         WHERE is_active = TRUE
         ORDER BY display_order, id"
    )->fetchAll();

    $suppliers = $pdo->query(
        "SELECT id, name, category, description, contact_person AS contactPerson,
                phone, email, address, is_primary AS isPrimary, status
         FROM suppliers
         WHERE status = 'ACTIVE'
         ORDER BY is_primary DESC, category, name"
    )->fetchAll();

    $ingredientUsage = $pdo->query(
        "SELECT id, ingredient_name AS ingredientName, details, usage_percentage AS usagePercentage,
                DATE_FORMAT(recorded_on, '%Y-%m-%d') AS recordedOn
         FROM ingredient_usage
         WHERE is_active = TRUE
           AND recorded_on = (SELECT MAX(recorded_on) FROM ingredient_usage WHERE is_active = TRUE)
         ORDER BY usage_percentage DESC, id DESC
         LIMIT 10"
    )->fetchAll();

    foreach ($services as &$service) {
        $service['id'] = (int) $service['id'];
        $service['displayOrder'] = (int) $service['displayOrder'];
    }
    unset($service);

    foreach ($menuItems as &$item) {
        $item['id'] = (int) $item['id'];
        $item['price'] = (float) $item['price'];
        $item['displayOrder'] = (int) $item['displayOrder'];
    }
    unset($item);

    foreach ($suppliers as &$supplier) {
        $supplier['id'] = (int) $supplier['id'];
        $supplier['isPrimary'] = (bool) $supplier['isPrimary'];
    }
    unset($supplier);

    foreach ($ingredientUsage as &$usage) {
        $usage['id'] = (int) $usage['id'];
        $usage['usagePercentage'] = (float) $usage['usagePercentage'];
    }
    unset($usage);

    respondOperations([
        'services' => $services,
        'menuItems' => $menuItems,
        'suppliers' => $suppliers,
        'ingredientUsage' => $ingredientUsage,
    ]);
} catch (PDOException $exception) {
    error_log($exception->getMessage());
    respondOperations(['error' => 'Operational data could not be loaded. Apply the latest database schema.'], 500);
} catch (Throwable $exception) {
    error_log($exception->getMessage());
    respondOperations(['error' => 'An unexpected server error occurred.'], 500);
}
