<?php
require "objects/article.php";
require "MSQDB.php";
if(!isset($_GET["aid"])){
    header("Location: ../login.php?error=url");
    exit();
}

$database = new MSQDB;
$article = Article::isAccessible($database, $_GET["aid"]);
if(!AccessManager::isArticleAccessible($article)){
    header("Location: ../login.php?error=access");
    exit();
}
function isAccessible($article){
    if($_SESSION["permissions"][0]->level === "normal"){
        return normalCheck($article);
    }
    if($_SESSION["permissions"][0]->level === "superadmin" || $_SESSION["permissions"][0]->level === "admin"){
        return true;
    }    
    if($_SESSION["permissions"][0]->level === "cml"){
        return cmlCheck($article);
    }
    return false;
}

function normalCheck($article){
    if($_SESSION["id"] === $article->authorId){
        return true;
    } else {
        return false;
    }
}

function cmlCheck($article){
    foreach($_SESSION["permissions"] as $perm){
        if($perm->columnId === $article->columnId){
            return true;
        }
    }
    return false;
}
