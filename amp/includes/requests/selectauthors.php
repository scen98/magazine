<?php
  require "../MSQDB.php";
  require "../objects/author.php";
  require "requestutils.php";
session_start();
if(!isset($_SESSION["id"])){
  RequestUtils::permissionDenied();
}

$database = new MSQDB;
$authors = Author::selectAuthors($database);
if(is_null($authors)){
  RequestUtils::sendSuccess();
}
RequestUtils::returnData("authors", $authors);