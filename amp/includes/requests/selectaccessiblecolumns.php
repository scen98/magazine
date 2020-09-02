<?php
require "../MSQDB.php";
require "../objects/column.php";
require "../objects/permission.php";
session_start();
if(!isset($_SESSION["permissions"][0]) || $_SESSION["permissions"][0] === "normal"){
    http_response_code(403);
    echo json_encode(["msg" => "Hozzáférés megtagadva."]);
    exit;
}
$database = new MSQDB;
$columns = Column::getColumns($database);

if($_SESSION["permissions"][0] === "superadmin" || $_SESSION["permissions"][0] === "admin"){
    array_push($columns, new Column(0, "Mind")); // ezt gyűlölöm de ez a legegyszerűbb megoldás
    http_response_code(200);
    echo json_encode(["columns" => $columns]);
    exit;
}

if($_SESSION["permissions"][0] === "cml"){
    filterColumns();
}

http_response_code(200);
echo json_encode(["columns" => $columns]);
exit();


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