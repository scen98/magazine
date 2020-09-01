<?php
require "header.php";
?>
<script type="module" src="js/writeController.js"></script>
<div onload="init()" class="container">
    <form>
        <textarea id="new-title" name="title" rows="2" type="text" class="titleInput" placeholder="Cím"></textarea><br><br>
        <textarea id="lead" class="leadInput" rows="4" placeholder="Bevezető" cols="50"></textarea><br><br>
        <label>Rovat:  </label>
        <select name="column" class="columnselect" id="column-select"></select><br>
        <label>Kép:  </label>
        <input id="img-path" name="img-path" type="text" class="imgsrc">
        <button onclick="openImgPath()" type="button"><i class="fas fa-external-link-square-alt"></i></button><br>
    </form>
    <div class="editcontrols">
    <button class="controlbtn" onclick="execCmd('undo');"><i class="fas fa-undo"></i></button>
            <button class="controlbtn shine" onclick="execCmd('redo');"><i class="fas fa-redo"></i></button>
            <button class="controlbtn shine" onclick="execCmd('selectAll');"><i class="fas fa-globe-europe"></i></button>
            <button class="controlbtn shine" onclick="execCommandWithArg('createLink', prompt('Enter a URL', 'http://'));"><i class="fas fa-link"></i></button>
            <button class="controlbtn shine" onclick="execCmd('unlink');"><i class="fas fa-unlink"></i></button>
            <button class="controlbtn shine" onclick="insertImage(prompt('Enter the image URL', ''));"><i class="fa fa-file-image-o"></i></button><br>
            <button class="controlbtn shine" onclick="execCmd('bold');"><i class="fas fa-bold"></i></button>
            <button class="controlbtn shine" onclick="execCmd('italic');"><i class="fas fa-italic"></i></button>
            <button class="controlbtn shine" onclick="execCmd('underline');"><i class="fas fa-underline"></i></button>
            <button class="controlbtn shine" onclick="execCmd('strikeThrough');"><i class="fas fa-strikethrough"></i></button>   
            <button class="controlbtn shine" onclick="execCmd('justifyLeft');"><i class="fas fa-align-left"></i></button>
            <button class="controlbtn shine" onclick="execCmd('justifyCenter');"><i class="fas fa-align-center"></i></button>
            <button class="controlbtn shine" onclick="execCmd('justifyRight');"><i class="fas fa-align-right"></i></button>
            <button class="controlbtn shine" onclick="execCmd('justifyFull');"><i class="fas fa-align-justify"></i></button>
            <button class="controlbtn shine" onclick="execCmd('cut');"><i class="fas fa-cut"></i></button>
            <button class="controlbtn shine" onclick="execCmd('copy');"><i class="fas fa-copy"></i></button>
            <button class="controlbtn shine" onclick="execCmd('indent');"><i class="fas fa-indent"></i></button>
            <button class="controlbtn shine" onclick="execCmd('outdent');"><i class="fas fa-outdent"></i></button>
            <button class="controlbtn shine" class="controlbtn" onclick="execCmd('subscript');"><i class="fas fa-subscript"></i></button>
            <button class="controlbtn shine" onclick="execCmd('superscript');"><i class="fas fa-superscript"></i></button>
            <button class="controlbtn shine" onclick="execCmd('insertUnorderedList');"><i class="fas fa-list-ul"></i></button>
            <button class="controlbtn shine" onclick="execCmd('insertOrderedList');"><i class="fas fa-list-ol"></i></button>
            <button class="controlbtn shine" onclick="execCmd('insertParagraph');"><i class="fas fa-paragraph"></i></button>            
            <select class="controlbtn shine" onchange="execCommandWithArg('formatBlock', this.value);" >
                <option value="H1">H1</option>
                <option value="H2">H2</option>
                <option value="H3">H3</option>
                <option value="H4">H4</option>
                <option value="H5">H5</option>
                <option value="H6">H6</option>
            </select>
            <button class="controlbtn shine" onclick="execCmd('insertHorizontalRule');">HR</button>
            <button class="controlbtn shine" onclick="execCommandWithArg('createLink', prompt('Enter a URL', 'http://'));"><i class="fas fa-link"></i></button>
            <select onchange="execCommandWithArg('fontName', this.value);" >
                <option value="Arial">Arial</option>
                <option value="Comain Sans">Comain Sans</option>
                <option value="Courier">Courier</option>
                <option value="Georgia">Georgia</option>
                <option value="Tahoma">Tahoma</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Verdana">Verdana</option>
            </select>
            <select onchange="execCommandWithArg('fontSize', this.value);" >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
            </select>
        </div>
        
        <iframe class="textedit" value="texts" id="txtField" name="richTextField"></iframe>

            <form method="post" action="tester.php">
                <button onclick="insertArticle()" type="button" id="submit">Save</button>
            </form>    

</div>
<?php
require "footer.php";
?>