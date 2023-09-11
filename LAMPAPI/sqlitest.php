<?php
$host = "localhost";
$username = "root";
$password = "root";
$database = "ContactManagerDB";

// Create connection
$conn = new mysqli($host, $username, $password, $database);

// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
echo "Connected successfully\n";
?>