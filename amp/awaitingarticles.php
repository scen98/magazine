<?php 
    require "header.php";
    ?>
    <script type="module" src="js/awaitingarticlesController.js"></script>
 <div class="container">
    <div class="searchBar">
     <input placeholder="Keresés" id="search" class="searchInput">
        <select class="columnselect" id="column-select">
        </select>
        <select class="columnselect" id="state-select" value="1">
            <option value="0">Készülő</option>
            <option value="1">Ellenőrzés alatt</option>
            <option value="2">Publikálható</option>  
            <option value="3">Archív</option>  
        </select>
        <button id="search-btn" type="button" onclick="search()" class="commandBtn shine" >Mehet!</button>
    </div>
    <div id="article-table">

    </div>
    <div class="centered">
    <button id="expand-btn" onclick="expand()" class="expandBtn">Mutass még</button>
    </div>
    </div>
<div id="delete-modal" class="modal">
  <!-- Modal content -->
  <div class="modal-content">
    <span onclick="hideDeleteModal()" class="close">&times;</span>
    <p>Biztosan törölni szeretné ezt a cikket?</p>
    <div class="center">
        <button id="delete-btn" type="button">Törlés</button>
        <button onclick="hideDeleteModal()" type="button">Mégse</button>
    </div>    
    </div>
  </div>    
</div>
<?php
    require "footer.php";
    ?>