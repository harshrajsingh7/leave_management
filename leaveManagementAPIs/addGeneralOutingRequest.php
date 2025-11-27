<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");

require __DIR__ . '/classes/Database.php';
require __DIR__ . '/AuthMiddleware.php';

$response = [
    'success' => false,
    'data' => null,
    'error' => null,
];

try {
    $db_connection = new Database();
    $allHeaders = getallheaders();
    $post_data = json_decode(file_get_contents("php://input"));
    $pdo = $db_connection->getConnection();
    $auth = new Auth($pdo, $allHeaders);
    $auth_data = $auth->isValid();

    if (!$auth_data['success']) {
        $response['error'] = "Invalid User Token. Access Forbidden.";
        echo json_encode($response);
        exit;
    }

    if (empty($post_data->reg_no) || empty($post_data->placeOfVisit) || empty($post_data->from_date) || empty($post_data->to_date)) {
        $response['error'] = 'Missing required fields.';
        echo json_encode($response);
        exit;
    }

    $stmt = $pdo->prepare("
        INSERT INTO general_applications 
        (reg_no, place_of_visit, from_date, from_time, to_date, to_time, purpose_of_visit, status) 
        VALUES 
        (:reg_no, :place_of_visit, :from_date, :from_time, :to_date, :to_time, :purpose_of_visit, 'Applied')
    ");

    if (!$stmt) {
        error_log("PDO Prepare Error: " . implode(" | ", $pdo->errorInfo()));
        $response['error'] = 'Internal Server Error.';
        echo json_encode($response);
        exit;
    }

    $stmt->bindValue(':reg_no', $post_data->reg_no, PDO::PARAM_STR);
    $stmt->bindValue(':place_of_visit', $post_data->placeOfVisit, PDO::PARAM_STR);
    $stmt->bindValue(':from_date', $post_data->from_date, PDO::PARAM_STR);
    $stmt->bindValue(':from_time', $post_data->from_time, PDO::PARAM_STR);
    $stmt->bindValue(':to_date', $post_data->to_date, PDO::PARAM_STR);
    $stmt->bindValue(':to_time', $post_data->to_time, PDO::PARAM_STR);
    $stmt->bindValue(':purpose_of_visit', $post_data->purposeOfVisit, PDO::PARAM_STR);

    $result = $stmt->execute();

    if ($result) {
        $response['success'] = true;
        $response['data'] = 'Record inserted successfully.';
    } else {
        $response['error'] = 'Failed to insert record.';
        error_log("PDO Execute Error: " . implode(" | ", $stmt->errorInfo()));
    }
} catch (Exception $e) {
    error_log($e->getMessage());
    $response['error'] = 'Internal Server Error.';
}

echo json_encode($response);
