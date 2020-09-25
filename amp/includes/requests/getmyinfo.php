<?php
require "../objects/author.php";
require "../MSQDB.php";
require "requestutils.php";
session_start();
if(!isset($_SESSION["id"])){
    RequestUtils::permissionDenied();
}
$me = new Author($_SESSION["id"], $_SESSION["uniqName"], $_SESSION["userName"], null);
$me->permissions = $_SESSION["permissions"];
$me->tokenPermissions = $_SESSION["tokenPermissions"];
RequestUtils::returnData("author", $me);