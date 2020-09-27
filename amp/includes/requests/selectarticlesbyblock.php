<?php
  require "../MSQDB.php";
  require "../objects/article.php";
  require "requestutils.php";
$data = json_decode(file_get_contents("php://input"));
RequestUtils::checkData($data);
$database = new MSQDB;
$article_array = array();
$article_array = Article::selectByBlock($database, $data->blockId);
if(is_null($article_array)){
    RequestUtils::sqlerror();
} else {
    RequestUtils::returnData("articles", $article_array);
}