<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Include database connection file
require __DIR__ . '/classes/Database.php';

// Create a new Database instance and get the connection
$database = new Database();
$conn = $database->getConnection();

// Get the POST data
$postData = json_decode(file_get_contents("php://input"), true);

