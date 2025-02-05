const inputBox = document.getElementById('input-box');
const listContainer = document.getElementById('list-container');
const dueDateInput = document.getElementById('due-date');

function addTask() {
    const taskText = inputBox.value;
    const dueDate = dueDateInput.value;
    
    if(taskText === '') {
        alert('Steve says please enter a task');
        return;
    }
    
    // Create the task element
    let li = document.createElement("li");
    li.innerHTML = taskText;
    
    // Save the task and its due date as a data attribute
    li.setAttribute('data-due-date', dueDate);

    // Display the task's due date
    let dueDateSpan = document.createElement('p');
    dueDateSpan.classList.add('due-date');
    dueDateSpan.innerHTML = `Due: ${dueDate}`;
    li.appendChild(dueDateSpan);
    
    listContainer.appendChild(li);
    
    // Add delete button (×)
    let span = document.createElement("span");
    span.innerHTML = "\u00d7";
    li.appendChild(span);
    
    inputBox.value = "";
    dueDateInput.value = ""; // Reset the due date input field
    saveData();
    setReminder(dueDate, taskText);
}

function setReminder(dueDate, taskText) {
    // Only set a reminder if there's a due date
    if(dueDate) {
        const now = new Date();
        const dueDateTime = new Date(dueDate).getTime();
        
        if(dueDateTime > now.getTime()) {
            const timeDifference = dueDateTime - now.getTime();

            // Schedule the reminder
            setTimeout(() => {
                // Notify the user when the due date arrives
                new Notification("Reminder: " + taskText, {
                    body: `The task "${taskText}" is due now!`,
                });
            }, timeDifference);
        }
    }
}

listContainer.addEventListener("click", function(e) {
    if(e.target.tagName ==="LI") {
        e.target.classList.toggle("checked");
    }
    else if(e.target.tagName === "SPAN") {
        e.target.parentElement.remove();
        saveData();
    }
}, false);

// Check if the browser supports notifications and request permission
if (Notification.permission !== "granted") {
    Notification.requestPermission();
}

function saveData() {
    localStorage.setItem("data", JSON.stringify(listContainer.innerHTML));
}

function loadData() {
    const savedData = JSON.parse(localStorage.getItem("data"));
    if (savedData) {
        listContainer.innerHTML = savedData;
    }
}

// Load saved data on page load
window.onload = loadData;
