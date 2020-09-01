<?php
require "dbi.php";
require "article.php";     
    $tableName = "articles";
    $allArticles = getActiveArticles();
    $main1 = getPosition("main1");
    
    
    function getByPosition($position){
        $result;
        foreach($allArticles as $art){
            if($art->position == $position){
                $result = $art;
                break;
            }
        }
        return $result;
    } 
    
    function getActiveArticles(){    
        $sql = "SELECT id, title, summary, authorId, date, position FROM articles WHERE isActive = 1;";   
        $result = $db->query($sql);
        $article_array = array();
    
        while($row = mysqli_fetch_assoc($result)){
            $art = new Article($row["id"], $row["title"], $row["summary"], $row["authorId"], $row["date"], $row["position"]);
            array_push($article_array, $art);
        }
        return $article_array;
    }
    


?>