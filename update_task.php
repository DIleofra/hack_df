<?php
require 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = intval($_POST['id']);
    $completed = intval($_POST['completed']);

    $sql = "UPDATE tasks SET completed = :completed WHERE id = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['completed' => $completed, 'id' => $id]);

    echo json_encode(['success' => true]);
}
?>
