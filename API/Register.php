<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $jsonPayload = file_get_contents("php://input");

    $data = json_decode($jsonPayload);

    $firstName = $data->FirstName;
    $lastName = $data->LastName;
    $username = $data->Username;
    $password = $data->Password;

    if (empty($firstName) || empty($lastName) || empty($username) || empty($password)) {
        $response = array("error" => "All fields are required");
        echo json_encode($response);
    } else if (strlen($password) < 1) {
        $response = array("error" => "Password cannot be empty");
        echo json_encode($response);
    } else {
        $servername = "localhost";
        $sqlusername = "root";
        $sqlPassword = "root";
        $dbname = "ContactManagerDB";

        // Create connection
        $conn = new mysqli($servername, $sqlusername, $sqlPassword, $dbname);

        if ($conn->connect_error) {
            $response = array("error" => "Connection failed: " . $conn->connect_error);
            echo json_encode($response);
        } else {
            $sql = "SELECT * FROM Users WHERE Username='$username'";
            $result = $conn->query($sql);

            # Check if username already exists
            if ($result->num_rows > 0) {
                $response = array("error" => "Username already exists");
                echo json_encode($response);
            } else {
                $hashedPassword = md5($password);

                $sql = "INSERT INTO Users (FirstName, LastName, Username, Password) VALUES ('$firstName', '$lastName', '$username', '$hashedPassword')";

                if ($conn->query($sql) === TRUE) {
                    $response = array("success" => "User registered successfully");
                    echo json_encode($response);
                } else {
                    $response = array("error" => "Error: " . $sql . "<br>" . $conn->error);
                    echo json_encode($response);
                }
            }

            $conn->close();
        }
    }
}

?>