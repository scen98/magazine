<?php
require "MSQDB.php";
require "objects/author.php";
require "objects/accessmanager.php";

if(!isset($_POST["adduser"])){
    header("Location: ../createuser.php?error=server");
    exit();
}
if(AccessManager::getMaxLevel() < 50){
    header("Location: ../createuser.php?error=accessdenied");
    exit();
}
$database = new MSQDB;
$uniqName = $_POST["uniquename"];
$userName = $_POST["uname"];
$userPassword = $_POST["pwd"];
$userPasswordRepeat = $_POST["pwd-repeat"];
if(Author::doesExist($database, $uniqName) === true){
    header("Location: ../createuser.php?error=nametaken");
    exit();
}
$lastId = Author::createAuthor($database, $uniqName, $userName, $userPassword, $userPasswordRepeat);
if($_POST["permissions"] >= 40 || $_POST["permissions"] <= 10 ){
    Permission::createPermission($database, $_POST["permissions"], $lastId, NULL);
}else {
    $add = true;
    $count = 1;
    while($add){
        if(isset($_POST["perm".$count])){
            Permission::createPermission($database, $_POST["permissions"], $lastId, intval($_POST["perm".$count]));
            $count++;
        } else {
            $add = false;
        }        
    }
}
mysqli_close($database->conn);
header("Location: ../editAuthor.php?aid=".$lastId);