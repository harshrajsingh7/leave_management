<?php

class Database {
    private $host = "localhost";
    private $db_name = "leave_management";
    private $username = "root";
    private $password = "";
    public $conn;

    public function __construct() {
        $this->connect();
    }

    private function connect() {
        try {
            $this->conn = new PDO("mysql:host=$this->host;dbname=$this->db_name", $this->username, $this->password);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            die(json_encode([
                'success' => false,
                'status' => 500,
                'message' => 'Connection failed: ' . $e->getMessage()
            ]));
        }
    }

    public function getConnection() {
        return $this->conn;
    }
}
?>
