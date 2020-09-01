<?php
require "objects/permission.php";
session_start();
echo json_encode(["permissions" => $_SESSION["permissions"]]);