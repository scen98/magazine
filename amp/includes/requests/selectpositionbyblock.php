<?php
    require "../MSQDB.php";
    require "requestutils.php";
    require "../objects/position.php";
    session_start();
    if(!isset($_SESSION["id"])){
        RequestUtils::permissionDenied();
    }
    $data = json_decode(file_get_contents("php://input"));
    RequestUtils::checkData($data);
    $database = new MSQDB;
    $positions = Position::selectByBlockId($database, $data->blockId);
    if(!is_null($positions)){
        RequestUtils::returnData("positions", $positions);
    } else {
        RequestUtils::sqlError();
    }