<?php
class Column {
    public $id;
    public $name;

    function __construct($id, $name){
        $this->id = intval($id);
        $this->name = $name;
    }

    public static function getColumns($mysqlidb){
        $sql = "SELECT id, name FROM columns;";   
        $result = $mysqlidb->conn->query($sql);
        $column_array = array();
    
        while($row = mysqli_fetch_assoc($result)){
            $col = new Column($row["id"], $row["name"]);
            array_push($column_array, $col);
        }
        return $column_array;
    }
}