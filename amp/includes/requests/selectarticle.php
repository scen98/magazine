<?php
  require "../MSQDB.php";
  require "../objects/article.php";
  require "../objects/accessmanager.php";
  require "../objects/tokenInstance.php";
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
if($art->state === 1){
    $art->tokenInstances = TokenInstance::selectByArticleId($database, $data->id);
}
if(AccessManager::isArticleAccessible($art)){
    RequestUtils::returnData("article", $art);
} else {
    RequestUtils::permissionDenied();
}