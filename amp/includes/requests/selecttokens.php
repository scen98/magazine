<?php
require "MSQDB.php";
if(!isset($_SESSION["id"])){
    http_response_code(403);
    echo json_encode(["msg"=> "No running session."]);
    exit();
}
$database = new MSQDB;
