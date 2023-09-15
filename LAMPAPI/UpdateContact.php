<?php
$inData = getRequestInfo();

$contactId = $inData["ContactId"];
$firstName = $inData["FirstName"];
$lastName = $inData["LastName"];
$email = $inData["Email"];
$phoneNumber = $inData["PhoneNumber"];


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
    $stmt = $conn->prepare("UPDATE Contacts SET
                            FirstName = ?,
                            LastName = ?,
                            Email = ?,
                            Phone = ?,
                            Address = ?,
                            City = ?,
                            State = ?,
                            Zip = ?
                            WHERE ContactID = ?");
    $stmt->bind_param("ssssssssi",
                        $firstName,
                        $lastName,
                        $email,
                        $phoneNumber,
                        $address,
                        $city,
                        $state,
                        $zip,
                        $contactId);
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