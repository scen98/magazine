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
mysqli_close($database->conn);
header("Location: ../editAuthor.php?aid=".$lastId);
exit();