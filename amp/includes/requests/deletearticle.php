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
    echo json_encode(["msg"=> "Data is incomplete."]);
    exit();
} 
$database = new MSQDB;
if(AccessManager::isArticleAccessible($data)){
    delete($database, $data->id);
} else {
    http_response_code(403);
    echo json_encode(["msg"=> "Hozzáférés megtagadva."]);
    exit();
}

function delete($database, $articleId){
    if(Article::deleteArticle($database, $articleId)){
        echo http_response_code(200);
        echo json_encode(["msg"=> "Cikk törölve."]);
        exit();
    }
}

