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
            // Prepare the SQL statement to update the status
            $stmt = $pdo->prepare("UPDATE weekend_applications 
                                   SET status = 'MRejected' 
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
            
            if ($result && $stmt->rowCount() > 0) {
                $response['success'] = true;
                $response['message'] = 'Status updated successfully.';
            } else {
                $response['success'] = false;
                $response['error'] = 'No records updated. Either the ID does not exist or status is not "Applied".';
            }
        } else {
            $response['success'] = false;
            $response['error'] = 'ID not provided in request.';
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
