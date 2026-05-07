const taskButton = document.getElementById("submitTask");
const taskContainer = document.getElementById("currTasks");

const titleField = $("#titleField");
const descField = $("#descField");
const deadlineField = $("#deadlineField");
const priorityField = $("#priorityField");

let taskTitle = "Task Title";
let taskDesc = "Task Description";
let taskDeadline = new Date("01/01/2001");
let taskPriority = 1;

alert("Welcome to Pixel Task Manager!");

const tasks = [
    /*
    {
        taskTitle: "Sample Task",
        taskDesc: "This is a task description",
        taskDeadline: new Date("01/01/2001"),
        taskPriority: 1,
        completed: false,
        category: "Personal"
    }
    */
];



// create upcoming preview container if it exists
function updateUpcomingTasks() {
    const upcomingContainer = $("#upcoming");

    if (upcomingContainer.length === 0) {
        return;
    }

    upcomingContainer.html("<p>Upcoming Tasks:</p>");

    const sortedUpcoming = [...tasks].sort(function(a, b) {
        return a.taskDeadline - b.taskDeadline;
    });

    sortedUpcoming.slice(0, 3).forEach(function(task) {
        upcomingContainer.append(`
            <div>
                <strong>${task.taskTitle}</strong>
                <p>${task.taskDeadline.toDateString()}</p>
            </div>
        `);
    });
}



// add task
$("#submitTask").on("click", function () {

    taskTitle = titleField.val().trim();
    taskDesc = descField.val().trim();
    taskDeadline = deadlineField.val();
    taskPriority = priorityField.val();

    if (
        taskTitle === "" ||
        taskDesc === "" ||
        taskDeadline === "" ||
        taskPriority === ""
    ) {
        alert("Please complete all task fields.");
        return;
    }

    tasks.push({
        taskTitle: taskTitle,
        taskDesc: taskDesc,
        taskDeadline: new Date(taskDeadline),
        taskPriority: Number(taskPriority),
        completed: false,
        category: "Personal"
    });

    renderTask();
    updateUpcomingTasks();

    titleField.val("");
    descField.val("");
    deadlineField.val("");
    priorityField.val("");
});



// edit btn
$("#currTasks").on("click", ".edit-btn", function () {

    let index = $(this).parent().data("index");

    const updatedTitle = prompt("Edit Task Title", tasks[index].taskTitle);
    const updatedDesc = prompt("Edit Task Description", tasks[index].taskDesc);

    if (updatedTitle !== null && updatedTitle.trim() !== "") {
        tasks[index].taskTitle = updatedTitle.trim();
    }

    if (updatedDesc !== null && updatedDesc.trim() !== "") {
        tasks[index].taskDesc = updatedDesc.trim();
    }

    renderTask();
});



// completed checkbox
$("#currTasks").on("change", ".complete-checkbox", function () {

    let index = $(this).parent().data("index");

    tasks[index].completed = $(this).is(":checked");

    renderTask();
});



// DELETE (with animation)
$("#currTasks").on("click", ".delete-btn", function () {

    let index = $(this).parent().data("index");
    let item = $(this).parent();

    item.slideUp(300, function () {

        tasks.splice(index, 1);

        renderTask();
        updateUpcomingTasks();
    });
});



function renderTask() {

    $("#currTasks").html("");

    let pendingCount = 0;
    let completedCount = 0;

    tasks.forEach((task, index) => {

        let today = new Date();

        today.setHours(0, 0, 0, 0);

        let taskDate = new Date(task.taskDeadline);

        taskDate.setHours(0, 0, 0, 0);

        let status = "Pending";

        if (task.completed === true) {

            status = "Completed";
            completedCount++;

        } else {

            pendingCount++;

            if (taskDate < today) {
                status = "Overdue";
            }
            else if (taskDate.getTime() === today.getTime()) {
                status = "Due Today";
            }
            else {
                status = "Upcoming";
            }
        }

        let overdueDays = "";

        if (taskDate < today && task.completed === false) {

            const difference = today - taskDate;

            const dayAmount = Math.floor(
                difference / (1000 * 60 * 60 * 24)
            );

            overdueDays = `<p><strong>Overdue By:</strong> ${dayAmount} day(s)</p>`;
        }

        let taskItem = $(`
            <div class="task" data-index="${index}"> 

                <input 
                    type="checkbox" 
                    class="complete-checkbox"
                    ${task.completed ? "checked" : ""}
                >

                <span class="task-text">
                    <h3>${task.taskTitle}</h3>
                    <p>${task.taskDesc}</p>

                    <p>
                        <strong>Deadline:</strong> 
                        ${taskDate.toDateString()}
                    </p>

                    <p>
                        <strong>Status:</strong> ${status}
                    </p>

                    ${overdueDays}

                    <p>
                        <strong>Priority:</strong> ${task.taskPriority}
                    </p>

                    <span class="badge label-school">
                        ${task.category}
                    </span>
                </span>

                <br>

                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>

            </div>
        `);

        taskItem.hide().fadeIn();

        $("#currTasks").append(taskItem);
    });

    const totalTasks = tasks.length;

    $("#taskCount").text(
        `Pending: ${pendingCount}　　　　Completed: ${completedCount}　　　　Total: ${totalTasks}`
    );
}



// search

const searchField = $("#searchField");
const searchResultsContainer = $("#searchResults");



// get text ready for search, lowercase it
$("#searchField").on("input", function () {

    const searchQuery = searchField.val().trim().toLowerCase();

    taskSearch(searchQuery);
});



function taskSearch(query) {

    searchResultsContainer.html("");

    if (query === "") {
        return;
    }

    const resultTask = tasks.filter(function(individTask) {

        return (
            individTask.taskTitle.toLowerCase().includes(query) ||
            individTask.taskDesc.toLowerCase().includes(query)
        );
    });

    resultTask.forEach((task, index) => {

        let taskItem = $(`
            <div class="task" data-index="${index}"> 

                <h3>${task.taskTitle}</h3>

                <p>${task.taskDesc}</p>

                <p>
                    <strong>Deadline:</strong> 
                    ${task.taskDeadline.toDateString()}
                </p> 

                <p>
                    <strong>Priority:</strong> 
                    ${task.taskPriority}
                </p>

            </div>
        `);

        searchResultsContainer.append(taskItem);
    });
}



// sorting by priority

$("#sortButton").on("click", function() {

    tasks.sort(function(a, b) {

        return a.taskPriority - b.taskPriority;
    });

    renderTask();
});



// sort by date button creation

const sortDateButton = $(`
    <button id="sortDateButton" class="btn btn-secondary ms-2">
        Sort Tasks by Date
    </button>
`);

$("#sortButton").after(sortDateButton);



// sorting by date

$("#sortDateButton").on("click", function() {

    tasks.sort(function(a, b) {

        return a.taskDeadline - b.taskDeadline;
    });

    renderTask();
});



// initial render

renderTask();
updateUpcomingTasks();
