<?php
class MSQDB {
    private $servername = "sql307.main-hosting.eu";
    private $dBUserName = "u723655288_Scen";
    private $dBPassword = "NewPassword1";
    private $dBName = "u723655288_sites";

    public $conn; 

    public function __construct()
    {
        $this->conn = new mysqli($this->servername, $this->dBUserName, $this->dBPassword, $this->dBName);
        if ($this->conn -> connect_errno) {
            echo "Failed to connect to MySQL: " . $mysqli -> connect_error;
            exit();
          }
    }
}