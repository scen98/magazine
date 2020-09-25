<?php
require "../objects/author.php";
require "../MSQDB.php";
require "requestutils.php";
session_start();
if(!isset($_SESSION["id"])){
    RequestUtils::permissionDenied();
}
$data = json_decode(file_get_contents("php://input"));
RequestUtils::checkData($data);
$database = new MSQDB;
$author = Author::selectAuthor($database, $data->id);
$author->password = "";
if(!is_null($author)){
    RequestUtils::returnData("author", $author);
} else {
    RequestUtils::sqlError();
}