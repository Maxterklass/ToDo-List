const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

// Appeler AddTask lorsqu'on appuie sur "Entrée"
inputBox.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        AddTask();
    }
});

function AddTask() {
    if (inputBox.value === '') {
        alert("You must write something!");
    } else {
        let li = document.createElement("li");
        li.innerHTML = inputBox.value;
        li.setAttribute("draggable", "true"); // Rendre l'élément déplaçable

        // Ajouter un bouton "+" pour ajouter des sous-tâches
        let addSubTaskButton = document.createElement("button");
        addSubTaskButton.innerHTML = "+";
        addSubTaskButton.className = "add-subtask";
        addSubTaskButton.onclick = function () {
            addSubTask(li);
        };

        li.appendChild(addSubTaskButton);
        listContainer.appendChild(li);

        // Ajouter la croix pour supprimer la tâche principale
        let span = document.createElement("span");
        span.innerHTML = "\u00d7";
        li.appendChild(span);

        addDragAndDropListeners(li); // Ajouter les gestionnaires de glisser-déposer
    }
    inputBox.value = "";
    saveData();
}

function addSubTask(parentTask) {
    let subTaskText = prompt("Enter your sub-task:");
    if (subTaskText) {
        let subTaskList = parentTask.querySelector("ul");
        if (!subTaskList) {
            subTaskList = document.createElement("ul");
            parentTask.appendChild(subTaskList);
        }

        let subTaskItem = document.createElement("li");
        subTaskItem.innerHTML = subTaskText;

        // Ajouter la croix pour supprimer la sous-tâche
        let subTaskSpan = document.createElement("span");
        subTaskSpan.innerHTML = "\u00d7";
        subTaskItem.appendChild(subTaskSpan);

        subTaskList.appendChild(subTaskItem);

        saveData();
    }
}

listContainer.addEventListener("click", function (e) {
    if (e.target.tagName === "LI") {
        // Basculer l'état "checked" pour les tâches principales et les sous-tâches
        e.target.classList.toggle("checked");
        saveData();
    } else if (e.target.tagName === "SPAN") {
        // Supprimer la tâche principale ou la sous-tâche
        e.target.parentElement.remove();
        saveData();
    }
}, false);

function saveData() {
    localStorage.setItem("data", listContainer.innerHTML);
}

function showTask() {
    listContainer.innerHTML = localStorage.getItem("data");
    let tasks = listContainer.querySelectorAll("li");
    tasks.forEach((task) => {
        addDragAndDropListeners(task); // Réappliquer les gestionnaires après rechargement

        // Réattacher le bouton "+" pour les sous-tâches
        let addSubTaskButton = task.querySelector(".add-subtask");
        if (addSubTaskButton) {
            addSubTaskButton.onclick = function () {
                addSubTask(task);
            };
        }

        // Réattacher les gestionnaires de suppression pour les sous-tâches
        let subTasks = task.querySelectorAll("ul li");
        subTasks.forEach((subTask) => {
            let subTaskSpan = subTask.querySelector("span");
            if (subTaskSpan) {
                subTaskSpan.onclick = function () {
                    subTask.remove();
                    saveData();
                };
            }
        });
    });
}

// Ajouter les gestionnaires de glisser-déposer à un élément <li>
function addDragAndDropListeners(li) {
    li.addEventListener("dragstart", dragStart);
    li.addEventListener("dragover", dragOver);
    li.addEventListener("drop", drop);
}

// Stocke l'élément actuellement glissé
let draggedItem = null;

function dragStart(e) {
    draggedItem = this;
    this.classList.add("dragging"); // Ajouter la classe CSS
    setTimeout(() => {
        this.style.display = "none";
    }, 0);
}

function dragOver(e) {
    e.preventDefault(); // Permet le drop
}

function drop(e) {
    e.preventDefault();
    if (this !== draggedItem) {
        const allItems = Array.from(listContainer.children);
        const draggedIndex = allItems.indexOf(draggedItem);
        const targetIndex = allItems.indexOf(this);

        if (draggedIndex < targetIndex) {
            this.after(draggedItem);
        } else {
            this.before(draggedItem);
        }

        saveData();
    }
    draggedItem.style.display = "block";
    draggedItem.classList.remove("dragging"); // Retirer la classe CSS
    draggedItem = null;
}

showTask();
