let token = null;
let role = null;
const cookieParts = document.cookie.split("; ");
for (const cookiePart of cookieParts) {
    const [key, value] = cookiePart.split("=", 2);
    if (key === "token") {
        token = value;
    } else if (key === "role") {
        role = value;
    }
}
if (token === null || role === null) {
    window.location.href = "login.html";
    return;
}

const logout = document.getElementById("logout");
if (logout !== null) {
    logout.addEventListener("click", function () {
        fetch("http://localhost:8000/api/logout", {
            method: "POST",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
        }).then((res) => {
            if (res.status === 200) {
                document.cookie = "";
            }
        });
    });
}

const usersTableBody = document.getElementById("usersTableBody");
if (usersTableBody !== null) {
    fetch("http://localhost:8000/api/users", {
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
        },
    }).then((res) => {
        if (res.status === 200) {
            res.json().then((resBody) => {
                for (const user of resBody.data) {
                    const tr = document.createElement("tr");

                    // Name
                    const nameTd = document.createElement("td");
                    nameTd.innerText = user.name;
                    tr.appendChild(nameTd);

                    // Email
                    const emailTd = document.createElement("td");
                    emailTd.innerText = user.email;
                    tr.appendChild(emailTd);

                    // Role
                    const roleTd = document.createElement("td");
                    roleTd.innerText = user.role;
                    tr.appendChild(roleTd);

                    // Status
                    const statusTd = document.createElement("td");
                    const statusBadge = document.createElement("span");
                    statusBadge.classList.add("badge");
                    if (user.status === 1) {
                        statusBadge.classList.add("bg-info");
                        statusBadge.innerText = "Active";
                    } else {
                        statusBadge.classList.add("bg-warning");
                        statusBadge.innerText = "Inactive";
                    }
                    statusTd.appendChild(statusBadge);
                    tr.appendChild(statusTd);

                    // Actions
                    const actionTd = document.createElement("td");

                    tr.appendChild(actionTd);
                    usersTableBody.appendChild(tr);
                }
            });
        }
    });
}
