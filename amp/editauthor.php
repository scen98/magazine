<?php 
    require "header.php";
    if($_SESSION["permissions"][0]->level < 30){
        header("Location: index.php?error=accessdenied".$_SESSEION["permissions"][0]->level);
        exit();
    }
    ?>
 <div class="container">
        <h2>Név</h2>
        <h3>Felhasználónév</h3>
        <div class="settingBox">
        <h4>Jogosultságok beállításai: </h4>
        <label>Jogosultság hozzáadása: </label>
        <select class="columnselect">

        </select><br>
        <div id="permission-table">
            <div class="permissionContainer">
                <p class="permissionName">Rovatvezető</p>
                <p class="permissionScope">Szórakozás</p>
                <button class="permissionBtn">Törlés</button>
            </div>
        </div>
        <select class="columnselect">

        </select><br>
        <button type="button"><i class="fas fa-save"></i>   Jogosultságok mentése</button>
        </div>
        <div class="settingBox">
        <h4>Token jogosultságok beállításai: </h4>

        </div>
</div>
<?php
    require "footer.php";
    ?>
