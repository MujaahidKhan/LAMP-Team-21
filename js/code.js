const urlBase = '/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function showRegister() {
    document.getElementById("loginDiv").style.display = "none";
    document.getElementById("registerDiv").style.display = "block";
}

function showLogin() {
	document.getElementById("loginDiv").style.display = "block";
	document.getElementById("registerDiv").style.display = "none";
}

function doRegister() {
    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    let username = document.getElementById("registerName").value;
    let password = document.getElementById("registerPassword").value;
    let retypePassword = document.getElementById("retypePassword").value;

    if (password !== retypePassword) {
        document.getElementById("registerResult").innerHTML = "Passwords do not match";
        return;
    }

    let jsonPayload = JSON.stringify({
        FirstName: firstName,
        LastName: lastName,
        Login: username,
        Password: password // to be hashed...
    });

    let url = urlBase + "/Register." + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                if (jsonObject.error) {
                    document.getElementById("registerResult").innerHTML = jsonObject.error;
                } else {
                    document.getElementById("registerResult").innerHTML = "Registration successful";
                }
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("registerResult").innerHTML = err.message;
    }
}

function doLogin() {
	userId = 0;
	firstName = "";
	lastName = "";

	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
	//	var hash = md5( password );

	document.getElementById("loginResult").innerHTML = "";

	let tmp = { login: login, password: password };
	//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				let jsonObject = JSON.parse(xhr.responseText);
				userId = jsonObject.id;

				if (userId < 1) {
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}

				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();

				window.location.href = "contactmanager.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function saveCookie() {
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime() + (minutes * 60 * 1000));
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie() {
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for (var i = 0; i < splits.length; i++) {
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if (tokens[0] == "firstName") {
			firstName = tokens[1];
		}
		else if (tokens[0] == "lastName") {
			lastName = tokens[1];
		}
		else if (tokens[0] == "userId") {
			userId = parseInt(tokens[1].trim());
		}
	}

	if (userId < 0) {
		window.location.href = "index.html";
	}
	else {
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout() {
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function addContact() {
	let newFirstName = document.getElementById("firstName").value;
	let newLastName = document.getElementById("lastName").value;
	let newEmail = document.getElementById("email").value;
	let newPhone = document.getElementById("phone").value;
	let newAddress = document.getElementById("address").value;
	let newCity = document.getElementById("city").value;
	let newState = document.getElementById("state").value;
	let newZip = document.getElementById("zip").value;

	document.getElementById("contactAddResult").innerHTML = "";

	let tmp = {
		UserId: userId,
		FirstName: newFirstName,
		LastName: newLastName,
		Email: newEmail,
		Phone: newPhone,
		Address: newAddress,
		City: newCity,
		State: newState,
		Zip: newZip
	};
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/AddContact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				document.getElementById("contactAddResult").innerHTML = "Contact has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		document.getElementById("contactAddResult").innerHTML = err.message;
	}

}

function searchContacts() {
	let searchText = document.getElementById("searchText").value;
	document.getElementById("contactSearchResult").innerHTML = "";

	let contactList = "";

	// package the search text and user id into a json payload
	let tmp = { search: searchText, userId: userId };
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/SearchContacts.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				document.getElementById("contactSearchResult").innerHTML = "Contact(s) has been retrieved";
				let jsonObject = JSON.parse(xhr.responseText);

				let table = "<table><tr><th>First Name</th><th>Last Name</th><th>Phone</th><th>Email</th><th>Address</th><th>City</th><th>State</th><th>Zip</th></tr><tr>";

				for (let i = 0; i < jsonObject.results.length; i++) {
					let contact = jsonObject.results[i];
					table += `<td>${contact.FirstName}</td><td>${contact.LastName}</td>
								<td>${contact.Phone}</td><td>${contact.Email}</td><td>${contact.Address}</td>
								<td>${contact.City}</td><td>${contact.State}</td><td>${contact.Zip}</td></tr><tr>`;
				}

				table += "</table>";

				document.getElementById("contactSearchResult").innerHTML = table;
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}
}

function updateContact() {
	let oldFirstName = document.getElementById("oldFirstName").value;
	let oldLastName = document.getElementById("oldLastName").value;
	let newFirstName = document.getElementById("newFirstName").value;
	let newLastName = document.getElementById("newLastName").value;
	let newEmail = document.getElementById("newEmail").value;
	let newPhone = document.getElementById("newPhone").value;
	let newAddress = document.getElementById("newAddress").value;
	let newCity = document.getElementById("newCity").value;
	let newState = document.getElementById("newState").value;
	let newZip = document.getElementById("newZip").value;

	document.getElementById("contactUpdateResult").innerHTML = "";

	let tmp = {
		UserId: userId,
		OldFirstName: oldFirstName,
		OldLastName: oldLastName,
		NewFirstName: newFirstName,
		NewLastName: newLastName,
		NewEmail: newEmail,
		NewPhone: newPhone,
		NewAddress: newAddress,
		NewCity: newCity,
		NewState: newState,
		NewZip: newZip
	};
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/UpdateContact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				document.getElementById("contactUpdateResult").innerHTML = "Contact has been updated";
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		document.getElementById("contactUpdateResult").innerHTML = err.message;
	}
}

function deleteContact() {
	let deleteFirstName = document.getElementById("deleteFirstName").value;
	let deleteLastName = document.getElementById("deleteLastName").value;

	document.getElementById("contactDeleteResult").innerHTML = "";

	let tmp = {
		UserId: userId,
		DeleteFirstName: deleteFirstName,
		DeleteLastName: deleteLastName
	};
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/DeleteContact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				document.getElementById("contactDeleteResult").innerHTML = "Contact has been deleted";
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		document.getElementById("contactDeleteResult").innerHTML = err.message;
	}
}