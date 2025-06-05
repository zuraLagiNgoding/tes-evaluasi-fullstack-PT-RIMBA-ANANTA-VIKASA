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
  if (
    token === null ||
    role === null ||
    !(role === "admin" || role === "manager")
  ) {
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

  const newTaskForm = document.getElementById("newTaskForm");
  const title = document.getElementById("title");
  const titleInvalid = document.getElementById("titleInvalid");
  const description = document.getElementById("description");
  const descriptionInvalid = document.getElementById("descriptionInvalid");
  const assignedTo = document.getElementById("assignedTo");
  const assignedToInvalid = document.getElementById("assignedToInvalid");
  const dueDate = document.getElementById("dueDate");
  const dueDateInvalid = document.getElementById("dueDateInvalid");

  if (assignedTo !== null) {
    fetch("http://localhost:8000/api/users", {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => {
      if (res.status === 200) {
        res.json().then((resBody) => {
          for (const user of resBody.data) {
            const option = document.createElement("option");
            option.value = user.id;
            option.innerText = user.name;
            assignedTo.appendChild(option);
          }
        });
      }
    });
  }

  if (
    newTaskForm !== null &&
    title !== null &&
    titleInvalid !== null &&
    description !== null &&
    descriptionInvalid !== null &&
    assignedTo !== null &&
    assignedToInvalid !== null &&
    dueDate !== null &&
    dueDateInvalid !== null
  ) {
    newTaskForm.addEventListener("submit", (e) => {
      e.preventDefault();

      fetch("http://localhost:8000/api/tasks", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.value,
          description: description.value,
          assigned_to: assignedTo.value,
          due_date: dueDate.value,
        }),
      }).then((res) => {
        if (res.status === 422) {
          res.json().then((resBody) => {
            if ("title" in resBody.errors) {
              titleInvalid.innerText = resBody.errors["title"][0];
            }
            if ("description" in resBody.errors) {
              descriptionInvalid.innerText = resBody.errors["description"][0];
            }
            if ("assigned_to" in resBody.errors) {
              assignedToInvalid.innerText = resBody.errors["assigned_to"][0];
            }
            if ("due_date" in resBody.errors) {
              dueDateInvalid.innerText = resBody.errors["due_date"][0];
            }
          });
        }
      });
    });
  }
};
