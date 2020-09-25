<?php
class TokenPermission{
    public $id;
    public $authorId;
    public $tokenId;
    public $tokenName;
    function __construct($id, $authorId, $tokenId){
        $this->id = intval($id);
        $this->authorId = intval($authorId);
        $this->tokenId = intval($tokenId);
    }

public static function selectByAID($mysqlidb, $authorId){ //MŰKÖDIK
        $permission_array = array();
        $sql = "SELECT tokenPermissions.id, tokenPermissions.authorId, tokenPermissions.tokenId, tokens.name, tokens.columnId FROM tokenPermissions INNER JOIN tokens on tokenPermissions.tokenId = tokens.id WHERE tokenPermissions.authorId = ?;";
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
            $newp->tokenName = $row["name"];
            $newp->columnId = $row["columnId"];
            array_push($permission_array, $newp);
        }
        return $permission_array;
    }

public static function insert($mysqlidb, $perm){ //unchecked
    $sql = "INSERT INTO tokenPermissions (tokenId, authorId) VALUES (?, ?);";
    $stmt = mysqli_stmt_init($mysqlidb->conn);
    if(!mysqli_stmt_prepare($stmt, $sql)){
        return false;
    }
    mysqli_stmt_bind_param($stmt, "ii", $perm->tokenId, $perm->authorId);
    if(!mysqli_stmt_execute($stmt)){
        return false;
    }
    return true;
}

public static function delete($mysqlidb, $id){ //unchecked
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

public static function deleteByAID($mysqlidb, $authorId){
    $sql = "DELETE FROM tokenPermissions WHERE authorId = ?;";
    $stmt = mysqli_stmt_init($mysqlidb->conn);
    if(!mysqli_stmt_prepare($stmt, $sql)){
        return false;
    }
    mysqli_stmt_bind_param($stmt, "i", $authorId);
    if(!mysqli_stmt_execute($stmt)){
        return false;
    }
    return true;
}

public static function DeleteByAIDAndColumnId($mysqlidb, $authorId, $columnId){
    $sql = "DELETE tokenPermissions FROM tokenPermissions
    INNER JOIN tokens ON tokens.id = tokenPermissions.tokenId
    WHERE tokenPermissions.authorId = ? AND tokens.columnId = ?;";
    $stmt = mysqli_stmt_init($mysqlidb->conn);
    if(!mysqli_stmt_prepare($stmt, $sql)){
        return false;
    }
    mysqli_stmt_bind_param($stmt, "ii", $authorId, $columnId);
    if(!mysqli_stmt_execute($stmt)){
        return false;
    }
    return true;
    
}
}