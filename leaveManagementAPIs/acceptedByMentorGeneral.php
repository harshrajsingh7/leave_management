<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require __DIR__ . '/classes/Database.php';
require __DIR__ . '/AuthMiddleware.php';

try {
    // Initialize database connection
    $db_connection = new Database();
    $pdo = $db_connection->getConnection();

    // Get request headers and data
    $allHeaders = getallheaders();
    $post_data = json_decode(file_get_contents("php://input"));

    // Initialize Auth middleware
    $auth = new Auth($pdo, $allHeaders);
    $auth_data = $auth->isValid();

    if ($auth_data['success']) {
        // Check if 'id' is provided in the request
        if (isset($post_data->id)) {
            // Debug log to check incoming ID
            error_log("Received ID: " . $post_data->id);

            // Prepare the SQL statement to update the status
            $stmt = $pdo->prepare("UPDATE general_applications 
                                   SET status = 'MApproved' 
                                   WHERE id = :id AND status = 'Applied'");

            if ($stmt === false) {
                $response['success'] = false;
                $response['error'] = 'Prepare failed: ' . implode(' ', $pdo->errorInfo());
                echo json_encode($response);
                exit;
            }

            // Bind the parameter
            $stmt->bindValue(':id', $post_data->id, PDO::PARAM_INT);

            // Execute the statement
            $result = $stmt->execute();

            // Log query result and affected rows for debugging
            error_log("Query result: " . json_encode($result));
            error_log("Rows affected: " . $stmt->rowCount());

            if ($result && $stmt->rowCount() > 0) {
                $response['success'] = true;
                $response['message'] = 'Status updated successfully.';
            } else {
                // Check if the record exists but does not meet the condition
                $checkStmt = $pdo->prepare("SELECT id, status FROM general_applications WHERE id = :id");
                $checkStmt->bindValue(':id', (int)$post_data->id, PDO::PARAM_INT);
                $checkStmt->execute();
                $record = $checkStmt->fetch(PDO::FETCH_ASSOC);

                if ($record) {
                    $response['success'] = false;
                    $response['error'] = 'Record exists but status is not "Applied". Current status: ' . $record['status'];
                } else {
                    $response['success'] = false;
                    $response['error'] = 'Record not found with the given ID.';
                }
            }
        } else {
            $response['success'] = false;
            $response['error'] = 'ID not provided in the request.';
        }
    } else {
        $response['success'] = false;
        $response['error'] = "Invalid User Token. Access Forbidden.";
    }
} catch (Exception $e) {
    $response['success'] = false;
    $response['error'] = $e->getMessage();
}

// Output the response as JSON
echo json_encode($response);
?>
