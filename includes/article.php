<?php
class Article {
    public $id;
    public $title;
    public $summary;
    public $authorName;
    public $date;
    public $position;
    public $imagePath;
    public $text; 
    function __construct($id, $title, $summary, $authorName, $date, $position, $imagePath){
        $this->id = $id;
        $this->title = $title;
        $this->summary = $summary;
        $this->authorName = $authorName;
        $this->date = $date;
        $this->position = $position;
        $this->imagePath = $imagePath;
    }
}

?>