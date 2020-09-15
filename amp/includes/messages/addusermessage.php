<?php
if(isset($_GET["add"])){
    echo "A(z) ".$_GET["add"]." nevű felhasználó sikeresen létre lett hozva.";    
}

if(isset($_GET["error"])){
    errorGenerator($_GET["error"]);
}

function errorGenerator($error){
    if($error == "sql"){
        echo "Hiba a kérelem feldolgozásakor: SQL";
    } else if($error == "emptyfields"){
        echo "Szükséges mezők maradtak üresen.";
    } else if($error =="nomatch"){
        echo "A megadott jelszók nem egyeznek meg.";
    } else if($error == "wrongpwd"){
        echo "Helytelen admin jelszó.";
    } else if($error == "nametaken"){
        echo "Ez a felhasználónév már foglalt.";
    } else if($error == "accessdenied"){
        echo "Hozzáférés megtagadva.";
    } else {
        echo "Ismeretlen hiba a kérelem feldolgozásakor.";
    }
}