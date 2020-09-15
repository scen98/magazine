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
$newArticle = new Article($data->id, $data->title, $data->lead, $_SESSION["id"], date("Y.m.d H:i"), $data->imgPath, $data->columnId, $data->text);
if(AccessManager::isArticleAccessible($data)){
    if(Article::updateArticle($database, $newArticle)){
        RequestUtils::sendSuccess();
    } else {
        RequestUtils::sqlError();
    }
} else {
    RequestUtils::permissionDenied();
}

