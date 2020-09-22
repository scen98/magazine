<?php 
    require "header.php";
    ?>
  <!-- <script type="module" src="js/createuserController.js"></script> -->
    <div class="container">
        <form action="includes/createuser.inc.php" method="post">
        <p><?php require "includes/messages/addusermessage.php" ?></p>
        <label for="uname"><b>Felhasználó név: (az egyedi név, amellyel majd be tud lépni a felhasználó)</b></label>
        <input class="logininput" type="text" placeholder="Enter Username" name="uniquename" required>
        <label for="uname"><b>Új felhasználó neve: (ami majd megjelenik a megjelent cikkek mellett)</b></label>
        <input class="logininput" type="text" placeholder="Enter Username" name="uname" required>
        <label for="psw"><b>Új felhaszhnáló jelszava: </b></label>
        <input class="logininput" type="password" placeholder="Enter Password" name="pwd" required>
        <label for="psw"><b>Új felhaszhnáló jelszava ismét: </b></label>
        <input class="logininput" type="password" placeholder="Enter Password" name="pwd-repeat" required>
        <button id="add-btn" onclick="addColumn()" type="button" style="display: none;" class="addbutton"><i class="fas fa-plus"></i></button>
        <button id="remove-btn" onclick="removeColumn()" type="button" style="display: none;" class="removebutton" ><i class="fas fa-minus"></i></button>
         <br>
        <div id="permission-details">
        </div>
        <br>
        <button class="loginbutton" name="adduser" type="submit">Regisztráció</button>
        </form>
</div>


<?php
    require "footer.php";
    ?>
