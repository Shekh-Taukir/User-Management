const main_api = "http://127.0.0.1:8000/users/"

function of_redirectPage(as_page) {
    window.location.href = as_page;
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

function of_update_data() {
    document.getElementById('update_data_form').addEventListener("submit", async function (event) {
        event.preventDefault();

        const tran_id = document.getElementById("update_submit").getAttribute('data-tran-id');

        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch(main_api + `update_user?user_id=${tran_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            if (!(response.ok)) {
                alert("Failed to submit data...!");
            }

        }
        catch (error) {
            console.error("ERRor: " + error);
            alert("Error occurred while saving the data.");
        }
        of_redirectPage('index.html');
    });
}

document.addEventListener("DOMContentLoaded", function () {
    console.log("update_data.html");
    of_populate_user_data();
    of_update_data();
});