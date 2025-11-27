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
        $stmt = $pdo->prepare("SELECT 
                ga.id, 
                ga.reg_no, 
                ga.place_of_visit, 
                ga.to_date,
                ga.from_date, 
                ga.purpose_of_visit,
                ga.from_time, 
                ga.to_time, 
                ga.status, 
                s.name 
            FROM 
                general_applications ga 
            LEFT JOIN 
                students s ON ga.reg_no = s.reg_no
            LEFT JOIN 
                mentor_mentees mm ON ga.reg_no = mm.reg_no
            WHERE  
                ga.status = 'Applied' 
                AND ga.purpose_of_visit NOT IN ('Death Cause In Family', 'Urgent Hospital')
                AND mm.mentor_id = :mentor_id");
        
        if ($stmt === false) {
            $response['success'] = false;
            $response['error'] = 'Prepare failed: ' . implode(' ', $pdo->errorInfo());
            echo json_encode($response);
            exit;
        }
        
        // Bind the parameter
        $stmt->bindValue(':mentor_id', $post_data->mentor_id, PDO::PARAM_STR);
        
        // Execute the statement
        $result = $stmt->execute();
        
        if ($result) {
            // Fetch the result
            $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // If no records are found, return an empty array
            if ($data) {
                $response['success'] = true;
                $response['general_applications'] = $data;
            } else {
                $response['success'] = true; // Indicate success
                $response['general_applications'] = []; // Return empty array
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
