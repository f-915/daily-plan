const time = document.getElementById('timeInput');
const task = document.getElementById('taskInput');
const notes = document.getElementById('notesInput');
const submit = document.getElementById('addButton');
const tbody = document.querySelector('#taskList');
const errorText = document.getElementById('errorText');

let saveData = localStorage.getItem("allItems");

let tasks = [];
let editingIndex = null;

if (saveData) {

    saveData = JSON.parse(saveData);

    tasks = saveData;

};

function saveTasks() {

    const jsonString = JSON.stringify(tasks);

    localStorage.setItem("allItems", jsonString);

};

function renderTasks() {

    tasks.sort(function(a, b) {

        function convertTime(timeString) {

            const parts = timeString.split(':');

            let hour = Number(parts[0]);
            const minute = Number(parts[1]);

            if (hour < 2) {
                hour += 24;
            };

            return hour * 60 + minute;
        }

        const aTime = convertTime(a.time);
        const bTime = convertTime(b.time);

        return aTime - bTime;

    });

    tbody.innerHTML = '';

    if (tasks.length === 0) {

        const ntTr = document.createElement('tr');
        const ntTd = document.createElement('td');

        ntTd.classList.add('ntTd');

        ntTd.colSpan = 4;

        ntTd.textContent = 'no tasks...';

        ntTr.appendChild(ntTd);

        tbody.appendChild(ntTr);        

    };

    for (let i = 0; i < tasks.length; i++) {

        const currentTask = tasks[i];
        const tr = document.createElement('tr');
        const editButton = document.createElement('button');
        const deleteButton = document.createElement('button');

        editButton.textContent = '✎';
        editButton.classList.add('edit-button');

        editButton.addEventListener ('click', function() {

            time.value = currentTask.time;
            task.value = currentTask.task;
            notes.value = currentTask.notes;

            editingIndex = i;

        });

        const values = [
            currentTask.time,
            currentTask.task,
            currentTask.notes
        ];

        deleteButton.textContent = '×';
        deleteButton.classList.add('delete-button');

        deleteButton.addEventListener ('click', function() {

            tasks.splice(i, 1);

            saveTasks();

            renderTasks();

        });

        values.forEach(function(value) {

            const td = document.createElement('td');

            td.textContent = value;

            tr.appendChild(td);

        });

        const ButtonTd = document.createElement('td');
        ButtonTd.classList.add('buttons');

        ButtonTd.appendChild(editButton);
        ButtonTd.appendChild(deleteButton);

        tr.appendChild(ButtonTd);

        tbody.appendChild(tr);

    };
};

renderTasks();

function addTask() {

    if (time.value === '' || task.value === '') {

        errorText.textContent = 'Error! time or task is blank.';
        return;

    } else {

        errorText.textContent = '';

    };

    const item = {
        time: time.value,
        task: task.value,
        notes: notes.value
    };

    if (editingIndex === null) {

        tasks.push(item);

    } else {

        tasks[editingIndex] = item;
        editingIndex = null;

    };

    saveTasks();

    renderTasks();

    time.value = '';
    task.value = '';
    notes.value = '';

};

submit.addEventListener('click', addTask);

notes.addEventListener('keydown', function(event) {

    if (event.key === 'Enter') {

        addTask();

    };

});