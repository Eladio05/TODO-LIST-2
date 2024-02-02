document.addEventListener('DOMContentLoaded', function () {
    loadFirst();
    document.getElementById('add-task-btn').addEventListener('click', function () {
        const title = document.getElementById('title-input').value;
        const finalDate = document.getElementById('final_date-input').value;
        if (title && finalDate) {
            const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            const id = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1;
            const task = { id: id, title: title, finalDate: finalDate };
            display(task);
            save(task);
            document.getElementById('title-input').value = '';
            document.getElementById('final_date-input').value = '';
        } 
        else {
            alert('Please fill all fields.');
        }
    });
});

function save(task) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function remind(tasks) {
    let message = "";
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    tasks.forEach(task => {
        const due = new Date(task.finalDate);
        due.setHours(0, 0, 0, 0);
        const timeDiff = due - today;
        const daysDiff = Math.round(timeDiff / (1000 * 3600 * 24));
        if (daysDiff === 0) {
            message += `The task "${task.title}" is due today !\n`;
        } 
        else if (daysDiff < 0) {
            message += `The task "${task.title}" is ${Math.abs(daysDiff)} day(s) overdue !\n`;
        } 
        else {
            message += `The task "${task.title}" still has ${daysDiff} day(s) until its due date.\n`;
        }
        
    });
    if (message) {
        alert(message);
    }
}

function loadFirst() {
    const table = document.getElementById('task-table').getElementsByTagName('tbody')[0];
    table.innerHTML = '';
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        display(task);
    });
    setTimeout(function() {
        remind(tasks);
    }, 2000);
}


function load() {
    const table = document.getElementById('task-table').getElementsByTagName('tbody')[0];
    table.innerHTML = '';
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        display(task);
    });
}

function display(task) {
    const table = document.getElementById('task-table').getElementsByTagName('tbody')[0];
    const row = table.insertRow();
    row.setAttribute('id', `task-${task.id}`);
    row.innerHTML = `
        <td>${task.id}</td>
        <td><span data-id="${task.id}" data-field="title" title="${task.title}">${task.title}</span></td>
        <td>${task.finalDate}</td>
        <td>   
            <button class="edit-btn" onclick="edit(${task.id}, this)">Edit</button>
            <button class="delete-btn" onclick="deleteTask(${task.id})"><img src="assets/trash_icon.png"></button>
        </td>
    `;
}

function deleteTask(id) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task.id !== id);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    load();
}


function edit(taskId, element) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
        const newTitle = prompt("Enter new title", tasks[taskIndex].title);
        const newFinalDateStr = prompt("Enter new due date (YYYY-MM-DD)", tasks[taskIndex].finalDate);
        const newFinalDate = new Date(newFinalDateStr);
        if (newFinalDate.toString() === "Invalid Date") {
            alert("The entered date is not valid.");
            return;
        }
        if (newTitle && newFinalDateStr) {
            tasks[taskIndex].title = newTitle;
            tasks[taskIndex].finalDate = newFinalDateStr;
            localStorage.setItem('tasks', JSON.stringify(tasks));
            load();
        } 
        else {
            alert("Title and due date cannot be empty.");
        }
    }
}
