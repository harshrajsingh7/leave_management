<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require __DIR__ . '/classes/Database.php';
require __DIR__ . '/classes/JwtHandler.php';

$database = new Database();
$conn = $database->getConnection();

$postData = json_decode(file_get_contents("php://input"), true);

if (!isset($postData['reg_no']) || !isset($postData['password']) || empty(trim($postData['reg_no'])) || empty(trim($postData['password']))) {
    echo json_encode([
        'success' => false,
        'status' => 422,
        'message' => 'Please fill in all required fields.',
        'fields' => ['reg_no', 'password']
    ]);
    exit();
}

$reg_no = trim($postData['reg_no']);
$password = trim($postData['password']);

if (strlen($password) < 8) {
    echo json_encode([
        'success' => false,
        'status' => 422,
        'message' => 'Your password must be at least 8 characters long!'
    ]);
    exit();
}

$sql = "SELECT reg_no, name, email, privilege, password FROM users WHERE reg_no = :reg_no";
$stmt = $conn->prepare($sql);

if ($stmt === false) {
    $errorInfo = $conn->errorInfo();
    echo json_encode([
        'success' => false,
        'status' => 500,
        'message' => 'Prepare failed: ' . $errorInfo[2]
    ]);
    exit();
}

$stmt->bindValue(':reg_no', $reg_no, PDO::PARAM_STR);
$stmt->execute();
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user) {
    // Check if the entered password matches the stored plaintext password
    if ($password === $user['password']) {
        $jwtHandler = new JwtHandler();
        $token = $jwtHandler->jwtEncodeData(
            $reg_no,
            [
                'reg_no' => $user['reg_no'],
                'name' => $user['name'],
                'email' => $user['email'],
                'privilege' => $user['privilege']
            ]
        );

        echo json_encode([
            'success' => true,
            'status' => 200,
            'message' => 'Login successful',
            'token' => $token,
            'userData' => [
                'reg_no' => $user['reg_no'],
                'Name' => $user['name'],
                'email' => $user['email'],
                'privilege' => $user['privilege'],
            ]
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'status' => 422,
            'message' => 'Invalid password!'
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'status' => 422,
        'message' => 'Invalid reg_no!'
    ]);
}

// Close the statement and connection
$stmt->closeCursor();
