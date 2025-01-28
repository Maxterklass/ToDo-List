const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

// Appeler AddTask lorsqu'on appuie sur "Entrée"
inputBox.addEventListener("keydown", function (e) {
    if (e.key === "Enter") { // Vérifier si la touche appuyée est "Enter"
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
        listContainer.appendChild(li);

        let span = document.createElement("span");
        span.innerHTML = "\u00d7";
        li.appendChild(span);

        addDragAndDropListeners(li); // Ajouter les gestionnaires de glisser-déposer
    }
    inputBox.value = "";
    saveData();
}

listContainer.addEventListener("click", function (e) {
    if (e.target.tagName === "LI") {
        e.target.classList.toggle("checked");
        saveData();
    } else if (e.target.tagName === "SPAN") {
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
