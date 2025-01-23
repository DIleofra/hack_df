<?php
require 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = htmlspecialchars($_POST['title']);
    $description = htmlspecialchars($_POST['description']);

    if (!empty($title) && !empty($description)) {
        $sql = "INSERT INTO tasks (title, description) VALUES (:title, :description)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['title' => $title, 'description' => $description]);
        echo json_encode(['success' => true, 'message' => 'Tâche ajoutée avec succès !']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Tous les champs sont obligatoires.']);
    }
}
?>
