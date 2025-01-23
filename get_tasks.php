<?php
require 'db.php';

$limit = intval($_GET['limit'] ?? 5); // Nombre de tâches par page
$page = intval($_GET['page'] ?? 1);  // Page actuelle
$offset = ($page - 1) * $limit;      // Décalage

// Compter le nombre total de tâches
$totalTasksQuery = $pdo->query("SELECT COUNT(*) as total FROM tasks");
$totalTasks = $totalTasksQuery->fetch()['total'];

// Récupérer les tâches paginées
$sql = "SELECT * FROM tasks ORDER BY id DESC LIMIT :limit OFFSET :offset";
$stmt = $pdo->prepare($sql);
$stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
$stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
$stmt->execute();
$tasks = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    'tasks' => $tasks,
    'total' => $totalTasks,
    'page' => $page,
    'pages' => ceil($totalTasks / $limit)
]);
?>
