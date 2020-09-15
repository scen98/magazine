<?php
require "../objects/article.php";
require "../MSQDB.php";
require "requestutils.php";
session_start();
if(!isset($_SESSION["id"])){
    RequestUtils::permissionDenied();
}

$data = json_decode(file_get_contents("php://input"));
RequestUtils::checkData($data);
$database = new MSQDB;
$newArticle = new Article(0, $data->title, $data->lead, $_SESSION["id"], date("Y-m-d H:i:s"), $data->imgPath, $data->columnId, $data->text);
$newArticleId = Article::insertArticle($database, $newArticle);
RequestUtils::returnInsert($newArticleId);

