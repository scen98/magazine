<?php
require "position.php";
class PositionBlock{
    public $id;
    public $name;
    public $columnId;
  //  public $columnName;
    public $positions;
    function __construct($id, $name, $columnId){
        $this->id = $id;
        $this->name = $name;
        $this->columnId = $columnId;
       // $this->columnName = $columnName;
        $this->positions = array();
    }

    public static function update($mysqlidb, $position){
        $sql = "UPDATE positions SET articleId = ? WHERE id = ?";
        $stmt = mysqli_stmt_init($mysqlidb->conn);
        if(!mysqli_stmt_prepare($stmt, $sql)){
            return NULL; 
        }
        mysqli_stmt_bind_param($stmt, "ii", $position->articleId, $position->id);
        if(mysqli_stmt_execute($stmt)){
            return true;
        } else {
            return false;
        }        
    }

    public static function selectByColumnId($mysqlidb, $columnId){
        if($columnId == 0){
            return PositionBlock::selectMainColumn($mysqlidb);
        }
        $positionBlock_array = array();
        $sql = "SELECT id, name
        FROM positionBlocks
        WHERE columnId = ?;";
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
            $position = new PositionBlock($row["id"], $row["name"], $columnId);
            array_push($positionBlock_array, $position);
        }
        return $positionBlock_array;    
    }

    public static function selectMainColumn($mysqlidb){
        $positionBlock_array = array();
        $sql = "SELECT id, name
        FROM positionBlocks
        WHERE columnId IS NULL;";
        $stmt = mysqli_stmt_init($mysqlidb->conn);
        if(!mysqli_stmt_prepare($stmt, $sql)){
            return null;
        }     
        if(!mysqli_stmt_execute($stmt)){
            return null;
        }
        $result = mysqli_stmt_get_result($stmt);            
        while($row = mysqli_fetch_assoc($result)){
            $position = new PositionBlock($row["id"], $row["name"], 0);
            array_push($positionBlock_array, $position);
        }
        return $positionBlock_array;
    }
}