<?php
class TokenInstance{
    public $id;
    public $articleId;
    public $tokenId;
    function __construct($id, $articleId, $tokenId){
        $this->id = $id;
        $this->articleId = $articleId;
        $this->tokenId = $tokenId;
    }

    public static function insertTokenInstance($mysqlidb, $tokenInstance){
        $sql = "INSERT INTO tokenInstances (articleId, tokenId) VALUES (?, ?);";
        $stmt = mysqli_stmt_init($mysqlidb->conn);
        if(!mysqli_stmt_prepare($stmt, $sql)){
            return null;
        }
        mysqli_stmt_bind_param($stmt, "ii", $tokenInstance->articleId, $tokenInstance->tokenId);
        if(!mysqli_stmt_execute($stmt)){
            return null;
        }
        return mysqli_insert_id($mysqlidb->conn);
    }

    public static function selectByArticleId($mysqlidb, $articleId){
        $tokenInstance_array = array();
        $sql = "SELECT * FROM tokenInstances WHERE articleId = ?";
        $stmt = mysqli_stmt_init($mysqlidb->conn);
        if(!mysqli_stmt_prepare($stmt, $sql)){
            return null;
        }
        mysqli_stmt_bind_param($stmt, "i", $articleId);
        if(!mysqli_stmt_execute($stmt)){
            return null;
        }
        $result = mysqli_stmt_get_result($stmt);
        while($row = mysqli_fetch_assoc($result)){
            $newInstance = new TokenInstance($row["id"], $row["articleId"], $row["tokenId"]);
            array_push($tokenInstance_array, $newInstance);
        }
        return $tokenInstance_array;
    }

    public static function deleteTokenInstance($mysqlidb, $id){
        $sql = "DELETE FROM tokenInstance WHERE id = ?";
        $stmt = mysqli_stmt_init($mysqlidb->conn);
        if(!mysqli_stmt_prepare($stmt, $sql)){
            return false;
        }
        mysqli_stmt_bind_param($stmt, "i", $id);
        if(!mysqli_stmt_execute($stmt)){
            return false;
        }
        return true;
    }

    public static function deleteByArticleId($mysqlidb, $articleId){
        $sql = "DELETE FROM tokenInstance WHERE articleId = ?";
        $stmt = mysqli_stmt_init($mysqlidb->conn);
        if(!mysqli_stmt_prepare($stmt, $sql)){
            return false;
        }
        mysqli_stmt_bind_param($stmt, "i", $articleId);
        if(!mysqli_stmt_execute($stmt)){
            return false;
        }
        return true;
    }
}