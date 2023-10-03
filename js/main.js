const urlBase = '/API';
const extension = 'php';

let userId = -1;
let contactId = -1;

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
		Username: username,
		Password: password
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

	// Get the username and password values from the form data
	const username = document.getElementById("usernameField").value;
	const password = document.getElementById("passwordField").value;

	document.getElementById("loginResult").innerHTML = "";

	let tmp = { username: username, password: password };
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
					document.getElementById("loginResult").innerHTML = "Username/Password is incorrect";
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

// Function to show the popup
function showPopup() {
	const popupContainer = document.getElementById('popupContainer');
	popupContainer.style.display = 'flex';
}

// Function to hide the popup
function hidePopup() {
	const popupContainer = document.getElementById('popupContainer');
	popupContainer.style.display = 'none';
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

	// json payload
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
				window.location.reload()
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
				document.getElementById("contactSearchResult").innerHTML = "";
				let jsonObject = JSON.parse(xhr.responseText);

				// add labels to the table
				let table = `<table class="table table-hover"><tr><th>First Name</th><th>Last Name</th><th>Phone</th><th>Email</th><th>Address</th><th>City</th><th>State</th><th>Zip</th></tr><tr>`;

				// add each contact to the table
				for (let i = 0; i < jsonObject.results.length; i++) {
					let contact = jsonObject.results[i];
					table += `<tr data-bs-toggle="modal" data-bs-target="#modal" onClick="showEditModal(this)" data-contact-id="${contact.ID}" style="cursor: pointer;">
              					<td class="text-wrap ">${contact.FirstName}</td>
              					<td class="text-wrap">${contact.LastName}</td>
              					<td class="text-wrap">${contact.Phone}</td>
              					<td class="text-wrap">${contact.Email}</td>
              					<td class="text-wrap">${contact.Address}</td>
              					<td class="text-wrap">${contact.City}</td>
              					<td class="text-wrap">${contact.State}</td>
              					<td class="text-wrap">${contact.Zip}</td>
            				  </tr>`;
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

function showEditModal(row) {
	// Retrieve the contact data from the clicked row
	contactId = row.getAttribute("data-contact-id");
	let firstName = row.cells[0].textContent;
	let lastName = row.cells[1].textContent;
	let phone = row.cells[2].textContent;
	let email = row.cells[3].textContent;
	let address = row.cells[4].textContent;
	let city = row.cells[5].textContent;
	let state = row.cells[6].textContent;
	let zip = row.cells[7].textContent;

	// Open the edit modal and populate it with the contact data
	// Need a modal function, should replace all console.log calls with filling the text boxes in the modal

	document.getElementById("updateContactId").value = contactId
	document.getElementById("updateFirstName").value = firstName
	document.getElementById("updateLastName").value = lastName
	document.getElementById("updateEmail").value = email
	document.getElementById("updatePhone").value = phone
	document.getElementById("updateAddress").value = address
	document.getElementById("updateCity").value = city
	document.getElementById("updateState").value = state
	document.getElementById("updateZip").value = zip

	console.log("Contact ID:", contactId);
	console.log("First Name:", firstName);
	console.log("Last Name:", lastName);
	console.log("Phone:", phone);
	console.log("Email:", email);
	console.log("Address:", address);
	console.log("City:", city);
	console.log("State:", state);
	console.log("Zip:", zip);
}

function updateContact() {
	let contactId = document.getElementById("updateContactId").value;
	let FirstName = document.getElementById("updateFirstName").value;
	let LastName = document.getElementById("updateLastName").value;
	let Email = document.getElementById("updateEmail").value;
	let Phone = document.getElementById("updatePhone").value;
	let Address = document.getElementById("updateAddress").value;
	let City = document.getElementById("updateCity").value;
	let State = document.getElementById("updateState").value;
	let Zip = document.getElementById("updateZip").value;

	let tmp = {
		UserId: userId,
		ContactId: contactId,
		FirstName: FirstName,
		LastName: LastName,
		Email: Email,
		Phone: Phone,
		Address: Address,
		City: City,
		State: State,
		Zip: Zip
	};
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/UpdateContact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				// document.getElementById("contactUpdateResult").innerHTML = "Contact has been updated";
				window.location.reload();
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		// document.getElementById("contactUpdateResult").innerHTML = err.message;
	}
}

function deleteContact() {
	// let deleteId = row.getAttribute("data-contact-id");
	let deleteId = contactId; // this is very unsafe but should work

	// document.getElementById("contactDeleteResult").innerHTML = "";

	let tmp = {
		ContactId: deleteId,
	};
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/DeleteContact.' + extension;

	let xhr = new XMLHttpRequest();	
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				// document.getElementById("contactDeleteResult").innerHTML = "Contact has been deleted";
				window.location.reload();
			}
		};
		xhr.send(jsonPayload);
	}
	catch (err) {
		//document.getElementById("contactDeleteResult").innerHTML = err.message;
	}
}

document.querySelectorAll('a[data-contact-id]').forEach(function (link) {
	link.addEventListener('click', function (event) {
		event.preventDefault(); // Prevent the default link behavior
		const contactID = this.getAttribute('data-contact-id');
		// Use the contactID as needed
		console.log('Contact ID:', contactID);
	});
});
