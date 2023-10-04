<?php

$inData = getRequestInfo();

$searchResults = array();

$host = "localhost";
$sqlusername = "root";
$sqlPassword = "root";
$database = "ContactManagerDB";

// Create connection
$conn = new mysqli($host, $sqlusername, $sqlPassword, $database);
if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    $stmt = $conn->prepare("SELECT * FROM Contacts WHERE ID = ? AND UserID = ?");
    $stmt->bind_param("ii", $inData["contactId"], $inData["userId"]);
    $stmt->execute();

    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $searchResults = $result->fetch_assoc();
        returnWithInfo($searchResults);
    } else {
        returnWithError("Contact not found");
    }

    $stmt->close();
    $conn->close();
}

function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj)
{
    header('Content-type: application/json');
    echo $obj;
}

function returnWithError($err)
{
    $retValue = '{"error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

function returnWithInfo($searchResults)
{
    $retValue = '{"result":' . json_encode($searchResults) . ',"error":""}';
    sendResultInfoAsJson($retValue);
}

?>
