const main_api = "http://127.0.0.1:8000/users/"

// fetch the custom message from the test api
async function fetch_Message() {
    try {
        const response = await fetch(main_api);

        const data = await response.json();

        if (data.Success) {
            document.getElementById("api_message").textContent = data.Message;
        } else {
            document.getElementById("api_message").textContent = "Error : could not fetch the data from API"
        }
    } catch (error) {
        // Handle any errors
        console.error("Error fetching API data:", error);
        document.getElementById("api-message").textContent = "Error: Unable to connect to the server.";
    }
}

//fetch the custom table data from the API
async function fetch_table_data() {
    try {
        const response = await fetch(main_api + "test2/")

        const data = await response.json();

        if (data.Success) {
            const value1_array = data.result.value_1;
            const value2 = data.result.value_2;

            const table_body = document.querySelector("#api_table tbody");

            table_body.innerHTML = "";

            value1_array.forEach((value, index) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${value}</td>
                    <td>${value2}</td>
                `;
                table_body.appendChild(row);
                // console.log("value from array " + value + " index is " + index)
                // console.log("value from array " + value2)
            });
        }
        else {
            console.error("API returned a failure response:", data);
            alert("Failed to fetch data from the API.");
        }
    }
    catch (error) {
        console.error("Error fetching API data:", error);
        alert("Unable to fetch data from the server.");
    }
}

function of_handleUpdate(event) {
    const tran_id = event.target.getAttribute("data-tran-id");
    console.log("update function for tran_id : " + tran_id)

    sessionStorage.setItem('update_tran_id', tran_id);
    of_redirectPage("update_data.html");
}

async function of_handleDelete(event) {
    const tran_id = event.target.getAttribute("data-tran-id");
    const full_name = event.target.getAttribute("data-name");
    console.log(full_name)

    if (confirm(`Are you sure to delete the entry for ${full_name}?`)) {
        try {
            const response = await fetch(main_api + `delete_user?user_id=${tran_id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                }
            })

            if (!response.ok) {
                console.error("failed to delete entry:", response.json());
                alert("Failed to delete entry");
            }uvg bhj
        }
        catch (error) {
            console.error("Error deleting entry : ", error);
            alert("Failed to delete entry");
        }
        // refresh the table after deleting the table
        of_fetch_users_data();
    }
}

async function of_fetch_users_data() {
    try {
        const response = await fetch(main_api + "get_all_users/")

        const data = await response.json();

        if (data.Success) {
            const resultArray = data.result;
            const table_body = document.querySelector("#api_table tbody");

            table_body.innerHTML = "";

            resultArray.forEach((row, index) => {
                const tableRow = document.createElement("tr");

                tableRow.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${row.first_name}, ${row.last_name}</td>                    
                    <td>${row.email}</td>
                    <td>${row.dob}</td>
                    <td>
                        <button class="update-btn btn btn-success" data-tran-id = "${row.tran_id}">Edit</button>
                        <button class="delete-btn btn btn-danger" data-tran-id = "${row.tran_id}" data-name = "${row.first_name}, ${row.last_name}">Delete</button>
                    </td>
                `;

                table_body.appendChild(tableRow);
            });

            document.querySelectorAll(".update-btn").forEach(button => {
                button.addEventListener("click", of_handleUpdate);
            });

            document.querySelectorAll(".delete-btn").forEach(button => {
                button.addEventListener("click", of_handleDelete);
            });
        }
        else {
            console.error("API returned = failure response", data);
            alert("Failed to fetch data from the API");
        }
    }
    catch (error) {
        console.error("Error fetching API data", error);
        alert("Unable to fetch data from the Server");
    }
}

async function of_populate_user_data() {
    const tran_id = sessionStorage.getItem('update_tran_id');

    const submit_btn = document.getElementById('update_submit');
    submit_btn.setAttribute('data-tran-id', tran_id);

    const response = await fetch(main_api + `get_user?user_id=${tran_id}`);
    const entryData = await response.json();

    document.getElementById("first_name").value = entryData.result.first_name;
    document.getElementById("last_name").value = entryData.result.last_name;
    document.getElementById("email").value = entryData.result.email;
    document.getElementById("dob").value = entryData.result.dob;
}

//redirect to add_data.html page from index page
// function redirectToAddData() {
//     window.location.href = "add_data.html";
// }

//redirect to index page from add_data page
// function redirectToMainPage() {
//     window.location.href = "index.html";
// }

function of_redirectPage(as_page) {
    window.location.href = as_page
}

//adds form data to the db via Add API Call
function of_add_data() {
    document.getElementById("add_data_form").addEventListener("submit", async function (event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch(main_api + "add_user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            console.log("response from the API : " + response.ok);


            if (!(response.ok)) {
                alert("Failed to submit data...!");
            }

        } catch (error) {
            console.error("Error: " + error);
            alert("An error occured while saving the data.");
        }

        // after saving the data return to main page.
        of_redirectPage('index.html')
    });
}

// testing function to solve the error while adding data via Add API
function of_test_add_data() {
    document.getElementById('myForm').addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const formObject = Object.fromEntries(formData.entries());

        try {
            const response = await fetch(main_api + "test_submit", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formObject),
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Success: ", data);
                alert("Form data submitted");
            } else {

                console.ERROR("Error: ", data);
                alert("Failed!!!");
            }
        }
        catch (error) {
            console.error("ERROR : ", error);
            alert("Catch code caught an error in code");
        }
    });
}

function of_update_data() {
    document.getElementById('update_data_form').addEventListener("submit", async function (event) {
        const tran_id = event.target.getAttribute('data-tran-id');
        alert("submit clicked for : " + tran_id);
    });
}

//decides which code should be run according to the html file
document.addEventListener("DOMContentLoaded", function () {
    const currentPage = window.location.pathname;

    if (currentPage.includes("add_data.html")) {
        of_add_data();
    }

    if (currentPage.includes("index.html")) {

        console.log("hello from index.html");
        fetch_Message();

        // fetch_table_data();
        of_fetch_users_data();
    }

    if (currentPage.includes("test.html")) {
        console.log("code called for test.html");
        of_test_add_data();
    }

    if (currentPage.includes("update_data.html")) {
        console.log("code called for update_data.html");
        of_populate_user_data();
        of_update_data();
    }
});