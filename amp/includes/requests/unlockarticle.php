<?php
require "../objects/article.php";
require "../MSQDB.php";
require "requestutils.php";
session_start();
$data = json_decode(file_get_contents("php://input"));
RequestUtils::checkData($data);
$database = new MSQDB;
$lock = Article::selectLock($database, $data->id);
if($lock->lockedBy !== $_SESSION["id"]){
    RequestUtils::permissionDenied();
}
if(Article::lockArticle($database, $data)){
    RequestUtils::sendSuccess();
} else {
    RequestUtils::sqlError();
}  