<?php
require "../MSQDB.php";
require "../objects/column.php";
require "../objects/permission.php";
require "requestutils.php";
session_start();
if(!isset($_SESSION["permissions"][0]) || $_SESSION["permissions"][0] <= 10){
    RequestUtils::permissionDenied();
}
$database = new MSQDB;
$columns = Column::getColumns($database);

if($_SESSION["permissions"][0] >= 40 ){
    array_push($columns, new Column(0, "Mind")); // ezt gyűlölöm de ez a legegyszerűbb megoldás
    RequestUtils::returnData("columns", $columns);
}

if($_SESSION["permissions"][0] >= 20 && $_SESSION["permissions"][0] < 40){
    filterColumns();
}
RequestUtils::returnData("columns", $columns);

function filterColumns(){
    array_filter($columns, "isAccessible");
}

function isAccessible($column){
    $result = false;
    foreach($_PERMISSIONS["permissions"] as $perm){
        if($perm->columnId === $column->id){
            $result = true;
            break;
        }
    }
    return $result;
}