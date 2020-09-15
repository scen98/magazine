<?php
class RequestUtils{
    public static function checkData($data){
        if(empty($data)){
            http_response_code(400);
            echo json_encode(["msg"=> "Hiányos adatok."]);
            exit();
        }
    }

    public static function returnData($name, $data){
        http_response_code(200);
        echo json_encode([$name => $data]);
        exit();
    }

    public static function returnInsert($newId){
        if(is_null($newId)){
            RequestUtils::sqlError();
        } else {
            http_response_code(201);
            echo json_encode(["newId" => $newId]);
            exit();
        }
       
    }

    public static function sendSuccess(){
        http_response_code(200);
        echo json_encode(["msg" => "success"]);
        exit;
    }
    public static function sendFail(){
        http_response_code(400);
        echo json_encode(["msg" => "fail"]);
        exit;
    }
    public static function sqlError(){
        http_response_code(400);
        echo json_encode(["msg" => "SQL server hiba."]);
        exit;
    }
    public static function permissionDenied(){
        http_response_code(403);
        echo json_encode(["msg"=> "Hozzáférés megtagadva."]);
        exit();
    }
}
