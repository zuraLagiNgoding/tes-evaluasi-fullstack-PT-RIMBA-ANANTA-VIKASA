window.onload = () => {
    const loginForm = document.getElementById("loginForm");
    const email = document.getElementById("email");
    const emailInvalid = document.getElementById("emailInvalid");
    const password = document.getElementById("password");
    const passwordInvalid = document.getElementById("passwordInvalid");

    if (
        !loginForm ||
        !email ||
        !password ||
        !emailInvalid ||
        !passwordInvalid
    ) {
        return;
    }

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        fetch("http://localhost:8000/api/login", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email.value,
                password: password.value,
            }),
        }).then((res) => {
            if (res.status === 200) {
                res.json().then((resBody) => {
                    document.cookie = `token=${resBody.access_token}; path=/`;
                    document.cookie = `role=${resBody.role}; path=/`;

                    switch (resBody.role) {
                        case "staff":
                        case "admin":
                            window.location.href = "users.html";
                            break;
                        case "manager":
                            window.location.href = "tasks.html";
                            break;
                    }
                });
            } else if (res.status === 422) {
                res.json().then((resBody) => {
                    if ("email" in resBody.errors) {
                        emailInvalid.innerText = resBody.errors["email"][0];
                    }
                    if ("password" in resBody.errors) {
                        passwordInvalid.innerText =
                            resBody.errors["password"][0];
                    }
                });
            }
        });
    });
};
