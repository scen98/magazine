<?php
class Permission{
    public $id;
    public $level;
    public $authorId;
    public $columnId;
    function __construct($id, $level, $authorId, $columnId){
        $this->id = $id;
        $this->level = intval($level);
        $this->authorId = $authorId;
        $this->columnId = $columnId;
    }
    public static function createPermission($mysqlidb, $level, $authorId, $columnId){
        $sql = "INSERT INTO permissions (level, authorId, columnId) VALUES (?, ?, ?)";
        $stmt = mysqli_stmt_init($mysqlidb->conn);
        if(!mysqli_stmt_prepare($stmt, $sql)){
            header("Location: ../index.php?error=sql");
            exit();
        }
        mysqli_stmt_bind_param($stmt, "sii", $level, $authorId, $columnId);
        mysqli_stmt_execute($stmt);
    }

    public static function getPermissions($mysqlidb, $authorId){
        $sql = "SELECT * FROM permissions WHERE authorId = ?;";
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
}