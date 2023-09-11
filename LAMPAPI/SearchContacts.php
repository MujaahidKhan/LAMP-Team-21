<?php

$inData = getRequestInfo();

$searchResults = array();
$searchCount = 0;

$conn = new mysqli("localhost", "root", "root", "ContactManagerDB");
if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    $stmt = $conn->prepare("SELECT * FROM Contacts WHERE CONCAT(FirstName, ' ', LastName, ' ', Email,
							' ', Phone, ' ', Address, ' ', City, ' ', State, ' ', Zip) LIKE ? AND UserID = ?");
    $searchText = "%" . $inData["search"] . "%";
    $stmt->bind_param("ss", $searchText, $inData["userId"]);
    $stmt->execute();

    $result = $stmt->get_result();

    while ($row = $result->fetch_assoc()) {
        $searchResults[] = $row;
        $searchCount++;
    }

    if ($searchCount == 0) {
        returnWithError("No Records Found");
    } else {
        returnWithInfo($searchResults);
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
    $retValue = '{"results":' . json_encode($searchResults) . ',"error":""}';
    sendResultInfoAsJson($retValue);
}

?>