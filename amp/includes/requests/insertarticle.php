<?php
require "../objects/article.php";
require "../MSQDB.php";
session_start();
if(!isset($_SESSION["id"])){
    http_response_code(403);
    echo json_encode(["msg"=> "No running session."]);
    exit();
}

$data = json_decode(file_get_contents("php://input"));
if(empty($data)){
    http_response_code(400);
    echo json_encode(["msg"=> "Data is incomplete"]);
    exit();
}
$database = new MSQDB;
$newArticle = new Article(0, $data->title, $data->lead, $_SESSION["id"], date("Y-m-d H:i:s"), $data->imgPath, $data->columnId, $data->text);
$newArticleId = Article::insertArticle($database, $newArticle);
if(is_null($newArticleId)){
    http_response_code(400);
    echo json_encode(['msg'=>"sql error"]);
	exit;
} else {
    http_response_code(201);
    echo json_encode(["newId" => $newArticleId]);
	exit;
}

