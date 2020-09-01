<?php
    require "../MSQDB.php";
    require "../objects/column.php";
    $database = new MSQDB;
    $columns = Column::getColumns($database);
    http_response_code(200);
    echo json_encode(["columns" => $columns]);
