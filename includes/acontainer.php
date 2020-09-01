<?php
require "MSQDB.php";
require "article.php";
require "author.php";
class AContainer {    
    private $dataBase;
    private $allArticles;
    private $allAuthors;
    
    public function __construct()
    {
        $this->dataBase = new MSQDB;
        $this->allAuthors = $this->getAuthors();
        $this->allArticles = $this->getActiveArticles();        
    }

    public function getByPosition($position){
        $result;
        foreach($this->allArticles as $art){
            if(strpos($art->position, $position) !==false){
                $result = $art;
                break;
            }
        }
        return $result;
    } 

    function generateUrl($article){
        return "standard-post.php?pid=".$article->id;
    }
          
    function getAuthors(){
        $sql = "SELECT id, name FROM authors;";
        if(!$result = $this->dataBase->db->query($sql)){
            $this->sqlError();
        }    
        $author_array = array();

        while($row = mysqli_fetch_assoc($result)){
            $auth = new Author($row["id"], $row["name"]);
            array_push($author_array, $auth);
        }
        $result->free();
        return $author_array;
    }
    
    function getActiveArticles(){    
        $sql = "SELECT id, title, summary, authorId, date, position, imgPath FROM articles WHERE position IS NOT NULL AND position <> '';";   
        if(!$result = $this->dataBase->db->query($sql)){
            $this->sqlError();
        }
        $article_array = array();
    
        while($row = mysqli_fetch_assoc($result)){
            $author = $this->getAuthorById($row["authorId"]);
            $art = new Article($row["id"], $row["title"], $row["summary"], $author->name, $row["date"], $row["position"], $row["imgPath"]);
            array_push($article_array, $art);
        }
        $result->free();
        return $article_array;
    }

    function getAuthorById($searchedId){
        $result;
        foreach($this->allAuthors as $auth){
            if($auth->id == $searchedId){
                $result = $auth;
                break;
            }
        }
        return $result;
    }

    function sqlError(){
        header("Location: ../index.php?error=sqlerror");
        exit();
    }
}

?>