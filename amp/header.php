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

<li><a href="write.php">Új cikk</a></li>
<li><a href="#">Cikkek</a>
    <ul>
        <li><a href="myarticles.php" ><span class="icon"><i class="fas fa-handshake"></i></span>Cikkeim</a></li>
        <li id="awaiting-articles"><a href="awaitingarticles.php" ><span class="icon"><i class="fas fa-file-alt"></i></span>Publiikáció</a></li>
    </ul>
</li>
<li><a href="#">Jogosultságok</a>
    <ul>
        <li id="tokens"><a href="tokens.php" ><span class="icon"><i class="fas fa-school"></i></span>Tokenek</a></li>
        <li><a href="#" ><span class="icon"><i class="fas fa-flask"></i></span>Felhasználók</a></li>
    </ul>
</li>
<li><a href="#">Projektek</a>
    <ul>
        <li><a href="#" ><span class="icon"><i class="fab fa-js"></i></span>Web</a></li>
        <li><a href="#" ><span class="icon"><i class="fab fa-java"></i></span>Java</a></li>
        <li><a href="#" ><span class="icon"><i class="fab fa-windows"></i></span>C#</a></li>
    </ul>
</li>
<li><a href="#">Kollégák</a>
    <ul>
        <li><a href="authors.php" ><span class="icon"><i class="fas fa-address-book"></i></span>Névsor</a></li>
        <li><a href="#" ><span class="icon"><i class="fas fa-address-card"></i></i></span>Kezelés</a></li>
        <li id="create-user"><a href="createuser.php" ><span class="icon"><i class="fas fa-plus-circle"></i></span>Új</a></li>
    </ul>
</li>
<li class="username"><a onclick="logOut()"><i class="fas fa-sign-out-alt "></a></i></li>
<li class="username"><a href="#"><?php echo $_SESSION["userName"] ?></a></li>
</ul>
    </header>
