<?php 
    require "header.php";
    ?>
    <script type="module" src="js/authorsController.js"></script>
 <div class="container">
    <div class="searchBar">
     <input placeholder="Keresés" id="search" class="searchInput">
        <label>Jogosultság: </label>
        <select class="columnselect" id="permission-select">
         <option value="null" >Mind</option>
         <option value="10">Általános</option>
         <option value="20">Asszisztens</option>
         <option value="30">Rovatvezető</option>
         <option value="40">Újságvezető</option>
        </select>
        <button id="search-btn" type="button" class="commandBtn shine" >Mehet!</button>
    </div>
    <div id="author-table">

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