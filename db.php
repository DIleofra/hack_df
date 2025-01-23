<?php
$host = 'localhost'; // Hôte
$dbname = 'task_manager'; // Nom de la base de données
$username = 'root'; // Nom d'utilisateur (par défaut : root pour XAMPP/WAMP)
$password = ''; // Mot de passe (vide par défaut pour XAMPP)

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Erreur de connexion : " . $e->getMessage());
}
?>
