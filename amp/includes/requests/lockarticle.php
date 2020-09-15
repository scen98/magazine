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
$database = new MSQDB;
if(AccessManager::isArticleAccessible($data)){ //blehw
    handleLock($database, $data);
} else {
    RequestUtils::permissionDenied();
}

function handleLock($database, $data){
    $lock = Article::selectLock($database, $data->id);
    $data->lockedBy = $_SESSION["id"];
    if($lock->isLocked === 0){
        lockQuery($database, $data, $lock);
    } else {
        RequestUtils::sendFail();
    }
}
function lockQuery($database, $data, $lock){
    $data->lockedBy = $_SESSION["id"];
    if(Article::lockArticle($database, $data)){
        RequestUtils::sendSuccess();
    } else {
        RequestUtils::sqlError();
    }
}
