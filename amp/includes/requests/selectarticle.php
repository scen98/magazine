<?php
  require "../MSQDB.php";
  require "../objects/article.php";
  require "../objects/accessmanager.php";
if(!isset($_SESSION["permissions"])){
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
$art = Article::getArticle($database, $data->id);
if(is_null($art)){
    http_response_code(400);
    echo json_encode(["msg"=> "SQL szerver hiba."]);
    exit();
}
if(AccessManager::isArticleAccessible($art)){
    http_response_code(200);
    echo json_encode(["article" => $art]);
    exit();
} else {
    http_response_code(403);
    echo json_encode(["msg"=> "Hozzáférés megtagadva."]);
    exit();
}