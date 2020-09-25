<?php
  require "../MSQDB.php";
  require "../objects/article.php";
  require "../objects/accessmanager.php";
  //require "../objects/tokeninstance.php";
  require "requestutils.php";
if(!isset($_SESSION["permissions"])){
    RequestUtils::permissionDenied();
}
$data = json_decode(file_get_contents("php://input"));
RequestUtils::checkData($data);
$database = new MSQDB;
$art = Article::getArticle($database, $data->id);
if(is_null($art)){
    RequestUtils::sqlError();
}
if($art->state > 0){
    $art->tokenInstances = TokenInstance::selectByArticleId($database, $data->id);
}
RequestUtils::returnData("article", $art);
/*
if(AccessManager::isArticleAccessible($art)){
    
} else {
    RequestUtils::permissionDenied();
}*/