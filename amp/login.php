<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="css/login.css" />
</head>
<body class="loginbg">
<div class="logincontainer">
<form action="includes/login.inc.php" class="loginform" name="loginform" method="post">
  <div class="container">
    <label for="uname"><b>Felhasználónév</b></label>
    <input type="text" placeholder="Enter Username" name="userName" required>
    <label for="pwd"><b>Jelszó</b></label>
    <input type="password" placeholder="Enter Password" name="password" required>        
    <button type="login" name="login">Login</button>
    <label>
      <p><?php require "includes/messages/loginmessages.php" ?></p>
    </label>
  </div>
</form>
</div>
</body>
</html>