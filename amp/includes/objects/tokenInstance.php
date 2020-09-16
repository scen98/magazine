<?php
class TokenInstance{
    public $id;
    public $articleId;
    public $tokenId;
    public $date;
    public $authorId;
    function __construct($id, $articleId, $tokenId, $date, $authorId){
        $this->id = $id;
        $this->articleId = $articleId;
        $this->tokenId = $tokenId;
        $this->date = $date;
        $this->authorId = $authorId;
    }

    public static function insert($mysqlidb, $tokenInstance){
        $date = date("Y-m-d H:i:s");
        $sql = "INSERT INTO tokenInstances (articleId, tokenId, date, authorId) VALUES (?, ?, ?, ?);";
        $stmt = mysqli_stmt_init($mysqlidb->conn);
        if(!mysqli_stmt_prepare($stmt, $sql)){
            return null;
        }
        mysqli_stmt_bind_param($stmt, "iisi", $tokenInstance->articleId, $tokenInstance->tokenId, $date, $tokenInstance->authorId);
        if(!mysqli_stmt_execute($stmt)){
            return null;
        }
        return mysqli_insert_id($mysqlidb->conn);
    }

    public static function selectByArticleId($mysqlidb, $articleId){
        $tokenInstance_array = array();
        $sql = "SELECT tokenInstances.id, tokenInstances.tokenId, tokenInstances.articleId, tokenInstances.date, authors.name, tokenInstances.authorId
        FROM tokenInstances 
        INNER JOIN authors ON tokenInstances.authorId = authors.id
        WHERE tokenInstances.articleId = ?";
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
            $newInstance = new TokenInstance($row["id"], $row["articleId"], $row["tokenId"], $row["date"], $row["authorId"]);
            $newInstance->authorName = $row["name"];
            array_push($tokenInstance_array, $newInstance);
        }
        return $tokenInstance_array;
    }

    public static function delete($mysqlidb, $id){
        $sql = "DELETE FROM tokenInstances WHERE id = ?";
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
        $sql = "DELETE FROM tokenInstances WHERE articleId = ?";
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