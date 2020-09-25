<?php
require "permission.php";
require "tokenpermission.php";
session_start();
class AccessManager{
    public static function isArticleAccessible($article){
        $highestPermission = AccessManager::getMaxLevel();
        if($highestPermission <= 10){
            return AccessManager::normalArticleCheck($article);
        }
        if($highestPermission >= 40){
            return true;
        }    
        if($highestPermission >= 20 && $_SESSION["permissions"][0]->level <40){
            return AccessManager::cmlArticleCheck($article);
        }
        return false;
    }

    public static function isTokenReadable($token){
        $highestPermission = AccessManager::getMaxLevel();
        if($highestPermission >= 40){
            return true;
        }    
        if($highestPermission >= 30){
            return AccessManager::cmlTokenCheck($token);
        }
        if($highestPermission >= 20){
            return AccessManager::cmaTokenCheck($token);
        }
        return false;
    }

    public static function isTokenAccessible($token){
        $highestPermission = AccessManager::getMaxLevel();
        if($highestPermission <= 20){
            return false;
        }
        if($highestPermission >= 40){
            return true;
        }    
        if($highestPermission >= 30 && $_SESSION["permissions"][0]->level <40){
            return AccessManager::cmlTokenCheck($token);
        }
        return false;
    }

    public static function getMaxLevel(){
        $max = 0;
        foreach($_SESSION["permissions"] as $perm){
            if($perm->level > $max){
                $max = $perm->level;
            }
        }
        return $max;
    }

    public static function hasAccessToPosition($position){
        if($_SESSION["permissions"][0]->level >= 40){
            return true;
        } else if(AccessManager::getMaxLevel() >= 30){
           return AccessManager::cmlPositionCheck($position);
        }
        return false;
    }

    static function cmlPositionCheck($position){
        foreach($_SESSION["permissions"] as $perm){
            if($perm->columnId == $position->columnId){
                return true;
            }
        }
        return false;
    }

    static function normalArticleCheck($article){
        if($_SESSION["id"] === $article->authorId){
            return true;
        } else {
            return false;
        }
    }
    
    static function cmlArticleCheck($article){
        if(AccessManager::normalArticleCheck($article)){
            return true;
        }
        foreach($_SESSION["permissions"] as $perm){
            if($perm->columnId === $article->columnId){
                return true;
            }
        }
        return false;
    }

    public static function cmlTokenCheck($token){
        foreach($_SESSION["permissions"] as $perm){
            if($perm->columnId === $token->columnId){
                return true;
            }
        }
        return false;
    }

    public static function cmaTokenCheck($token){
        foreach($_SESSION["tokenPermissions"] as $perm){
            if($perm->tokenId === $token->id){
                return true;
            }
        }
        return false;
    }
}