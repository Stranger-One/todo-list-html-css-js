document.addEventListener('DOMContentLoaded', () => {

    const setDateAndTime = () => {
        let date = new Date()
        let curDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
        let ampm = date.getHours() > 12 ? "PM" : "AM"
        let curTime = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} ${ampm}`
        document.querySelector(".date span").textContent = curDate
        document.querySelector(".time span").textContent = curTime
    }
    setInterval(() => {
        setDateAndTime()
    }, 1000);

    function formatDateTime() {
        const now = new Date();

        // Get day, month, and year
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0'); // January is 0!
        const year = now.getFullYear();

        // Get hours, minutes, and am/pm
        let hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'pm' : 'am';

        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        const formattedHours = String(hours).padStart(2, '0');

        // Combine all parts
        const formattedDate = `${day}/${month}/${year}`;
        const formattedTime = `${formattedHours}:${minutes} ${ampm}`;



        return `${formattedDate} ${formattedTime}`;
    }

    let form = document.getElementById('todo-form');
    let input = document.getElementById('todo-input');
    let todoList = document.getElementById('list');

    // Load tasks from LocalStorage
    const savedTasks = JSON.parse(localStorage.getItem('todos')) || [];
    savedTasks.forEach(task => addTaskToList(task));

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskText = input.value.trim();
        if (taskText === '') return;

        const task = {
            id: Date.now(),
            text: taskText,
            time: formatDateTime(),
            isDone: false
        };

        addTaskToList(task);
        saveTaskToLocalStorage(task);
        input.value = '';
    });



    function addTaskToList(task) {
        const todo = `
            <div class="task" id="${task.id}">
                <p class="task-text ${task.isDone ? 'done' : ''}">${task.text}</p>
                <div class="buttons">
                        <h4>Created At: <span>${task.time}</span> </h4>
                        <input type="checkbox">
                        <button class="edit-task"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg></button>
                        <button class="delete-task"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg></button>
                </div>
            </div>
        `;
        todoList.innerHTML = todo + todoList.innerHTML
    }

    function saveTaskToLocalStorage(task) {
        const tasks = JSON.parse(localStorage.getItem('todos')) || [];
        tasks.push(task);
        localStorage.setItem('todos', JSON.stringify(tasks));
    }

    todoList.addEventListener("click", (e) => {
        console.log(e.target)
        if (e.target.classList.contains("delete-task")) {
            // console.log(e.target.parentElement.parentElement.id)
            const taskID = e.target.parentElement.parentElement.id
            deleteTaskFromLocalStorage(taskID)
            deleteTaskFromDOM(taskID)
        }
        else if (e.target.classList.contains("edit-task")) {
            // console.log(e.target.parentElement.parentElement.id)
            const taskID = e.target.parentElement.parentElement.id
            editTask(taskID)
        }
        else if (e.target.tagName === 'INPUT') {
            const taskID = e.target.parentElement.parentElement.id
            const taskElement = document.getElementById(taskID).querySelector(".task-text");

            if (e.target.checked) {
                taskElement.classList.add('done');
            } else {
                taskElement.classList.remove('done');

            }

        }
    })

    const deleteTaskFromLocalStorage = (taskID) => {
        const tasks = JSON.parse(localStorage.getItem('todos')) || [];
        const filteredTasks = tasks.filter((task) => task.id !== parseInt(taskID));
        localStorage.setItem('todos', JSON.stringify(filteredTasks));
    }
    const deleteTaskFromDOM = (taskID) => {
        const taskElement = document.getElementById(taskID);
        taskElement.remove();
    }

    const editTask = (taskID) => {
        const taskElement = document.getElementById(taskID);
        input.value = taskElement.querySelector('p').textContent;
        input.focus();
        deleteTaskFromDOM(taskID)
        deleteTaskFromLocalStorage(taskID)
    }

});
