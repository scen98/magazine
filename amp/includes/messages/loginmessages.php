<?php
if(isset($_GET["error"])){
    if($_GET["error"] == "wrongd"){
        echo "Helytelen bejelentkezési adatok.";
    } else if($_GET["error"] == "sql"){
        echo "Az oldal adatbázisa nem válaszol.";
    } else if($_GET["error"] == "timeout") {
        echo "";
    } else {
        echo "Az oldal szervere nem válaszol.";
    }
}