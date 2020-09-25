<?php
require "MSQDB.php";
require "objects/author.php";
session_start();
if(!isset($_POST["adduser"])){
    header("Location: ../createuser.php?error=server");
    exit();
}
if($_SESSION["permissions"][0]->level < 50){
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
header("Location: ../editAuthor.php?author=".$uniqName);
exit();