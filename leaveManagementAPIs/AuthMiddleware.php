<?php
require __DIR__ . '/classes/JwtHandler.php';

class Auth extends JwtHandler
{
    protected $db;
    protected $headers;
    protected $token;

    public function __construct($db, $headers)
    {
        parent::__construct();
        $this->db = $db;
        $this->headers = $headers;
    }

    public function isValid()
{
    // Log headers for debugging
    error_log("Headers: " . print_r($this->headers, true));
    
    if (array_key_exists('Authorization', $this->headers) && preg_match('/Bearer\s(\S+)/', $this->headers['Authorization'], $matches)) {
        $data = $this->jwtDecodeData($matches[1]);
        if (
            isset($data['data']->reg_no) &&
            $user = $this->fetchUser($data['data']->reg_no)
        ) :
            return [
                "success" => true,
                "userData" => $user,
            ];
        else :
            return [
                "success" => false,
                "message" => isset($data["message"]) ? $data["message"] : "Invalid token",
            ];
        endif;
    } else {
        return [
            "success" => false,
            "message" => "Token not found in request"
        ];
    }
}


    protected function fetchUser($reg_no)
    {
        try {
            $query = "SELECT reg_no, name, email, privilege FROM users WHERE reg_no = :reg_no";
            $stmt = $this->db->prepare($query);

            if ($stmt === false) {
                error_log("Failed to prepare query: " . $this->db->errorInfo()[2]);
                return null;
            }

            $stmt->bindValue(':reg_no', $reg_no, PDO::PARAM_STR);
            $stmt->execute();

            $userData = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($userData) {
                $user = new stdClass();
                $user->reg_no = $userData['reg_no'];
                $user->name = $userData['name'];
                $user->email = $userData['email'];
                $user->privilege = $userData['privilege'];
                return $user;
            } else {
                error_log("No user found for reg_no: $reg_no");
                return false;
            }
        } catch (PDOException $e) {
            error_log("Database error: " . $e->getMessage());
            return null;
        }
    }
}
?>
