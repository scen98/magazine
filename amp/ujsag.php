<?php 
    require "header.php";
    ?>
    <script type="module" src="js/positionsController.js"></script>
    <div class="positionPage">
        <select id="column-select" class="columnselect"></select>
        <select id="block-select" class="columnselect"></select>
        <div>
        <div class="searchBar">
                <input id="search-input" type="text" class="searchInput" placeholder="Keresés" >
                <select id="search-select" class="columnselect"></select>
                <button id="search-btn" class="commandBtn shine">Keresés</button>
                <button id="save-btn" class="commandBtn shine">Mentés</button>
            <button id="reset-btn"><i class="fas fa-undo-alt"></i></button>
            </div>
        <div class="positionsLeft">
           
            
            <div id="article-table">
            </div>
        </div>
        <div class="positionsRight">            
            <div id="position-table">
            </div>
        </div>
        </div> 
    </div>
<?php
    require "footer.php";
    ?>