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

  const tasksTableBody = document.getElementById("tasksTableBody");
  if (tasksTableBody !== null) {
    fetch("http://localhost:8000/api/tasks", {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => {
      if (res.status === 200) {
        res.json().then((resBody) => {
          for (const task of resBody.data) {
            const tr = document.createElement("tr");
            const titleTd = document.createElement("td");
            titleTd.innerText = task.title;
            tr.appendChild(titleTd);
            const descriptionTd = document.createElement("td");
            descriptionTd.innerText = task.description;
            tr.appendChild(descriptionTd);
            const dueDateTd = document.createElement("td");
            dueDateTd.innerText = task.due_date;
            tr.appendChild(dueDateTd);
            const statusTd = document.createElement("td");
            const statusBadge = document.createElement("span");
            statusBadge.classList.add("badge");
            if (task.status === "pending") {
              statusBadge.classList.add("bg-warning");
              statusBadge.innerText = "Pending";
            } else if (task.status === "in_proggress") {
              statusBadge.classList.add("bg-info");
              statusBadge.innerText = "In Progress";
            } else if (task.status === "done") {
              statusBadge.classList.add("bg-success");
              statusBadge.innerText = "Done";
            }
            statusTd.appendChild(statusBadge);
            tr.appendChild(statusTd);
            const actionTd = document.createElement("td");
            const editButton = document.createElement("a");
            editButton.classList.add(
              "btn",
              "btn-sm",
              "btn-warning",
              "text-white",
              "me-1"
            );
            editButton.href = "edit-task.html";
            const editButtonIcon = document.createElement("i");
            editButtonIcon.classList.add("bi bi-pencil");
            editButton.appendChild(editButtonIcon);
            actionTd.appendChild(editButton);
            if (role === "manager" || role === "admin") {
              const deleteButton = document.createElement("button");
              deleteButton.classList.add(
                "btn",
                "btn-sm",
                "btn-danger",
                "text-white"
              );
              deleteButton.addEventListener("click", () => {
                fetch(`http://localhost:8000/api/tasks/${task.id}`, {
                  method: "POST",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({
                    _method: "DELETE",
                  }),
                }).then((res) => {
                  if (res.status === 200) {
                    tr.remove();
                  }
                });
              });
              const deleteButtonIcon = document.createElement("i");
              deleteButtonIcon.classList.add("bi bi-trash");
              deleteButton.appendChild(deleteButtonIcon);
              actionTd.appendChild(deleteButton);
            }
            tr.appendChild(actionTd);
            tasksTableBody.appendChild(tr);
          }
        });
      }
    });
  }
};
