<?php
require "objects/author.php";
require "objects/permission.php";
require "MSQDB.php";

if(!isset($_POST["login"])){
    header("Location: ../login.php?error=server");
    exit();
}
$database = new MSQDB;
$userName = $_POST["userName"];
$password = $_POST["password"];
//$userName = "szvirag";
//$password = "főnök1";
$validAuthor = Author::getAuthor($database, $userName);
//echo $validAuthor->password;

if(!password_verify($password, $validAuthor->password)){
    header("Location: ../login.php?error=wrongd");
    exit();
}
session_start();
$_SESSION["id"] = $validAuthor->id;
$_SESSION["userName"] = $validAuthor->userName;
$_SESSION["name"] = $validAuthor->name;
$_SESSION["permissions"] = Permission::getPermissions($database, $validAuthor->id);
header("Location: ../index.php?logged");
exit();

