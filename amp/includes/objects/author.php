<?php
class Author{
    public $id;
    public $userName;
    public $name;
    public $password;
    function __construct($id, $userName, $name, $password){
        $this->id = $id;
        $this->uniqName = $userName;
        $this->userName = $name;
        $this->password = $password;
    }

    public static function createAuthor($mysqlidb, $uniqName, $userName, $userPassword, $userPasswordRepeat, $adminPassword){ //TODO classként mer azé na
        Author::checkFields($userName, $userPassword, $userPasswordRepeat, $adminPassword);
        Author::checkPasswords($userPassword, $userPasswordRepeat);
        $sql = "INSERT INTO authors (userName, name, password) VALUES (?, ?, ?)";
        $stmt = mysqli_stmt_init($mysqlidb->conn);
        if(!mysqli_stmt_prepare($stmt, $sql)){
            header("Location: ../createuser.php?error=sql");
            exit();    
        }
        $hashedPassword = password_hash($userPassword, PASSWORD_DEFAULT);
        mysqli_stmt_bind_param($stmt, "sss", $uniqName, $userName, $hashedPassword);
        if(mysqli_stmt_execute($stmt)){
            return mysqli_insert_id($mysqlidb->conn);
        } else {
            return NULL;
        }
    }

    public static function doesExist($mysqlidb, $uniqName){
        $sql = "SELECT id FROM authors WHERE userName = ?;";
        $stmt = mysqli_stmt_init($mysqlidb->conn);
        if(!mysqli_stmt_prepare($stmt, $sql)){
            header("Location: ../createuser.php?error=sql");
            exit();
        }
        mysqli_stmt_bind_param($stmt, "s", $uniqName);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);
        $id_array = array();
        while($row = mysqli_fetch_assoc($result)){
            array_push($id_array, $row["id"]);
        }
        if(count($id_array) > 0){
            return true;
        } else {
            return false;
        }  
    }

    public static function getAuthor($mysqlidb, $userName){
        $author;
        $sql = "SELECT id, userName, name, password FROM authors WHERE userName = ?;";
        $stmt = mysqli_stmt_init($mysqlidb->conn);
        if(!mysqli_stmt_prepare($stmt, $sql)){
            header("Location: ../index.php?error=sql");
            exit();
        }
        mysqli_stmt_bind_param($stmt, "s", $userName);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);            
        while($row = mysqli_fetch_assoc($result)){
            $author = new Author($row["id"], $row["userName"], $row["name"], $row["password"]);
        }
        return $author;
    }

    static function checkFields($userName, $userPassword, $userPasswordRepeat, $adminPassword){
        if(!isset($userName)){
            header("Location: ../createuser.php?error=emptyfields");
            exit();
        }
        if(!isset($userPassword)){
            header("Location: ../createuser.php?error=emptyfields");
            exit();
        }
    
        if(!isset($userPasswordRepeat)){
            header("Location: ../createuser.php?error=emptyfields");
            exit();
        }
    
        if(!isset($adminPassword)){
            header("Location: ../createuser.php?error=emptyfields");
            exit();
        }
    }

    static function checkPasswords($userPassword, $userPasswordRepeat){
        if($userPassword !== $userPasswordRepeat){
            header("Location: ../createuser.php?error=nomatch");
            exit();
        }
    }
}