<?php
require "objects/tokenpermission.php";
require "objects/permission.php";
session_start();
echo json_encode(["tokenPermissions" => $_SESSION["tokenPermissions"]]);
exit();
