<?php 
    require "header.php";
    if(!isset($_SESSION["permissions"][0])){
        header("Location: index.php?error=accessdenied");
        exit();
    }
    ?>
    <script type="module" src="js/authorController.js"></script>
 <div class="container">
    <h1 id="author-name">Név</h1>
    <h2>Jogosultságok: </h2>
    <ul id="permission-list">
        
    </ul>
    <h2 id="token-permission-title">Token jogok:</h2>
    <ul id="token-permission-list">
    </ul>
    <div class="searchBar">
     <input placeholder="Keresés" id="search-input" class="searchInput">
        <select class="columnselect" id="column-select">
          <option value="0">Mind</option>
        </select>
        <select  id="state-select" class="columnselect">
          <option value="-1">Piszkozat</option>
          <option value="0">Készülő</option>
          <option value="1">Ellenőrzés alatt</option>
          <option value="2">Publikálható</option>
          <option value="3">Archív</option>
        </select>
        <button id="search-btn" type="button" class="commandBtn shine" >Mehet!</button>
    </div>
    <div id="article-table">

    </div>
    <div class="centered">
    <button id="expand-btn" class="expandBtn">Mutass még</button>
    </div>
    <div id="article-container">

    </div>
</div>
<?php
    require "footer.php";
    ?>
