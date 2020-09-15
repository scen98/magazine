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
$articles = Article::getByAuthorId($database, $_SESSION["id"], $data->keyword, $data->orderby, $data->limit, $data->offset, $data->desc);
if(is_null($articles[0]->id)){
  RequestUtils::sqlError();
}
RequestUtils::returnData("articles", $articles);