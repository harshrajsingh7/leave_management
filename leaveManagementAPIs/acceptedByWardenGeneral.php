<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require __DIR__ . '/classes/Database.php';
require __DIR__ . '/AuthMiddleware.php';  

// Load Composer's autoloader for PHPMailer
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
// use Textlocal\Textlocal;

require 'vendor/autoload.php'; // Ensure you include the path to autoload.php

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
            $stmt = $pdo->prepare("UPDATE general_applications 
                                   SET status = 'WApproved' 
                                   WHERE id = :id ");
            
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
                // Fetch the updated leave details
                $fetch_stmt = $pdo->prepare("SELECT * FROM general_applications WHERE id = :id");
                $fetch_stmt->bindValue(':id', $post_data->id, PDO::PARAM_INT);
                $fetch_stmt->execute();
                $leave_details = $fetch_stmt->fetch(PDO::FETCH_ASSOC);

                if ($leave_details) {
                    // Compose the email
                    $to = "sumitsharma8764@gmail.com";
                    $subject = "Leave Approved for Your Ward";
                    $message = "Dear Parent,\n\nThe leave for your ward has been approved.\n\n";
                    $message .= "Details of the leave are as follows:\n";
                    $message .= "Leave ID: " . $leave_details['id'] . "\n";
                    $message .= "Reg No: " . $leave_details['reg_no'] . "\n";
                    $message .= "From Date: " . $leave_details['from_date'] . "\n";
                    $message .= "To Date: " . $leave_details['to_date'] . "\n";
                    $message .= "Place: " . $leave_details['place_of_visit'] . "\n";
                    $message .= "Reason: " . $leave_details['purpose_of_visit'] . "\n\n";
                    $message .= "Regards,\nVIT AP University Administration";

                    // Initialize PHPMailer and send the email
                    $mail = new PHPMailer(true);

                    try {
                        // SMTP configuration
                        $mail->isSMTP();
                        $mail->Host = 'smtp.gmail.com';  // Specify main and backup SMTP servers
                        $mail->SMTPAuth = true;
                        $mail->Username = 'harshcarpenter06902@gmail.com'; // Your Gmail address
                        $mail->Password = 'hbxw hxbh qjuy dgwi'; // Your Gmail password or app-specific password
                        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; // Enable TLS encryption
                        $mail->Port = 587;

                        // Recipients
                        $mail->setFrom('harshcarpenter06902@gmail.com', 'VIT AP University');
                        $mail->addAddress($to); // Add recipient

                        // Content
                        $mail->isHTML(false); // Set email format to plain text
                        $mail->Subject = $subject;
                        $mail->Body    = $message;

                        // Send the email
                        $mail->send();
                        $response['success'] = true;
                        $response['message'] = 'Status updated successfully and email sent.';
                    } catch (Exception $e) {
                        $response['success'] = true;
                        $response['message'] = 'Status updated, but email could not be sent. Mailer Error: ' . $mail->ErrorInfo;
                    }

                    //SMS

                    // try {
                    //     // After successful email attempt, send SMS
                    //     $apiKey = urlencode('YOUR_TEXTLOCAL_API_KEY');
                    //     $numbers = urlencode('+919521036229'); // Recipient's phone number with country code
                        
                    //     $message = "Dear Parent,\n\nThe leave for your ward has been approved.\n\n";
                    //     $message .= "Details of the leave are as follows:\n";
                    //     $message .= "Leave ID: " . $leave_details['id'] . "\n";
                    //     $message .= "Reg No: " . $leave_details['reg_no'] . "\n";
                    //     $message .= "Date: " . $leave_details['date'] . "\n";
                    //     $message .= "Place: " . $leave_details['place_of_visit'] . "\n";
                    //     $message .= "Reason: " . $leave_details['purpose_of_visit'] . "\n\n";
                    //     $message .= "Regards,\nVIT AP University Administration";
                    
                    //     try {
                    //         $textlocal = new Textlocal(false, false, $apiKey);
                            
                    //         $result = $textlocal->sendSms([$numbers], $message);
                            
                    //         $response['sms_success'] = true;
                    //         $response['sms_message'] = 'SMS sent successfully';
                    //     } catch (Exception $e) {
                    //         $response['sms_success'] = false;
                    //         $response['sms_error'] = 'SMS could not be sent: ' . $e->getMessage();
                    //     }
                    
                    // } catch (Exception $e) {
                    //     $response['success'] = false;
                    //     $response['error'] = $e->getMessage();
                    // }


                } else {
                    $response['success'] = true;
                    $response['message'] = 'Status updated, but leave details could not be fetched.';
                }
            } else {
                $response['success'] = false;
                $response['error'] = 'No records updated. Either the ID does not exist or status is not "MApproved".';
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
