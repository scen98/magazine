<?php
    require "includes/objects/permission.php";
    require "includes/objects/tokenpermission.php";
    session_start();
    if(!isset($_SESSION["permissions"][0])){
        header("Location: ../amp/login.php?error=timeout");
        exit();
    }
    ?>
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="css/styles.css" />
    <script src="https://kit.fontawesome.com/2eba930695.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script type="module" src="js/headerController.js"></script>
</head>
<body>
    <header>
<ul id="main-header" class="menu">

<li><a href="uj_cikk.php">Új cikk</a></li>
<li><a href="#">Cikkek</a>
    <ul>
        <li><a href="cikkeim.php" ><span class="icon"><i class="fas fa-handshake"></i></span>Cikkeim</a></li>
        <li id="awaiting-articles"><a href="publikacio.php" ><span class="icon"><i class="fas fa-file-alt"></i></span>Publikáció</a></li>
        <li id="position-page"><a href="ujsag.php" ><span class="icon"><i class="fas fa-file-alt"></i></span>Újság</a></li>
    </ul>
</li>
<li><a href="#">Jogosultságok</a>
    <ul>
        <li id="tokens"><a href="tokenek.php" ><span class="icon"><i class="fas fa-school"></i></span>Tokenek</a></li>
    </ul>
</li>
<li><a href="#">Kollégák</a>
    <ul>
        <li><a href="szerzok.php" ><span class="icon"><i class="fas fa-address-book"></i></span>Névsor</a></li>
        <li id="create-user"><a href="uj_szerzo.php" ><span class="icon"><i class="fas fa-plus-circle"></i></span>Új</a></li>
    </ul>
</li>
<li class="username"><a id="log-out"><i class="fas fa-sign-out-alt "></a></i></li>
<li class="username"><a href="szerzo.php?szerzo=<?php echo  $_SESSION["id"] ?>"><?php echo $_SESSION["userName"] ?></a></li>
</ul>
    </header>
