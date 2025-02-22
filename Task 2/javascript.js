let taskId = 1;

document.querySelector(".todo-list").classList.add("hide");

const dom = {
    todoBody: document.getElementById("todo-list"),
    todoName: document.getElementById("name"),
    todoDescri: document.getElementById("description"),
};

dom.todoBody.addEventListener("click", (event) => {
    const target = event.target;
    const taskId = target.dataset.id;

    if (!taskId) return;

    if (target.classList.contains("delete")) {
        deleteTask(taskId);
    } else if (target.classList.contains("edit")) {
        editTask(taskId);
    } else if (target.classList.contains("save")) {
        saveTask(taskId);
    }
});

dom.todoBody.addEventListener("change", (event) => {
    if (event.target.classList.contains("task-checkbox")) {
        toggleTaskCompletion(event.target.dataset.id, event.target.checked);
    }
});

function createTask() {
    if (taskId == 1) {
        document.querySelector(".todo-list").classList.remove("hide");
    }

    const name = dom.todoName.value.trim();
    const description = dom.todoDescri.value.trim();
    if (!name) return;

    addTaskItem({ id: taskId++, name, description });
    clearInputs();
}

function addTaskItem(task) {
    const listItem = document.createElement("li");
    listItem.dataset.id = task.id;
    listItem.setAttribute("draggable", "true");

    listItem.innerHTML = `
    <input type="checkbox" class="task-checkbox" data-id="${task.id}" />
    <div class="task-details">
        <span class="task-name" id="name-${task.id}">${task.name}</span>
        <span class="task-desc" id="descri-${task.id}">${task.description}</span>
    </div>
    <div class="task-actions">
        <button class="edit" data-id="${task.id}">
            <i class="fas fa-pencil-alt"></i> Edit
        </button>
        <button class="delete" data-id="${task.id}">
            <i class="fas fa-trash"></i> Delete
        </button>
    </div>
`;

    listItem.addEventListener("dragstart", startDrag);
    listItem.addEventListener("dragover", dragOver);
    listItem.addEventListener("drop", dropTask);

    dom.todoBody.appendChild(listItem);
}

function editTask(taskId) {
    const nameElement = document.getElementById(`name-${taskId}`);
    const descriElement = document.getElementById(`descri-${taskId}`);
    const editButton = document.querySelector(`button.edit[data-id="${taskId}"]`);

    nameElement.contentEditable = "true";
    descriElement.contentEditable = "true";
    nameElement.classList.add("editing");
    descriElement.classList.add("editing");

    editButton.innerHTML = `<i class="fas fa-check"></i> Save`;
    editButton.classList.replace("edit", "save");
}

function saveTask(taskId) {
    const nameElement = document.getElementById(`name-${taskId}`);
    const descriElement = document.getElementById(`descri-${taskId}`);
    const saveButton = document.querySelector(`button.save[data-id="${taskId}"]`);

    nameElement.contentEditable = "false";
    descriElement.contentEditable = "false";
    nameElement.classList.remove("editing");
    descriElement.classList.remove("editing");

    saveButton.innerHTML = `<i class="fas fa-pencil-alt"></i> Edit`;
    saveButton.classList.replace("save", "edit");
}

function deleteTask(taskId) {
    document.querySelector(`li[data-id="${taskId}"]`)?.remove();
}

function clearInputs() {
    dom.todoName.value = "";
    dom.todoDescri.value = "";
    dom.todoName.focus();
}

function toggleTaskCompletion(taskId, isChecked) {
    document.querySelector(`li[data-id="${taskId}"]`).classList.toggle("completed", isChecked);
}

let draggedTask = null;

function startDrag(event) {
    draggedTask = event.target;
    event.dataTransfer.effectAllowed = "move";
}

function dragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
}

function dropTask(event) {
    event.preventDefault();
    if (!draggedTask || draggedTask === event.target.closest("li")) return;

    const list = dom.todoBody;
    const allTasks = Array.from(list.children);
    const targetTask = event.target.closest("li");

    if (allTasks.indexOf(draggedTask) > allTasks.indexOf(targetTask)) {
        list.insertBefore(draggedTask, targetTask);
    } else {
        list.insertBefore(draggedTask, targetTask.nextSibling);
    }
}
