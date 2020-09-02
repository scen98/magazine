<?php
class Token{
    public $id;
    public $name;
    public $status;
    public $columnId;
    function __construct($id, $name, $status, $columnId){
        $this->id = $id;
        $this->name = $name;
        $this->status = $status;
        $this->columnId = $columnId;
    }

    public static function insert($mysqlidb, $token){
        $sql = "INSERT INTO tokens (name, status, columnId) VALUES (?, ?, ?);";
        $stmt = mysqli_stmt_init($mysqlidb->conn);
        if(!mysqli_stmt_prepare($stmt, $sql)){
            return null;
        }
        mysqli_stmt_bind_param($stmt, "ssi", $token->name, $token->status, $token->columnId);
        if(mysqli_stmt_execute($stmt)){
            return mysqli_insert_id($mysqlidb->conn);
        } else {
            return null;
        }
    }

    public static function update($mysqlidb, $token){
        $sql = "UPDATE tokens SET name = ?, status = ?, columnId = ? WHERE id = ? ;";
        $stmt = mysqli_stmt_init($mysqlidb->conn);
        if(!mysqli_stmt_prepare($stmt, $sql)){
            return null;
        }
        mysqli_stmt_bind_param($stmt, "ssii", $token->name, $token->status, $token->columnId, $token->id);
        if(mysqli_stmt_execute($stmt)){
            return true;
        } else {
            return false;
        }
    }

    public static function selectTokens($mysqlidb){
        $token_array = array();
        $sql = "SELECT * from tokens;";
        $stmt = mysqli_stmt_init($mysqlidb->conn);
        if(!mysqli_stmt_prepare($stmt, $sql)){
            return null;
        }
        if(!mysqli_stmt_execute($stmt)){
            return null;
        }
        $result = mysqli_stmt_get_result($stmt);
        while($row = mysqli_fetch_assoc($result)){
            $newToken = new Token($row["id"], $row["name"], $row["status"], $row["columnId"]);
            if(!isset($newToken->columnId)){
                $newToken->columnId = 0;
            }
            array_push($token_array, $newToken);
        }
        return $token_array;
    }

    public static function selectTokensByColumn($mysqlidb, $columnId){ //TODO
        $token_array = array();
        $sql = "SELECT * from tokens WHERE columnId = ?;";
        $stmt = mysqli_stmt_init($mysqlidb->conn);
        if(!mysqli_stmt_prepare($stmt, $sql)){
            return null;
        }
        mysqli_stmt_bind_param($stmt, "i", $columnId);
        if(!mysqli_stmt_execute($stmt)){
            return null;
        }
        $result = mysqli_stmt_get_result($stmt);
        while($row = mysqli_fetch_assoc($result)){
            $newToken = new Token($row["id"], $row["name"], $row["status"], $row["columnId"]);
            array_push($token_array, $newToken);
        }
        return $token_array;
    }

    public static function delete($mysqlidb, $id){
        $sql = "DELETE from token WHERE id = ?";
        $stmt = mysqli_stmt_init($mysqlidb->conn);
        if(!mysqli_stmt_prepare($stmt, $sql)){
            return false;
        }
        mysqli_stmt_bind_param($stmt, "i", $articleId);
        if(!mysqli_stmt_execute($stmt)){
            return false;
        } else {
            return true;
        }
    }
}