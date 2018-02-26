<?php
header("Content-Type:application/json");

response(200,"OK");

function response($status,$status_message)
{
	header("HTTP/1.1 ".$status);
    $response['status']=$status;
    $response['status_message']=$status_message;

    $data = null;
    foreach (getallheaders() as $name => $value) {
        $data[$name]=$value;
    }

    $response['data'] = $data;
	
	$json_response = json_encode($response);
	echo $json_response;
}