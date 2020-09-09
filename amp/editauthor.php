<?php 
    require "header.php";
    if($_SESSION["permissions"][0]->level < 30){
        header("Location: index.php?error=accessdenied".$_SESSEION["permissions"][0]->level);
        exit();
    }
    ?>
    <script type="module" src="js/editauthorController.js"></script>
 <div class="container">
        <h2 id="user-name" class="authorTitle">Név</h2>
        <h3 id="uniq-name" class="authorUniq">Felhasználónév</h3>
        <div id="permission-settings" style="display: none" class="settingBox">
        <h3>Jogosultságok beállításai: </h3> 
        <label>Jogosultság típus megváltoztatása: </label>
        <select id="permission-type" class="columnselect">
            <option value="10">Általános</option>
            <option value="20">Rovat irányító</option>
            <option value="40">Újságvezető</option>
        </select>

        <button type="button" class="commandBtn shine" onclick="changePermission()" >Megváltoztat</button>
        <p class="note" >A jogosultság típus megváltoztatása az összes eddigi jogosultság törlésével jár, beleértve a tokenekhez való jogokat is.</p>
        <div id="add-permission">
        <label>Jogosultság hozzáadása: </label>
        <select id="permission-column-select" class="columnselect">

        </select>
        <select id="column-permission-level" class="columnselect">
            <option value="20">Rovatsegéd</option>
            <option value="30">Rovatvezető</option>
        </select>
        <button onclick="addColumnPermission()" class="plusBtn"><i class="fas fa-plus-square"></i></button>
        </div>
        <div id="permission-table">
        <p>Jelenlegi jogosultságok:</p>
        </div>
        </div>
        <div class="settingBox">
        <h3>Token jogosultságok beállítása: </h3>

        </div>
</div>
<?php
    require "footer.php";
    ?>
