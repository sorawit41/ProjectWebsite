<?php 
include './DbConnect.php';
$objDb = new DbConnect;
$conn = $objDb->connect();
echo 'test';
?>