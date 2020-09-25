<?php 
    require "header.php";
    if($_SESSION["permissions"][0]->level < 30){
        header("Location: index.php?error=accessdenied");
        exit();
    }
    ?>
    <script type="module" src="js/tokensController.js"></script>
 <div class="container">
    <div class="addBar">
        <input id="new-token-name" class="searchInput" placeholder="Token név">
        <select class="columnselect" id="active-select">
            <option value="1">Aktív</option>
            <option value="0">Inaktív</option>
            <option value="2">Kötelező</option>
        </select>
        <select class="columnselect" id="column-select">
        </select>
        <button id="insert-token" class="commandBtn shine" type="button">Létrehozás</button>
    </div>
    <div id="token-table">
    </div>
</div>
<?php
    require "footer.php";
    ?>