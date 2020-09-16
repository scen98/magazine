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
$article_array = array();
if($data->columnId == 0){
    $article_array = Article::selectByState($database, $data->keyword, $data->limit, $data->offset, $data->state);
} else {
   $article_array = Article::selectByStateAndColumn($database, $data->keyword, $data->limit, $data->offset, $data->columnId, $data->state);
}
if(is_null($article_array)){
    RequestUtils::sqlerror();
} else {
    RequestUtils::returnData("articles", $article_array);
}