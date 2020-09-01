<?php
require "permission.php";
session_start();
class AccessManager{
    public static function isArticleAccessible($article){
        if($_SESSION["permissions"][0]->level === "normal"){
            return AccessManager::normalArticleCheck($article);
        }
        if($_SESSION["permissions"][0]->level === "superadmin" || $_SESSION["permissions"][0]->level === "admin"){
            return true;
        }    
        if($_SESSION["permissions"][0]->level === "cml"){
            return AccessManager::cmlArticleCheck($article);
        }
        return false;
    }

    public static function filterAccessibleTokens($token_array){
        if($_SESSION["permissions"][0]->level === "normal"){
            return null;
        }
        if($_SESSION["permissions"][0]->level === "admin" || $_SESSION["permissions"][0] === "superadmin"){
            return $token_array;
        }
        return returnTokensByColumn($token_array);
    }

    static function returnTokensByColumn($token_array){
        $newArray = array();
        foreach($token_array as $token){
            if(hasAccesToToken($token)){
                array_push($newArray, $token);
            }
        }
        return $newArray;
    }

    public static function hasAccesToToken($token){
        $result = false;
        foreach($_SESSION["permissions"] as $perm){
            if($perm === $token->columnId){
                $result = true;
            }
        }
        return $result;
    }
    
    static function normalArticleCheck($article){
        if($_SESSION["id"] === $article->authorId){
            return true;
        } else {
            return false;
        }
    }
    
    static function cmlArticleCheck($article){
        foreach($_SESSION["permissions"] as $perm){
            if($perm->columnId === $article->columnId){
                return true;
            }
        }
        return false;
    }
}