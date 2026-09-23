// ==========================================================
// FASTAPI BACKEND URL
// ==========================================================

const API_URL = "http://127.0.0.1:8000";


// ==========================================================
// GLOBAL VARIABLES
// ==========================================================

let selectedRole = "admin";


// ==========================================================
// LOGIN PAGE
// ==========================================================

function selectRole(role) {

    selectedRole = role;

    const adminButton =
        document.getElementById("adminRoleBtn");

    const customerButton =
        document.getElementById("customerRoleBtn");

    if (role === "admin") {

        adminButton.classList.add("active");

        customerButton.classList.remove("active");

    } else {

        customerButton.classList.add("active");

        adminButton.classList.remove("active");

    }
}


// ==========================================================
// LOGIN
// ==========================================================

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener("submit", async function(event) {

        event.preventDefault();

        const name =
            document.getElementById("name").value.trim();

        const password =
            document.getElementById("password").value.trim();

        const message =
            document.getElementById("loginMessage");


        if (!name || !password) {

            message.textContent =
                "Please enter name and password.";

            return;
        }


        const endpoint =
            selectedRole === "admin"
                ? "/admin/login"
                : "/customer/login";


        try {

            const response = await fetch(
                API_URL + endpoint,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        name: name,
                        password: password
                    })
                }
            );


            const data = await response.json();


            if (!response.ok) {

                message.textContent =
                    data.detail || "Login failed.";

                return;
            }


            // Store role

            localStorage.setItem(
                "role",
                selectedRole
            );


            // Store logged-in user

            if (selectedRole === "admin") {

                localStorage.setItem(
                    "user",
                    JSON.stringify(data.admin)
                );

            } else {

                localStorage.setItem(
                    "user",
                    JSON.stringify(data.customer)
                );

            }


            // Go dashboard

            window.location.href =
                "dashboard.html";

        }

        catch (error) {

            console.error(error);

            message.textContent =
                "Cannot connect to FastAPI server.";

        }

    });

}


// ==========================================================
// DASHBOARD INITIALIZATION
// ==========================================================

if (window.location.pathname.includes("dashboard.html")) {

    initializeDashboard();

}


function initializeDashboard() {

    const role =
        localStorage.getItem("role");

    const user =
        JSON.parse(
            localStorage.getItem("user")
        );


    if (!role || !user) {

        window.location.href = "index.html";

        return;
    }


    document.getElementById("welcomeUser")
        .textContent =
        "Welcome, " + user.name;


    if (role === "admin") {

        document.getElementById("adminDashboard")
            .style.display = "block";

        document.getElementById("customerDashboard")
            .style.display = "none";

        document.getElementById("dashboardTitle")
            .textContent =
            "Admin Dashboard";

    } else {

        document.getElementById("adminDashboard")
            .style.display = "none";

        document.getElementById("customerDashboard")
            .style.display = "block";

        document.getElementById("dashboardTitle")
            .textContent =
            "Customer Dashboard";

    }

}


// ==========================================================
// LOGOUT
// ==========================================================

function logout() {

    localStorage.removeItem("role");

    localStorage.removeItem("user");

    window.location.href = "index.html";

}


// ==========================================================
// ADMIN - CREATE CUSTOMER FORM
// ==========================================================

function showCreateCustomer() {

    const area =
        document.getElementById("operationArea");

    area.innerHTML = `

        <h3>Create Customer Account</h3>

        <input
            type="text"
            id="newCustomerName"
            placeholder="Customer name"
        >

        <input
            type="password"
            id="newCustomerPassword"
            placeholder="Customer password"
        >

        <input
            type="number"
            id="newCustomerBalance"
            placeholder="Initial balance"
            value="1000"
            min="0"
            step="0.01"
        >

        <button onclick="createCustomer()">
            Create Account
        </button>

    `;

}


// ==========================================================
// ADMIN - CREATE CUSTOMER
// ==========================================================

async function createCustomer() {

    const name =
        document.getElementById(
            "newCustomerName"
        ).value.trim();

    const password =
        document.getElementById(
            "newCustomerPassword"
        ).value.trim();

    const balance =
        parseFloat(
            document.getElementById(
                "newCustomerBalance"
            ).value
        );


    if (!name || !password) {

        showError(
            "Please enter customer name and password."
        );

        return;
    }


    try {

        const response = await fetch(
            API_URL + "/customers",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    name: name,
                    password: password,
                    balance:
                        isNaN(balance)
                            ? 1000
                            : balance
                })
            }
        );


        const data = await response.json();


        if (!response.ok) {

            showError(
                data.detail ||
                "Unable to create customer."
            );

            return;
        }


        showSuccess(
            "Customer created successfully."
        );


        displayCustomer(
            data.customer
        );

    }

    catch (error) {

        showError(
            "Unable to connect to backend."
        );

    }

}


// ==========================================================
// ADMIN - GET ALL CUSTOMERS
// ==========================================================

async function getAllCustomers() {

    try {

        const response = await fetch(
            API_URL + "/customers"
        );


        const customers =
            await response.json();


        if (!response.ok) {

            showError(
                "Unable to get customers."
            );

            return;
        }


        displayCustomers(
            customers
        );

    }

    catch (error) {

        showError(
            "Unable to connect to backend."
        );

    }

}


// ==========================================================
// DISPLAY ALL CUSTOMERS
// ==========================================================

function displayCustomers(customers) {

    const result =
        document.getElementById(
            "resultArea"
        );


    if (customers.length === 0) {

        result.innerHTML =
            "<p>No customers found.</p>";

        return;
    }


    let html = `

        <h3>All Customer Accounts</h3>

        <table class="customer-table">

            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Password</th>
                <th>Balance</th>
            </tr>

    `;


    customers.forEach(customer => {

        html += `

            <tr>

                <td>${customer.id}</td>

                <td>${customer.name}</td>

                <td>${customer.password}</td>

                <td>₹${customer.balance}</td>

            </tr>

        `;

    });


    html += "</table>";


    result.innerHTML = html;

}


// ==========================================================
// ADMIN - VIEW ONE CUSTOMER FORM
// ==========================================================

function showViewCustomer() {

    const area =
        document.getElementById(
            "operationArea"
        );


    area.innerHTML = `

        <h3>View Customer Account</h3>

        <input
            type="number"
            id="viewCustomerId"
            placeholder="Enter customer ID"
            min="1"
        >

        <button onclick="viewCustomer()">
            View Account
        </button>

    `;

}


// ==========================================================
// ADMIN - VIEW ONE CUSTOMER
// ==========================================================

async function viewCustomer() {

    const id =
        document.getElementById(
            "viewCustomerId"
        ).value;


    if (!id) {

        showError(
            "Please enter customer ID."
        );

        return;
    }


    try {

        const response = await fetch(
            API_URL + "/customers/" + id
        );


        const customer =
            await response.json();


        if (!response.ok) {

            showError(
                customer.detail ||
                "Customer not found."
            );

            return;
        }


        displayCustomer(
            customer
        );

    }

    catch (error) {

        showError(
            "Unable to connect to backend."
        );

    }

}


// ==========================================================
// ADMIN - DELETE CUSTOMER FORM
// ==========================================================

function showDeleteCustomer() {

    const area =
        document.getElementById(
            "operationArea"
        );


    area.innerHTML = `

        <h3>Delete Customer Account</h3>

        <input
            type="number"
            id="deleteCustomerId"
            placeholder="Enter customer ID"
            min="1"
        >

        <button
            onclick="deleteCustomer()">
            Delete Account
        </button>

    `;

}


// ==========================================================
// ADMIN - DELETE CUSTOMER
// ==========================================================

async function deleteCustomer() {

    const id =
        document.getElementById(
            "deleteCustomerId"
        ).value;


    if (!id) {

        showError(
            "Please enter customer ID."
        );

        return;
    }


    const confirmation =
        confirm(
            "Are you sure you want to delete this customer?"
        );


    if (!confirmation) {

        return;

    }


    try {

        const response = await fetch(
            API_URL + "/customers/" + id,
            {
                method: "DELETE"
            }
        );


        const data =
            await response.json();


        if (!response.ok) {

            showError(
                data.detail ||
                "Unable to delete customer."
            );

            return;
        }


        showSuccess(
            "Customer deleted successfully."
        );

    }

    catch (error) {

        showError(
            "Unable to connect to backend."
        );

    }

}


// ==========================================================
// CUSTOMER - VIEW OWN ACCOUNT
// ==========================================================

async function viewMyAccount() {

    const user =
        JSON.parse(
            localStorage.getItem("user")
        );


    if (!user) {

        logout();

        return;
    }


    try {

        const response = await fetch(
            API_URL + "/customers/" + user.id
        );


        const customer =
            await response.json();


        if (!response.ok) {

            showError(
                customer.detail ||
                "Unable to get account."
            );

            return;
        }


        // Update stored customer information

        localStorage.setItem(
            "user",
            JSON.stringify(customer)
        );


        displayCustomer(
            customer
        );

    }

    catch (error) {

        showError(
            "Unable to connect to backend."
        );

    }

}


// ==========================================================
// CUSTOMER - DEPOSIT FORM
// ==========================================================

function showDeposit() {

    const area =
        document.getElementById(
            "operationArea"
        );


    area.innerHTML = `

        <h3>Deposit Money</h3>

        <input
            type="number"
            id="depositAmount"
            placeholder="Enter amount"
            min="1"
            step="0.01"
        >

        <button onclick="depositMoney()">
            Deposit
        </button>

    `;

}


// ==========================================================
// CUSTOMER - DEPOSIT
// ==========================================================

async function depositMoney() {

    const amount =
        parseFloat(
            document.getElementById(
                "depositAmount"
            ).value
        );


    if (isNaN(amount) || amount <= 0) {

        showError(
            "Enter a valid deposit amount."
        );

        return;
    }


    const user =
        JSON.parse(
            localStorage.getItem("user")
        );


    try {

        const response = await fetch(

            API_URL +
            "/customers/" +
            user.id +
            "/deposit",

            {
                method: "PUT",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    amount: amount
                })
            }

        );


        const data =
            await response.json();


        if (!response.ok) {

            showError(
                data.detail ||
                "Deposit failed."
            );

            return;
        }


        localStorage.setItem(
            "user",
            JSON.stringify(data.customer)
        );


        showSuccess(
            "Amount deposited successfully."
        );


        displayCustomer(
            data.customer
        );

    }

    catch (error) {

        showError(
            "Unable to connect to backend."
        );

    }

}


// ==========================================================
// CUSTOMER - WITHDRAW FORM
// ==========================================================

function showWithdraw() {

    const area =
        document.getElementById(
            "operationArea"
        );


    area.innerHTML = `

        <h3>Withdraw Money</h3>

        <input
            type="number"
            id="withdrawAmount"
            placeholder="Enter amount"
            min="1"
            step="0.01"
        >

        <button onclick="withdrawMoney()">
            Withdraw
        </button>

    `;

}


// ==========================================================
// CUSTOMER - WITHDRAW
// ==========================================================

async function withdrawMoney() {

    const amount =
        parseFloat(
            document.getElementById(
                "withdrawAmount"
            ).value
        );


    if (isNaN(amount) || amount <= 0) {

        showError(
            "Enter a valid withdrawal amount."
        );

        return;
    }


    const user =
        JSON.parse(
            localStorage.getItem("user")
        );


    try {

        const response = await fetch(

            API_URL +
            "/customers/" +
            user.id +
            "/withdraw",

            {
                method: "PUT",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    amount: amount
                })
            }

        );


        const data =
            await response.json();


        if (!response.ok) {

            showError(
                data.detail ||
                "Withdrawal failed."
            );

            return;
        }


        localStorage.setItem(
            "user",
            JSON.stringify(data.customer)
        );


        showSuccess(
            "Amount withdrawn successfully."
        );


        displayCustomer(
            data.customer
        );

    }

    catch (error) {

        showError(
            "Unable to connect to backend."
        );

    }

}


// ==========================================================
// DISPLAY ONE CUSTOMER
// ==========================================================

function displayCustomer(customer) {

    const result =
        document.getElementById(
            "resultArea"
        );


    result.innerHTML = `

        <h3>Customer Account</h3>

        <div class="account-box">

            <p>
                <strong>ID:</strong>
                ${customer.id}
            </p>

            <p>
                <strong>Name:</strong>
                ${customer.name}
            </p>

            <p>
                <strong>Balance:</strong>
                ₹${customer.balance}
            </p>

        </div>

    `;

}


// ==========================================================
// SUCCESS MESSAGE
// ==========================================================

function showSuccess(message) {

    const result =
        document.getElementById(
            "resultArea"
        );


    result.innerHTML = `

        <p class="success">
            ${message}
        </p>

    `;

}


// ==========================================================
// ERROR MESSAGE
// ==========================================================

function showError(message) {

    const result =
        document.getElementById(
            "resultArea"
        );


    result.innerHTML = `

        <p class="error">
            ${message}
        </p>

    `;

}