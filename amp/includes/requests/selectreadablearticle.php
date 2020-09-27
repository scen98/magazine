<?php
  require "../MSQDB.php";
  require "../objects/article.php";
  require "requestutils.php";
$data = json_decode(file_get_contents("php://input"));
RequestUtils::checkData($data);
$database = new MSQDB;
$art = Article::getArticle($database, $data->id);
if(is_null($art)){
    RequestUtils::sqlError();
}
if($art->state > 1){
    RequestUtils::returnData("article", $art);
} else {
    RequestUtils::permissionDenied();
}
