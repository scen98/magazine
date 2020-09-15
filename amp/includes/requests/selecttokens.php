<?php
require "MSQDB.php";
require "requestutils.php";
if(!isset($_SESSION["id"])){
    RequestUtils::permissionDenied();
}
$database = new MSQDB;
