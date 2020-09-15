<?php
$data = json_decode(file_get_contents("php://input"));
if(empty($data)){
    http_response_code(400);
    echo json_encode(["msg"=> "Data is incomplete"]);
    exit();
}
$textFile = fopen("../texts/article".$data->id.".txt", "w");
fwrite($textFile, $data->text);
fclose($textFile);
http_response_code(200);
echo json_encode(["msg"=> "success"]);
exit();