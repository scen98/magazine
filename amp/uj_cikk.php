<?php
require "header.php";
?>
<script type="module" src="js/writeController.js" ></script>
<div onload="init()" class="container">
    <form>
        <textarea id="new-title" name="title" rows="2" type="text" class="titleInput" placeholder="Cím"></textarea><br><br>
        <textarea id="lead" class="leadInput" rows="4" placeholder="Bevezető" cols="50"></textarea><br><br>
        <label>Rovat:  </label>
        <select name="column" class="columnselect" id="column-select"></select><br>
        <label>Kép:  </label>
        <input id="img-path" name="img-path" type="text" class="imgsrc">
        <button id="open-img-path-btn" type="button"><i class="fas fa-external-link-square-alt"></i></button><br>
    </form>
    <form method="post">
                <button id="save-article-btn" type="button" class="commandBtn shine" id="submit">Mentés</button>
            </form>    
    <?php require "textedit.php"?>
</div>
<?php
require "footer.php";
?>