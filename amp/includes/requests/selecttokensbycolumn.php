<?php
require "../MSQDB.php";
require "requestutils.php";
require "../objects/token.php";
session_start();
if(!isset($_SESSION["id"])){
    RequestUtils::permissionDenied();
}
$data = json_decode(file_get_contents("php://input"));
RequestUtils::checkData($data);
$database = new MSQDB;
$tokenInstance_array = Token::selectByColumnId($database, $data->columnId);
if(is_null($tokenInstance_array)){
    RequestUtils::sqlError();
} else {
    RequestUtils::returnData("tokens", $tokenInstance_array);
}
