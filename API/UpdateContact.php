<?php
$inData = getRequestInfo();

$userId = $inData["UserId"];
$contactId = $inData["ContactId"];
$firstName = $inData["FirstName"];
$lastName = $inData["LastName"];
$email = $inData["Email"];
$phone = $inData["Phone"];
$address = $inData["Address"];
$city = $inData["City"];
$state = $inData["State"];
$zip = $inData["Zip"];

$host = "localhost";
$sqlusername = "root";
$sqlPassword = "root";
$database = "ContactManagerDB";

// Create connection
$conn = new mysqli($host, $sqlusername, $sqlPassword, $database);

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
                            WHERE ID = ? AND UserID = ?");
    $stmt->bind_param("ssssssssii",
                        $firstName,
                        $lastName,
                        $email,
                        $phone,
                        $address,
                        $city,
                        $state,
                        $zip,
                        $contactId, $userId);
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