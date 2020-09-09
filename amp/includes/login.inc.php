<?php
require "objects/author.php";
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
//$validAuthor = Author::getAuthor($database, $userName);
$validAuthor = Author::selectAuthorByUserName($database, $userName);
//echo $validAuthor->password;

if(!password_verify($password, $validAuthor->password)){
    header("Location: ../login.php?error=wrongd");
    exit();
}
session_start();
$_SESSION["id"] = $validAuthor->id;
$_SESSION["userName"] = $validAuthor->userName;
$_SESSION["uniqName"] = $validAuthor->uniqName;
//$_SESSION["permissions"] = Permission::selectPermissionsByAID($database, $validAuthor->id);
$_SESSION["permissions"] = $validAuthor->permissions;
$_SESSION["tokenPermissions"] = $valudAuthor->tokenPermissions;
header("Location: ../index.php?logged");
exit();

