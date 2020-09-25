<?php 
    require "header.php";
    ?>
    <script type="module" src="js/awaitingarticlesController.js"></script>
 <div class="container">
    <div class="searchBar">
     <input placeholder="Keresés" id="search" class="searchInput">
        <select class="columnselect" id="column-select" >
        </select>
        <select class="columnselect" id="state-select" value="1">
            <option value="0">Készülő</option>
            <option value="1">Ellenőrzés alatt</option>
            <option value="2">Publikálható</option>  
            <option value="3">Archív</option>  
        </select>
        <label>Nem rendelkezik: </label>
        <select  id="token-select" class="columnselect">
          <option value="0">---</option>
        </select>
        <label for="exclude-locked">Szerkeszthetem</label>
        <input  id="exclude-locked" type="checkbox" class="standardCheckbox" checked>
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