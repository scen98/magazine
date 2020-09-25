<?php 
    require "header.php";
    ?>
    <script type="module" src="js/myarticlesController.js"></script>
 <div class="container">
    <div class="searchBar">
     <input placeholder="Keresés" id="search" class="searchInput" value="0">
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
    </div>
<div id="delete-modal" class="modal">
  <!-- Modal content -->
  <div class="modal-content">
    <span class="close">&times;</span>
    <p>Biztosan törölni szeretné ezt a cikket?</p>
    <div class="center">
        <button id="delete-btn" type="button">Törlés</button>
        <button  type="button">Mégse</button>
    </div>    
    </div>
  </div>    
</div>
<?php
    require "footer.php";
    ?>