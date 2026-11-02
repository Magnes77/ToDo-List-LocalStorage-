```javascript
// Pobieranie elementow HTML

const input = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const todoList = document.getElementById("todo-list");
const count = document.getElementById("count");

const clearCompletedBtn = document.getElementById("clear-completed");
const clearAllBtn = document.getElementById("clear-all");


// Wczytanie zadan z localStorage

let todos = JSON.parse(localStorage.getItem("todos")) || [];

showTodos();


// Dodawanie zadania

addBtn.addEventListener("click", addTodo);

input.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        addTodo();
    }
});

function addTodo() {

    const task = input.value.trim();

    if (task === "") {
        return;
    }

    const newTodo = {
        id: Date.now(),
        text: task,
        completed: false
    };

    todos.push(newTodo);

    input.value = "";

    saveTodos();
    showTodos();
}


// Wyswietlanie zadan

function showTodos() {

    todoList.innerHTML = "";

    if (todos.length === 0) {

        todoList.innerHTML = '<li class="empty">No tasks yet. Add something!</li>';

    } else {

        todos.forEach(function(todo) {

            const li = document.createElement("li");
            li.className = "todo-item";

            const left = document.createElement("div");
            left.className = "task-left";

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = todo.completed;

            checkbox.addEventListener("change", function() {
                toggleTodo(todo.id);
            });

            const text = document.createElement("span");
            text.className = "task-text";

            if (todo.completed) {
                text.classList.add("completed");
            }

            text.textContent = todo.text;

            // Edytowanie zadania po dwukrotnym kliknieciu

            text.addEventListener("dblclick", function() {
                editTodo(todo.id);
            });

            left.appendChild(checkbox);
            left.appendChild(text);

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.className = "delete-btn";

            deleteBtn.addEventListener("click", function() {
                deleteTodo(todo.id);
            });

            li.appendChild(left);
            li.appendChild(deleteBtn);

            todoList.appendChild(li);

        });

    }

    // Liczenie wszystkich zadan

    const completed = todos.filter(function(todo) {
        return todo.completed;
    }).length;

    count.textContent = todos.length + " tasks, " + completed + " completed";
}


// Zmiana statusu zadania

function toggleTodo(id) {

    todos.forEach(function(todo) {

        if (todo.id === id) {
            todo.completed = !todo.completed;
        }

    });

    saveTodos();
    showTodos();
}


// Usuwanie pojedynczego zadania

function deleteTodo(id) {

    todos = todos.filter(function(todo) {
        return todo.id !== id;
    });

    saveTodos();
    showTodos();
}


// Edytowanie zadania

function editTodo(id) {

    const todo = todos.find(function(item) {
        return item.id === id;
    });

    if (!todo) {
        return;
    }

    const newText = prompt("Edit your task:", todo.text);

    if (newText !== null && newText.trim() !== "") {

        todo.text = newText.trim();

        saveTodos();
        showTodos();

    }

}


// Usuwanie wykonanych zadan

clearCompletedBtn.addEventListener("click", function() {

    todos = todos.filter(function(todo) {
        return !todo.completed;
    });

    saveTodos();
    showTodos();

});


// Usuwanie wszystkich zadan

clearAllBtn.addEventListener("click", function() {

    if (confirm("Are you sure you want to delete all tasks?")) {

        todos = [];

        saveTodos();
        showTodos();

    }

});


// Zapisywanie danych w localStorage

function saveTodos() {

    localStorage.setItem("todos", JSON.stringify(todos));

}
```