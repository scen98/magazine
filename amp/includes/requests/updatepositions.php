<?php
    require "../MSQDB.php";
    require "../objects/accessmanager.php";
    require "requestutils.php";
    require "../objects/position.php";
    if(!isset($_SESSION["id"])){
        RequestUtils::permissionDenied();
    }
    $data = json_decode(file_get_contents("php://input"));
    RequestUtils::checkData($data);
    $database = new MSQDB;
    foreach($data as $position){
        if(AccessManager::hasAccessToPosition($data)){
            Position::update($database, $position);
        }
    }