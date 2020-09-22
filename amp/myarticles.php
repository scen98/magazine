<?php 
    require "header.php";
    ?>
    <script type="module" src="js/myarticlesController.js"></script>
 <div class="container">
    <div class="searchBar">
     <input placeholder="Keresés" id="search" class="searchInput">
        <select class="columnselect" id="order-select">
         <option value="date">Dátum</option>
         <option value="title">Cím</option>
        </select>
        <select class="columnselect" id="desc-select">
            <option value="true">Csökkenő</option>
            <option value="false">Növekvő</option>            
        </select>
        <button id="search-btn" type="button" class="commandBtn shine" >Mehet!</button>
    </div>
    <div id="article-table">

    </div>
    <div class="centered">
    <button id="expand-btn" class="expandBtn">Mutass még</button>
    </div>
    </div>       
</div>
<?php
    require "footer.php";
    ?>