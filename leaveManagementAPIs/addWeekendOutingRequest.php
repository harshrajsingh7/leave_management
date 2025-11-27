<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require __DIR__ . '/classes/Database.php';
require __DIR__ . '/AuthMiddleware.php';

try {
    $db_connection = new Database();
    $allHeaders = getallheaders();
    $post_data = json_decode(file_get_contents("php://input"));
    $pdo = $db_connection->getConnection();
    $auth = new Auth($pdo, $allHeaders);
    $auth_data = $auth->isValid();

    if ($auth_data['success']) {
        // Fetch the mentor_id based on reg_no
        $stmt = $pdo->prepare("SELECT mentor_id FROM `mentor_mentees` WHERE reg_no = :reg_no");
        $stmt->bindValue(':reg_no', $post_data->reg_no, PDO::PARAM_STR);
        $stmt->execute();
        $mentor_result = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($mentor_result) {
            $mentor_id = $mentor_result['mentor_id'];
            
            // Prepare the insertion statement for weekend_applications
            $stmt = $pdo->prepare("INSERT INTO weekend_applications (reg_no, mentor_id, time_slot, place_of_visit, date, purpose_of_visit, status) VALUES (:reg_no, :mentor_id, :time_slot, :place_of_visit, :date, :purpose_of_visit, 'Applied')");
            
            if ($stmt === false) {
                $errorInfo = $pdo->errorInfo();
                $response['success'] = false;
                $response['error'] = 'Prepare failed: ' . $errorInfo[2];
                echo json_encode($response);
                exit;
            }
            
            // Bind parameters using bindValue()
            $stmt->bindValue(':reg_no', $post_data->reg_no, PDO::PARAM_STR);
            $stmt->bindValue(':mentor_id', $mentor_id, PDO::PARAM_STR);
            $stmt->bindValue(':time_slot', $post_data->slots, PDO::PARAM_STR);
            $stmt->bindValue(':place_of_visit', $post_data->placeOfVisit, PDO::PARAM_STR);
            $stmt->bindValue(':date', $post_data->selectedDate, PDO::PARAM_STR);
            $stmt->bindValue(':purpose_of_visit', $post_data->purposeOfVisit, PDO::PARAM_STR);
            
            $result = $stmt->execute();
            
            if ($result) {
                $response['success'] = true;
            } else {
                $response['success'] = false;
                $response['error'] = 'Failed to insert record: ' . $stmt->errorInfo()[2];
            }
        } else {
            $response['success'] = false;
            $response['error'] = 'Mentor not found for the provided reg_no';
        }
    } else {
        $response['success'] = false;
        $response['error'] = "Invalid User Token. Access Forbidden.";
    }
} catch (Exception $e) {
    $response['success'] = false;
    $response['error'] = $e->getMessage();
}

echo json_encode($response);
?>
