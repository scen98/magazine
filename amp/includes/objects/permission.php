<?php
class Permission{
    public $id;
    public $level;
    public $authorId;
    public $columnId;
    function __construct($id, $level, $authorId, $columnId){
        $this->id = intval($id);
        $this->level = intval($level);
        $this->authorId = intval($authorId);
        $this->columnId = intval($columnId);
    }
    public static function insertPermission($mysqlidb, $newPermission){
        $sql = "INSERT INTO permissions (level, authorId, columnId) VALUES (?, ?, ?)";
        $stmt = mysqli_stmt_init($mysqlidb->conn);
        if(!mysqli_stmt_prepare($stmt, $sql)){
            return null;
        }
        mysqli_stmt_bind_param($stmt, "iii", $newPermission->level, $newPermission->authorId, $newPermission->columnId);
        if(!mysqli_stmt_execute($stmt)){
            return null;
        }
        return mysqli_insert_id($mysqlidb->conn);
    }

    public static function insertGlobalPermission($mysqlidb, $newPermission){
        $sql = "INSERT INTO permissions (level, authorId) VALUES (?, ?)";
        $stmt = mysqli_stmt_init($mysqlidb->conn);
        if(!mysqli_stmt_prepare($stmt, $sql)){
            return null;
        }
        mysqli_stmt_bind_param($stmt, "ii", $newPermission->level, $newPermission->authorId);
        if(!mysqli_stmt_execute($stmt)){
            return null;
        }
        return mysqli_insert_id($mysqlidb->conn);
    }

    public static function selectPermissionsByAID($mysqlidb, $authorId){
        $sql = "SELECT * FROM permissions WHERE authorId = ?;";
        $stmt = mysqli_stmt_init($mysqlidb->conn);
        if(!mysqli_stmt_prepare($stmt, $sql)){
            return null;
        }
        mysqli_stmt_bind_param($stmt, "i", $authorId);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);
        $permission_array = array();
        while($row = mysqli_fetch_assoc($result)){
            $newp = new Permission($row["id"], $row["level"], $row["authorId"], $row["columnId"]);
            array_push($permission_array, $newp);
        }
        return $permission_array;
    }

    public static function selectTokenPermissionsByAID($mysqlidb, $authorId){
        $sql = "SELECT * FROM tokenPermissions WHERE authorId = ?;";
        $stmt = mysqli_stmt_init($mysqlidb->conn);
        if(!mysqli_stmt_prepare($stmt, $sql)){
            header("Location: ../index.php?error=sql");
            exit();     
        }
        mysqli_stmt_bind_param($stmt, "i", $authorId);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);
        $permission_array = array();
        while($row = mysqli_fetch_assoc($result)){
            $newp = new Permission($row["id"], $row["level"], $row["authorId"], $row["columnId"]);
            array_push($permission_array, $newp);
        }
        return $permission_array;
    }

    public static function selectPermissions($mysqlidb){
        $sql = "SELECT * FROM permissions;";
        $stmt = mysqli_stmt_init($mysqlidb->conn);
        if(!mysqli_stmt_prepare($stmt, $sql)){
            return null;   
        }
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);
        $permission_array = array();
        while($row = mysqli_fetch_assoc($result)){
            $newp = new Permission($row["id"], $row["level"], $row["authorId"], $row["columnId"]);
            array_push($permission_array, $newp);
        }
        return $permission_array;
    }

    public static function deleteById($mysqlidb, $id){
        $sql = "DELETE FROM permissions WHERE id = ?;";
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
        $sql = "DELETE FROM permissions WHERE authorId = ?;";
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
}