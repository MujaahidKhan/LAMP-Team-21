<?php
$inData = getRequestInfo();

$userId = $inData["UserId"];
$firstName = $inData["FirstName"];
$lastName = $inData["LastName"];
$email = $inData["Email"];
$phoneNumber = $inData["Phone"];
$address = $inData["Address"];
$city = $inData["City"];
$state = $inData["State"];
$zip = $inData["Zip"];

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
	$stmt = $conn->prepare("INSERT into Contacts (UserID, FirstName, LastName,
							Email, Phone, Address, City, State, Zip)
							VALUES(?,?,?,?,?,?,?,?,?)");
	$stmt->bind_param("sssssssss", $userId, $firstName, $lastName, $email,
						$phoneNumber, $address, $city, $state, $zip);
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