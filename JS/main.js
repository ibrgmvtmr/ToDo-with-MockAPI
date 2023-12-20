/*** 
    Main script for the To-Do List WebApp.
    - Event listeners for adding tasks, checking, and deleting tasks.
    - Functions for handling task updates and theme changes.
    - Fetches and displays user tasks from the MockAPI.
    - Saves, updates, and deletes tasks in the MockAPI.
***/

// DOM elements
const toDoInput = document.querySelector('.todo-input');
const toDoBtn = document.querySelector('.todo-btn');
const toDoList = document.querySelector('.todo-list');
const standardTheme = document.querySelector('.standard-theme');
const lightTheme = document.querySelector('.light-theme');
const darkerTheme = document.querySelector('.darker-theme');

// Event listeners
toDoBtn.addEventListener('click', addToDo);
toDoList.addEventListener('click', deleteCheck);
document.addEventListener("DOMContentLoaded", async () => {
    getTodos();
});
standardTheme.addEventListener('click', () => changeTheme('standard'));
lightTheme.addEventListener('click', () => changeTheme('light'));
darkerTheme.addEventListener('click', () => changeTheme('darker'));

// Set initial theme
let savedTheme = localStorage.getItem('savedTheme');
savedTheme === null ?
    changeTheme('standard')
    : changeTheme(localStorage.getItem('savedTheme'));

// Task ID counter
let taskIdCounter = 0; 

// Function to add a new task
function addToDo(event) {
    event.preventDefault();
    taskIdCounter++;
    // Create new task div
    const toDoDiv = document.createElement("div");
    toDoDiv.classList.add('todo', `${savedTheme}-todo`);
    toDoDiv.setAttribute('data-id', taskIdCounter); 
    // Create new task item
    const newToDo = document.createElement('li');
    if (toDoInput.value === '') {
        alert("You must write something!");
    } else {
        newToDo.innerText = toDoInput.value;
        newToDo.classList.add('todo-item');
        toDoDiv.appendChild(newToDo);
        saveTask({ id: taskIdCounter, task: toDoInput.value });
        // Create check button
        const checked = document.createElement('button');
        checked.innerHTML = '<i class="fas fa-check"></i>';
        checked.classList.add('check-btn', `${savedTheme}-button`);
        toDoDiv.appendChild(checked);
        // Create delete button
        const deleted = document.createElement('button');
        deleted.innerHTML = '<i class="fas fa-trash"></i>';
        deleted.classList.add('delete-btn', `${savedTheme}-button`);
        toDoDiv.appendChild(deleted);
        // Append task div to the list
        toDoList.appendChild(toDoDiv);
        toDoInput.value = '';    
    }
}

// Function to save a task to MockAPI
function saveTask({ id, task }) {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        console.error("User ID not found");
        return;
    }
    const endpoint = `https://6566caec64fcff8d730f1148.mockapi.io/api/v1/users/${userId}/tasks`;
    const data = { id: id, task: task };
    // Send POST request to save task
    fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Task saved successfully:', data);
        })
        .catch(error => {
            console.error('Error saving task:', error);
        });
}

// Function to handle task deletion and checking
function deleteCheck(event) {
    const item = event.target;
    if (item.classList[0] === 'delete-btn') {
        const taskId = item.parentElement.getAttribute('data-id');
        const userId = localStorage.getItem('userId');
        deleteTask(userId, taskId);
        item.parentElement.classList.add("fall");
        item.parentElement.addEventListener('transitionend', function () {
            item.parentElement.remove();
        });
    }
    if (item.classList[0] === 'check-btn') {
        item.parentElement.classList.toggle("completed");
        const taskId = item.parentElement.getAttribute('data-id');
        updateTaskStatus(taskId, true);
    }
}

// Function to update task status in MockAPI
function updateTaskStatus(taskId, isDone) {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        console.error("User ID not found");
        return;
    }
    const endpoint = `https://6566caec64fcff8d730f1148.mockapi.io/api/v1/users/${userId}/tasks/${taskId}`;
    const data = { isDone: isDone };
    // Send PUT request to update task status
    fetch(endpoint, {
            method: 'PUT', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            console.log('Task status updated successfully');
            return response.json();
        })
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('Error updating task status:', error);
        });
}

// Function to fetch and display user tasks from MockAPI
async function getTodos() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        console.error("User ID not found");
        return;
    }
    try {
        const tasks = await fetchUserTasks(userId);
        // Clear existing list
        toDoList.innerHTML = '';
        // Add tasks to the list
        tasks.forEach(function (task) {
            const toDoDiv = document.createElement("div");
            toDoDiv.classList.add("todo", `${savedTheme}-todo`);
            toDoDiv.setAttribute('data-id', task.id);
            const newToDo = document.createElement('li');
            newToDo.innerText = task.task;
            newToDo.classList.add('todo-item');
            toDoDiv.appendChild(newToDo);
            const checked = document.createElement('button');
            checked.innerHTML = '<i class="fas fa-check"></i>';
            checked.classList.add("check-btn", `${savedTheme}-button`);
            toDoDiv.appendChild(checked);
            const deleted = document.createElement('button');
            deleted.innerHTML = '<i class="fas fa-trash"></i>';
            deleted.classList.add("delete-btn", `${savedTheme}-button`);
            toDoDiv.appendChild(deleted);
            toDoList.appendChild(toDoDiv);
        });
    } catch (error) {
        console.error('Error getting todos:', error);
    }
}

// Function to fetch user tasks from MockAPI
async function fetchUserTasks(userId) {
    if (!userId) {
        console.error("User ID not found");
        return Promise.reject("User ID not found");
    }
    const endpoint = `https://6566caec64fcff8d730f1148.mockapi.io/api/v1/users/${userId}/tasks`;
    try {
        const response = await fetch(endpoint);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Tasks retrieved successfully:', data);
        return data;
    } catch (error) {
        console.error('Error fetching tasks:', error);
        throw error;
    }
}

// Function to delete a task from MockAPI
function deleteTask(userId, taskId) {
    if (!userId) {
        console.error("User ID not found");
        return;
    }
    const endpoint = `https://6566caec64fcff8d730f1148.mockapi.io/api/v1/users/${userId}/tasks/${taskId}`;
    // Send DELETE request to delete task
    fetch(endpoint, {
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            console.log('Task deleted successfully');
            return response.json();
        })
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('Error deleting task:', error);
        });
}

// Function to change the theme of the app
function changeTheme(color) {
    localStorage.setItem('savedTheme', color);
    savedTheme = localStorage.getItem('savedTheme');
    document.body.className = color;
    // Add darker title style for the darker theme
    color === 'darker' ? 
        document.getElementById('title').classList.add('darker-title')
        : document.getElementById('title').classList.remove('darker-title');
    // Apply theme to input and buttons
    document.querySelector('input').className = `${color}-input`;
    document.querySelectorAll('.todo').forEach(todo => {
        // Apply theme to todo items
        Array.from(todo.classList).some(item => item === 'completed') ? 
            todo.className = `todo ${color}-todo completed`
            : todo.className = `todo ${color}-todo`;
    });
    // Apply theme to buttons
    document.querySelectorAll('button').forEach(button => {
        Array.from(button.classList).some(item => {
            if (item === 'check-btn') {
                button.className = `check-btn ${color}-button`;  
            } else if (item === 'delete-btn') {
                button.className = `delete-btn ${color}-button`; 
            } else if (item === 'todo-btn') {
                button.className = `todo-btn ${color}-button`;
            }
        });
    });
}
