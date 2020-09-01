<?php


$errorMSG = "";

/* text */
if (empty($_POST["text"])) {
    $errorMSG = "<li>Name is required</<li>";
} else {
    $text = $_POST["text"];
}



if(empty($errorMSG)){
	$msg = "Text: ".$text;
	echo json_encode(['code'=>200, 'msg'=>$msg]);
	exit;
}


echo json_encode(['code'=>404, 'msg'=>$errorMSG]);