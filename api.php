<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

$pdo = new PDO("mysql:host=localhost;dbname=todo_app", "username", "password");

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents("php://input"), true);

switch ($method) {
  case 'GET': // Read all tasks
    $stmt = $pdo->query("SELECT * FROM todos");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    break;

  case 'POST': // Create task
    $text = $input['text'] ?? '';
    if ($text) {
      $stmt = $pdo->prepare("INSERT INTO todos (text) VALUES (?)");
      $stmt->execute([$text]);
      echo json_encode(['id' => $pdo->lastInsertId(), 'text' => $text, 'completed' => false]);
    }
    break;

  case 'PUT': // Update task
    $id = $_GET['id'] ?? null;
    if ($id && isset($input['text']) && isset($input['completed'])) {
      $stmt = $pdo->prepare("UPDATE todos SET text = ?, completed = ? WHERE id = ?");
      $stmt->execute([$input['text'], $input['completed'], $id]);
      echo json_encode(['id' => $id, 'text' => $input['text'], 'completed' => $input['completed']]);
    }
    break;

  case 'DELETE': // Delete task
    $id = $_GET['id'] ?? null;
    if ($id) {
      $stmt = $pdo->prepare("DELETE FROM todos WHERE id = ?");
      $stmt->execute([$id]);
      echo json_encode(['message' => "Task $id deleted"]);
    }
    break;

  default:
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
    break;
}
?>
