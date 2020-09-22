<?php
require "tokeninstance.php";
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
        $sql = "INSERT INTO articles (title, lead, authorId, date, imgPath, columnId, text, state) VALUES (?, ?, ?, ?, ?, ?, ?, ?);";
        $stmt = mysqli_stmt_init($mysqlidb->conn);
        if(!mysqli_stmt_prepare($stmt, $sql)){
            return NULL; 
        }
        $state = 0;
        mysqli_stmt_bind_param($stmt, "ssissisi", $newArticle->title, $newArticle->lead, $newArticle->authorId, $newArticle->date, $newArticle->imgPath, $newArticle->columnId, $newArticle->text, $state);
        if(mysqli_stmt_execute($stmt)){
            $newId =  mysqli_insert_id($mysqlidb->conn);
            if(Article::insertLock($mysqlidb, $newId) === true){
                return $newId;
            }
        } else {
            return NULL;
        }
    }

    public static function insertLock($mysqlidb, $articleId){
        $sql = "INSERT INTO locks (isLocked, articleId) VALUES (?, ?);";
        $stmt = mysqli_stmt_init($mysqlidb->conn);
        if(!mysqli_stmt_prepare($stmt, $sql)){
            return false;
        }
        $lock = 0;
        mysqli_stmt_bind_param($stmt, "ii", $lock, $articleId);
        if(mysqli_stmt_execute($stmt)){
            return true;
        } else {
            return false;
        }
    }

    public static function updateArticle($mysqlidb, $newArticle){
        $currentDate = date("Y-m-d H:i:s");
        $sql = "UPDATE articles SET title = ?, lead = ?, date = ?, imgPath = ?, columnId = ?, text = ? WHERE id = ?";
        $stmt = mysqli_stmt_init($mysqlidb->conn);
        if(!mysqli_stmt_prepare($stmt, $sql)){
            return NULL; 
        }
        mysqli_stmt_bind_param($stmt, "ssssisi", $newArticle->title, $newArticle->lead, $currentDate, $newArticle->imgPath, $newArticle->columnId, $newArticle->text, $newArticle->id);
        if(mysqli_stmt_execute($stmt)){
            return true;
        } else {
            return false;
        }        
    }

    public static function updateArticleState($mysqlidb, $newArticle){
        $currentDate = date("Y-m-d H:i:s");
        $sql = "UPDATE articles SET state = ?, date = ? WHERE id = ?";
        $stmt = mysqli_stmt_init($mysqlidb->conn);
        if(!mysqli_stmt_prepare($stmt, $sql)){
            return false; 
        }
        mysqli_stmt_bind_param($stmt, "isi", $newArticle->state, $currentDate, $newArticle->id);
        if(!mysqli_stmt_execute($stmt)){
            return false;
        }
        if($newArticle->state < 1){
            TokenInstance::deleteByArticleId($mysqlidb, $newArticle->id);
        }
        return true;
    }

    public static function getArticle($mysqlidb, $articleId){
        $article;
        $sql = "SELECT articles.id, articles.title, articles.lead, articles.authorId, articles.date, articles.imgPath, articles.columnId, articles.text,
        locks.isLocked, locks.lockedBy, articles.state
        FROM articles 
        INNER JOIN locks ON articles.id = locks.articleId
        WHERE articles.id=?;";
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
            $article->isLocked = $row["isLocked"];
            $article->lockedBy = $row["lockedBy"];
            $article->state = $row["state"];
        }
        return $article;
    }

    public static function selectWithAuthor($mysqlidb, $articleId){
        $article;
        $sql = "SELECT articles.id, articles.title, articles.lead, articles.authorId, articles.date, articles.columnId, articles.state, authors.name
        FROM articles 
        INNER JOIN authors ON articles.authorId = authors.id
        WHERE articles.id=?;";
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
            $article = new Article($row["id"], $row["title"], $row["lead"], $row["authorId"], $row["date"], "", $row["columnId"], "");
            $article->state = $row["state"];
            $article->authorName = $row["name"];
        }
        return $article;
    }

    public static function selectByState($mysqlidb, $keyword, $limit, $offset, $state){
        $article_array = array();
        $sql = "SELECT articles.id, articles.title, articles.lead, articles.authorId, articles.date, articles.columnId, articles.state,
        locks.isLocked, locks.lockedBy, authors.name
        FROM articles
        INNER JOIN locks on articles.id = locks.articleId
        INNER JOIN authors ON articles.authorId = authors.id
        WHERE articles.state = ? AND (articles.title LIKE CONCAT('%',?,'%') OR articles.lead LIKE CONCAT('%',?,'%'))
        ORDER BY articles.date DESC
        LIMIT ? OFFSET ?;";
        $stmt = mysqli_stmt_init($mysqlidb->conn);
        if(!mysqli_stmt_prepare($stmt, $sql)){
            return null;
        }     
        mysqli_stmt_bind_param($stmt, "issii", $state, $keyword, $keyword, $limit, $offset);
        if(!mysqli_stmt_execute($stmt)){
            return null;
        }
        $result = mysqli_stmt_get_result($stmt);            
        while($row = mysqli_fetch_assoc($result)){
            $article = new Article($row["id"], $row["title"], $row["lead"], $row["authorId"], $row["date"], "",  $row["columnId"], "");
            $article->isLocked = $row["isLocked"];
            $article->lockedBy = $row["lockedBy"];
            $article->state = $row["state"];
            $article->authorName = $row["name"];
            if($article->state > 0){
                $article->tokenInstances = TokenInstance::selectByArticleId($mysqlidb, $article->id);
            }
            array_push($article_array, $article);
        }
        return $article_array;       
    }

    public static function selectByStateAndColumn($mysqlidb, $keyword, $limit, $offset, $columnId, $state){
        $article_array = array();
        $sql = "SELECT articles.id, articles.title, articles.lead, articles.authorId, articles.date, articles.columnId, articles.state,
        locks.isLocked, locks.lockedBy, authors.name
        FROM articles
        INNER JOIN locks on articles.id = locks.articleId
        INNER JOIN authors ON articles.authorId = authors.id
        WHERE articles.state = ? AND articles.columnId = ? AND (articles.title LIKE CONCAT('%',?,'%') OR articles.lead LIKE CONCAT('%',?,'%'))
        ORDER BY articles.date
        LIMIT ? OFFSET ?;";
        $stmt = mysqli_stmt_init($mysqlidb->conn);
        if(!mysqli_stmt_prepare($stmt, $sql)){
            return null;
        }     
        mysqli_stmt_bind_param($stmt, "iissii", $state, $columnId, $keyword, $keyword, $limit, $offset);
        if(!mysqli_stmt_execute($stmt)){
            return null;
        }
        $result = mysqli_stmt_get_result($stmt);            
        while($row = mysqli_fetch_assoc($result)){
            $article = new Article($row["id"], $row["title"], $row["lead"], $row["authorId"], $row["date"], "",  $row["columnId"], "");
            $article->isLocked = $row["isLocked"];
            $article->lockedBy = $row["lockedBy"];
            $article->state = $row["state"];
            $article->authorName = $row["name"];
            if($article->state > 0){
                $article->tokenInstances = TokenInstance::selectByArticleId($mysqlidb, $article->id);
            }
            array_push($article_array, $article);
        }
        return $article_array;     
    }

    public static function selectLock($mysqlidb, $articleId){
        $lock = new stdClass();
        $sql = "SELECT * FROM locks WHERE articleId = ?;";
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
            $lock->id = $row["id"];
            $lock->isLocked = $row["isLocked"];
            $lock->lockedBy = $row["lockedBy"];
        }
        return $lock;
    }

    public static function getByAuthorId($mysqlidb, $authorId, $keyword, $orderby, $limit, $offset, $desc){
        $article_array = array();
        $sql;
        if($desc == "true"){
            $sql = "SELECT id, title, lead, imgPath, date, columnId 
            FROM articles 
            WHERE authorId = ? AND (title LIKE CONCAT('%',?,'%') OR lead LIKE CONCAT('%',?,'%')) 
            ORDER BY {$orderby} DESC 
            LIMIT ? OFFSET ?;";
        } else {
            $sql = "SELECT id, title, lead, imgPath, date, columnId FROM articles
            WHERE authorId = ? AND (title LIKE CONCAT('%',?,'%') OR lead LIKE CONCAT('%',?,'%')) 
            ORDER BY {$orderby} 
            LIMIT ? OFFSET ?;";
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

    public static function lockArticle($mysqlidb, $article){
        $sql = "UPDATE locks SET isLocked = ?, lockedBy = ? WHERE articleId = ?";
        $stmt = mysqli_stmt_init($mysqlidb->conn);
        if(!mysqli_stmt_prepare($stmt, $sql)){
            return NULL; 
        }
        mysqli_stmt_bind_param($stmt, "iii", $article->isLocked, $article->lockedBy, $article->id);
        if(mysqli_stmt_execute($stmt)){
            return true;
        } else {
            return false;
        }        
    }
}