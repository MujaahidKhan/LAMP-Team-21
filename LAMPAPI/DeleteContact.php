<?php
$inData = getRequestInfo();

$contactId = $inData["ContactId"];

$conn = new mysqli("localhost", "root", "root", "ContactManagerDB");

if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    # prepare statement
    $stmt = $conn->prepare("DELETE FROM Contacts WHERE ContactID = ?");
    $stmt->bind_param("i", $contactId);
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
?>