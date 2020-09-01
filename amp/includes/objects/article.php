<?php
class Article {
    public $id;
    public $title;
    public $lead;
    public $authorId;
    public $date;
    public $imgPath;
    public $columnId;
    public $text;

    function __construct($id, $title, $lead, $authorId, $date, $imgPath, $columnId, $text){
        $this->id = $id;
        $this->title = $title;
        $this->lead = $lead;
        $this->authorId = $authorId;
        $this->date = $date;
        $this->imgPath = $imgPath;
        $this->columnId = $columnId;
        $this->text = $text;
    }

    public static function insertArticle($mysqlidb, $newArticle){
        $sql = "INSERT INTO articles (title, lead, authorId, date, imgPath, columnId, text) VALUES (?, ?, ?, ?, ?, ?, ?);";
        $stmt = mysqli_stmt_init($mysqlidb->conn);
        if(!mysqli_stmt_prepare($stmt, $sql)){
            return NULL; 
        }
        mysqli_stmt_bind_param($stmt, "ssissis", $newArticle->title, $newArticle->lead, $newArticle->authorId, $newArticle->date, $newArticle->imgPath, $newArticle->columnId, $newArticle->text);
        if(mysqli_stmt_execute($stmt)){
            return mysqli_insert_id($mysqlidb->conn);
        } else {
            return NULL;
        }
    }

    public static function updateArticle($mysqlidb, $newArticle){
        $sql = "UPDATE articles SET title = ?, lead = ?, imgPath = ?, columnId = ?, text = ? WHERE id = ?";
        $stmt = mysqli_stmt_init($mysqlidb->conn);
        if(!mysqli_stmt_prepare($stmt, $sql)){
            return NULL; 
        }
        mysqli_stmt_bind_param($stmt, "sssisi", $newArticle->title, $newArticle->lead, $newArticle->imgPath, $newArticle->columnId, $newArticle->text, $newArticle->id);
        if(mysqli_stmt_execute($stmt)){
            return true;
        } else {
            return false;
        }        
    }

    public static function getArticle($mysqlidb, $articleId){
        $article;
        $sql = "SELECT * FROM articles WHERE id=?;";
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
            $article = new Article($row["id"], $row["title"], $row["lead"], $row["authorId"], $row["date"], $row["imgPath"], $row["columnId"], $row["text"]);
        }
        return $article;
    }

    public static function getByAuthorId($mysqlidb, $authorId, $keyword, $orderby, $limit, $offset, $desc){
        $article_array = array();
        $sql;
        if($desc == "true"){
            $sql = "SELECT id, title, lead, imgPath, date, columnId FROM articles WHERE authorId = ? AND (title LIKE CONCAT('%',?,'%') OR lead LIKE CONCAT('%',?,'%')) ORDER BY {$orderby} DESC LIMIT ? OFFSET ?;";
        } else {
            $sql = "SELECT id, title, lead, imgPath, date, columnId FROM articles WHERE authorId = ? AND (title LIKE CONCAT('%',?,'%') OR lead LIKE CONCAT('%',?,'%')) ORDER BY {$orderby} LIMIT ? OFFSET ?;";
        }
        
        $stmt = mysqli_stmt_init($mysqlidb->conn);
        if(!mysqli_stmt_prepare($stmt, $sql)){
            return null;
        }        
        mysqli_stmt_bind_param($stmt, "issii", $authorId, $keyword, $keyword, $limit, $offset);
        if(!mysqli_stmt_execute($stmt)){
            return null;
        }
        $result = mysqli_stmt_get_result($stmt);            
        while($row = mysqli_fetch_assoc($result)){
            $article = new Article($row["id"], $row["title"], $row["lead"], $authorId, $row["date"], $row["imgPath"], $row["columnId"], "");
            array_push($article_array, $article);
        }
        return $article_array;
    }

    public static function deleteArticle($mysqlidb, $articleId){
        $sql = "DELETE from articles WHERE id = ?";
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