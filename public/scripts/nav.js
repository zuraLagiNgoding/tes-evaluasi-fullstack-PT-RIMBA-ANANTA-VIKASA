function createNavItem(href, icon, label) {
    const navItem = document.createElement("li");
    navItem.classList.add("nav-item");
    const navLink = document.createElement("a");
    navLink.classList.add("nav-link", "text-light", "rounded", "mx-2", "mb-1");
    navLink.href = href;
    const navIcon = document.createElement("i");
    navIcon.classList.add("bi", icon, "me-2");
    navLink.appendChild(navIcon);
    const navLabel = document.createElement("span");
    navLabel.innerText = label;
    navLink.appendChild(navLabel);
    navItem.appendChild(navLink);

    return navItem;
}

const tasksNav = createNavItem(
    "tasks.html",
    "bi-clipboard-check",
    "Daftar Task"
);
const newTaskNav = createNavItem(
    "new-task.html",
    "bi-clipboard-plus",
    "Buat Task"
);
const usersNav = createNavItem("users.html", "bi-person", "Daftar User");
const newUserNav = createNavItem(
    "new-user.html",
    "bi-person-add",
    "Tambah User"
);

window.onload = () => {
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

    const nav = document.getElementById("nav");
    if (nav !== null) {
        switch (role) {
            case "admin":
                nav.appendChild(usersNav);
                nav.appendChild(newUserNav);
                nav.appendChild(tasksNav);
                nav.appendChild(newTaskNav);
                break;
            case "manager":
            case "staff":
                nav.appendChild(tasksNav);
                nav.appendChild(newTaskNav);
                break;
        }

        const logout = document.createElement("li");
        logout.classList.add("nav-item");
        const logoutButton = document.createElement("button");
        logoutButton.addEventListener("click", function () {
            fetch("http://localhost:8000/api/logout", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }).then((res) => {
                if (res.status === 200) {
                    document.cookie = "";
                    window.location.href = "login.html";
                }
            });
        });
        logoutButton.classList.add(
            "nav-link",
            "text-light",
            "active",
            "bg-primary",
            "rounded",
            "mx-2",
            "mb-1"
        );
        const navIcon = document.createElement("i");
        navIcon.classList.add("bi", "bi-box-arrow-left", "me-2");
        logoutButton.appendChild(navIcon);
        const navLabel = document.createElement("span");
        navLabel.innerText = "Keluar";
        logoutButton.appendChild(navLabel);
        logout.appendChild(logoutButton);
        nav.appendChild(logout);
    }
};
