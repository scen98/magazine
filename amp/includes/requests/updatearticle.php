<?php
require "../objects/article.php";
require "../MSQDB.php";
require "../objects/accessmanager.php";
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
if(!isset($data->imgPath)){
    http_response_code(400);
    echo json_encode(["msg"=> "Data is incomplete"]);
    exit();
}
$newArticle = new Article($data->id, $data->title, $data->lead, $_SESSION["id"], date("Y.m.d H:i"), $data->imgPath, $data->columnId, $data->text);
if(AccessManager::isArticleAccessible($data)){
    if(Article::updateArticle($database, $newArticle)){
        http_response_code(201);
        echo json_encode(["msg" => "success"]);
        exit;
    } else {
        http_response_code(400);
        echo json_encode(["msg" => "SQL server hiba."]);
        exit;
    }
} else {
    http_response_code(403);
    echo json_encode(["msg"=> "Hozzáférés megtagadva."]);
    exit();
}

