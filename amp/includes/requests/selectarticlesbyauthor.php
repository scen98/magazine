<?php
  require "../MSQDB.php";
  require "../objects/article.php";
  require "requestutils.php";
session_start();
if(!isset($_SESSION["id"])){
  RequestUtils::permissionDenied();
}

$data = json_decode(file_get_contents("php://input"));
RequestUtils::checkData($data);
$database = new MSQDB;
$articles = Article::selectByAuthorId($database, $data->authorId, $data->keyword, $data->state, $data->columnId, $data->limit, $data->offset);
if(is_null($articles)){
  RequestUtils::sqlError();
}
RequestUtils::returnData("articles", $articles);