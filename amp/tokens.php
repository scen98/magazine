<?php 
    require "header.php";
    if($_SESSION["permissions"][0]->level === "normal"){
        header("Location: index.php?error=accessdenied");
        exit();
    }
    ?>
    <script type="module" src="js/tokensController.js"></script>
 <div class="container">
    <div class="addBar">
        <input id="new-token-name" class="searchInput" placeholder="Token név">
        <select class="columnselect" id="active-select">
            <option value="active">Aktív</option>
            <option value="inactive">Inaktív</option>
            <option value="mandatory">Kötelező</option>
        </select>
        <select class="columnselect" id="column-select">
        </select>
        <button class="commandBtn shine" type="button">Létrehozás</button>
    </div>
    <div class="token-table">
        <div class="tokenContainer">
            <p class="tokenName">Tokennév</p>
            <select class="tokenSelect"><option>Aktív</option></select>
            <select class="tokenSelect"><option>Rovat</option></select>
        </div>
    </div>
</div>
<?php
    require "footer.php";
    ?>