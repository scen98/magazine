<?php
class Position{
    function __construct($id, $htmlId, $name, $articleId, $blockId){
        $this->id = $id;
        $this->htmlId = $htmlId;
        $this->name = $name;
        $this->articleId = $articleId;
        $this->blockId = $blockId;
    }
    public static function update($mysqlidb, $position){
        if($position->articleId === 0 || is_null($position->articleId)){
            return Position::emptyPosition($mysqlidb, $position);
        }
        $sql = "UPDATE positions SET articleId = ? WHERE id = ?";
        $stmt = mysqli_stmt_init($mysqlidb->conn);
        if(!mysqli_stmt_prepare($stmt, $sql)){
            return false; 
        }
        mysqli_stmt_bind_param($stmt, "ii", $position->articleId, $position->id);
        if(mysqli_stmt_execute($stmt)){
            return true;
        } else {
            return false;
        }        
    }

    public static function emptyPosition($mysqlidb, $position){
        $sql = "UPDATE positions SET articleId = NULL WHERE id = ?";
        $stmt = mysqli_stmt_init($mysqlidb->conn);
        if(!mysqli_stmt_prepare($stmt, $sql)){
            return false; 
        }
        mysqli_stmt_bind_param($stmt, "i", $position->id);
        if(mysqli_stmt_execute($stmt)){
            return true;
        } else {
            return false;
        } 
    }

    public static function selectByBlockId($mysqlidb, $blockId){
        $position_array = array();
        $sql = "SELECT id, name, articleId
        FROM positions
        WHERE blockId = ?
        ORDER BY listOrder;";
        $stmt = mysqli_stmt_init($mysqlidb->conn);
        if(!mysqli_stmt_prepare($stmt, $sql)){
            return null;
        }     
        mysqli_stmt_bind_param($stmt, "i", $blockId);
        if(!mysqli_stmt_execute($stmt)){
            return null;
        }
        $result = mysqli_stmt_get_result($stmt);            
        while($row = mysqli_fetch_assoc($result)){
            $position = new Position($row["id"], null, $row["name"], $row["articleId"], $blockId);
            array_push($position_array, $position);
        }
        return $position_array;    
    }
}