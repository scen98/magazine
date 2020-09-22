<?php
  require "../MSQDB.php";
  require "../objects/article.php";
  require "../objects/accessmanager.php";
  require "requestutils.php";
if(!isset($_SESSION["permissions"])){
    RequestUtils::permissionDenied();
}
$data = json_decode(file_get_contents("php://input"));
RequestUtils::checkData($data);
$database = new MSQDB;
$article_array = array();
foreach($data->ids as $id){
    $art = Article::selectWithAuthor($database, $id);
    if($art->state > 0){
        $art->tokenInstances = TokenInstance::selectByArticleId($database, $art->id);
    }
    array_push($article_array, $art);
}
RequestUtils::returnData("articles", $article_array);
