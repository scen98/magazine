<?php
require "../MSQDB.php";
require "../objects/article.php";
require "../objects/accessmanager.php";
require "requestutils.php";
if(!isset($_SESSION["permissions"])){
    RequestUtils::permissionDennied();
}
$data = json_decode(file_get_contents("php://input"));
RequestUtils::checkData($data);
$database = new MSQDB;
if(AccessManager::isArticleAccessible($data)){
    delete($database, $data->id);
} else {
    RequestUtils::permissionDenied();
}

function delete($database, $articleId){
    if(Article::deleteArticle($database, $articleId)){
        RequestUtils::sendSuccess();
    }
}

