<?php
    require "../MSQDB.php";
    require "../objects/accessmanager.php";
    require "requestutils.php";
    require "../objects/position.php";
    if(!isset($_SESSION["id"])){
        RequestUtils::permissionDenied();
    }
    $data = json_decode(file_get_contents("php://input"));
    RequestUtils::checkData($data->positionBlock);
    if(!AccessManager::hasAccessToPosition($data->positionBlock)){
        RequestUtils::permissionDenied();
    }
    $database = new MSQDB;
    if(updatePositions($data->positionBlock->positions, $database)){
        RequestUtils::sendSuccess();
    } else {
        RequestUtils::sqlError();
    }

    function updatePositions($positions, $database){
        $result = true;
        foreach($positions as $position){
            if(!Position::update($database, $position)){
                $result = false;
            }
        }
        return $result;
    }
    