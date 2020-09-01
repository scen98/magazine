<?php
require "objects/author.php";
require "objects/permission.php";
require "MSQDB.php";
session_start();
$database = new MSQDB;
$userName = "szvirag";
$validAuthor = Author::getAuthor($database, $userName);

//$_SESSION["permissions"] = Permission::getPermissions($database, $validAuthor->id);
if($_SESSION["permissions"][0]->level !== "superadmin"){
    echo "fail";
}
echo "success";
