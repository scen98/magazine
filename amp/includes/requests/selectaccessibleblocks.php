<?php
    require "../MSQDB.php";
    require "../objects/accessmanager.php";
    require "requestutils.php";
    require "../objects/positionblock.php";
    if(!isset($_SESSION["id"])){
        RequestUtils::permissionDenied();
    }
    $data = json_decode(file_get_contents("php://input"));
    RequestUtils::checkData($data);
    if(!AccessManager::hasAccessToPosition($data)){
        RequestUtils::permissionDenied();
    }
    $database = new MSQDB;
    $positionBlocks = PositionBlock::selectByColumnId($database, $data->columnId);
    if(!is_null($positionBlocks)){
        RequestUtils::returnData("positionBlocks", $positionBlocks);
    } else {
        RequestUtils::sqlError();
    }