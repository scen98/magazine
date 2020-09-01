<?php
require "MSQDB.php";
require "article.php";
require "author.php";
class ArticleManager{
    public $article;
    public $text;
    public $dataBase;
    public $styling = "<style>
    img {
    width: 100%;
    }
    b {
        font-weight: bold;
    }
    </style>";
    function __construct($articleId){
        $this->dataBase = new MSQDB;
        $this->setArticle($articleId);
    }
    
    function setArticle($articleId){    
        $sql = "SELECT id, title, summary, authorId, date, position, imgPath, text FROM articles WHERE id = ?;";        
        $this->fetchArticle($this->getArticleQuery($sql, $articleId));                            
    }

    function getAuthorName($authorId){
        $sql = "SELECT name FROM authors WHERE id = ?;";
        return $this->fetchAuthorName($this->getAuthorNameQuery($sql, $authorId));
    }

    function getArticleQuery($sql, $articleId){ //returns stmt result
        if($stmt = $this->dataBase->db->prepare($sql)){
            $stmt->bind_param("i", $articleId);
            $stmt->execute();
            $result = $stmt->get_result();
            $stmt->close();
            return $result;
        }else {
            $this->sqlError();
        }  
    }    
    function fetchArticle($stmtResult){
        if($row = mysqli_fetch_assoc($stmtResult)){
            $this->article = new Article($row["id"], $row["title"], $row["summary"], $this->getAuthorName($row["authorId"]), $row["date"], $row["position"], $row["imgPath"]);
            $this->article->text = $row["text"].$this->styling;
       } else {
        $this->sqlError();
       }   
    }
    
    function getAuthorNameQuery($sql, $authorId){ //returns stmt result
        if($stmt = $this->dataBase->db->prepare($sql)){
            $stmt->bind_param("i", $authorId);
            $stmt->execute();
            $result = $stmt->get_result();
            $stmt->close();
            return $result;
        }else {
            $this->sqlError();
         }
    }

    function fetchAuthorName($stmtResult){
        if($row = mysqli_fetch_assoc($stmtResult)){
            return $row["name"];         
        } else {
            $this->sqlError();
        } 
    }


    function sqlError(){
        header("Location: ../index.php?error=sqlerror");
        exit();
    }
}