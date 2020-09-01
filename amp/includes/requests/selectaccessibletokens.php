<?php
require "../objects/permission.php";
if(!isset($_SESSION["permissions"])){
    http_response_code(403);
    echo json_encode(["msg"=> "No running session."]);
    exit();
}

if($_SESSION["permissions"][0] === "normal"){
    http_response_code(403);
    echo json_encode(["msg"=> "Hozzáférés megtagadva.."]);
    exit();
}

if($_SESSION["permissions"][0] === "admin" || "permissions"][0] === "superadmin"){
    ...
}

if($_SESSION["permissions"][0] === "cml"){
    ...
}


