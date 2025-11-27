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
        // Prepare the SQL statement
        $stmt = $pdo->prepare("SELECT ga.id, ga.reg_no, ga.place_of_visit, ga.from_date, ga.to_date, ga.purpose_of_visit, ga.status
                               FROM general_applications ga 
                               WHERE ga.reg_no = :reg_no ");
        
        if ($stmt === false) {
            $response['success'] = false;
            $response['error'] = 'Prepare failed: ' . implode(' ', $pdo->errorInfo());
            echo json_encode($response);
            exit;
        }
        
        // Bind the parameter
        $stmt->bindValue(':reg_no', $post_data->reg_no, PDO::PARAM_STR);
        
        // Execute the statement
        $result = $stmt->execute();
        
        if ($result) {
            // Fetch the result
            $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // If no records are found, return an empty array
            if ($data) {
                $response['success'] = true;
                $response['student_applications'] = $data;
            } else {
                $response['success'] = true; // Indicate success
                $response['student_applications'] = []; // Return empty array
            }
        } else {
            $response['success'] = false;
            $response['error'] = 'Failed to execute query: ' . implode(' ', $stmt->errorInfo());
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
