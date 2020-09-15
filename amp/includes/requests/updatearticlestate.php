<?php
require "../objects/article.php";
require "../MSQDB.php";
require "../objects/accessmanager.php";
require "requestutils.php";
if(!isset($_SESSION["id"])){
    RequestUtils::permissionDenied();
}

$data = json_decode(file_get_contents("php://input"));
RequestUtils::checkData($data);
$data->authorId = $_SESSION["id"];
$database = new MSQDB;
if(AccessManager::isArticleAccessible($data)){
    if(Article::updateArticleState($database, $data)){
        RequestUtils::sendSuccess();
    } else {
        RequestUtils::sqlError();
    }
} else {
    RequestUtils::permissionDenied();
}
