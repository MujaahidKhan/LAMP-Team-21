<?php
$inData = getRequestInfo();

$contactId = $inData["ContactId"];
$firstName = $inData["FirstName"];
$lastName = $inData["LastName"];
$phoneNumber = $inData["PhoneNumber"];
$email = $inData["Email"];

$host = "localhost";
$username = "root";
$sqlPassword = "root";
$database = "ContactManagerDB";

// Create connection
$conn = new mysqli($host, $username, $sqlPassword, $database);

if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    # prepare statement
    $stmt = $conn->prepare("UPDATE Contacts SET FirstName = ?, LastName = ?, PhoneNumber = ?, Email = ? WHERE ContactID = ?");
    $stmt->bind_param("ssssi", $firstName, $lastName, $phoneNumber, $email, $contactId);
    # execute statement
    $stmt->execute();
    $stmt->close();
    $conn->close();
    returnWithError("");
}

function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}

function returnWithError($error)
{
    $response = array("error" => $error);
    echo json_encode($response);
}