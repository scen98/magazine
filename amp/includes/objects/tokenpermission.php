<?php
class TokenPermission{
    public $id;
    public $authorId;
    public $tokenId;
    function __construct($id, $authorId, $tokenId){
        $this->id = intval($id);
        $this->level = intval($authorId);
        $this->authorId = intval($tokenId);
    }

public static function selectByAID($mysqlidb, $authorId){
        $permission_array = array();
        $sql = "SELECT * FROM tokenPermissions WHERE authorId = ?;";
        $stmt = mysqli_stmt_init($mysqlidb->conn);
        if(!mysqli_stmt_prepare($stmt, $sql)){
            return null;
        }
        mysqli_stmt_bind_param($stmt, "i", $authorId);
        if(!mysqli_stmt_execute($stmt)){
            return null;
        }
        $result = mysqli_stmt_get_result($stmt);
        while($row = mysqli_fetch_assoc($result)){
            $newp = new TokenPermission($row["id"], $row["authorId"], $row["tokenId"]);
            array_push($permission_array, $newp);
        }
        return $permission_array;
    }

public static function insert($mysqlidb, $perm){
    $sql = "INSERT INTO tokenPermissions (level, authorId) VALUES (?, ?);";
    $stmt = mysqli_stmt_init($mysqlidb->conn);
    if(!mysqli_stmt_prepare($stmt, $sql)){
        return false;
    }
    mysqli_stmt_bind_param($stmt, "ii", $perm->level, $perm->authorId);
    if(!mysqli_stmt_execute($stmt)){
        return false;
    }
    return true;
}

public static function delete($mysqlidb, $id){
    $sql = "DELETE FROM tokenPermissions WHERE id = ?;";
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
}