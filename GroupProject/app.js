console.log('Hello World')
alert("Welcome to Pixel Task Manager!");

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


const tasks = [
    /*
    {
        taskTitle: "Sample Task",
        taskDesc: "This is a task description",
        taskDeadline: new Date("01/01/2001"),
        taskPriority: 1
    }
        */
]



$("#submitTask").on("click", function () {
    // get the info from the form
    taskTitle = titleField.val().trim();
    taskDesc = descField.val().trim();
    taskDeadline = deadlineField.val();
    taskPriority = priorityField.val();
    tasks.push({
        // actually add the info to the array using the vars
        taskTitle: taskTitle,
        taskDesc: taskDesc,
        taskDeadline: new Date(taskDeadline),
        
        taskPriority: taskPriority
    });
    renderTask();
});

// edit btn, NOT YET FINISHED
$("#currTasks").on("click", ".edit-btn", function () {
    
});

// DELETE (with animation)
$("#currTasks").on("click", ".delete-btn", function () {
    let index = $(this).parent().data("index");
    let item = $(this).parent();

    item.slideUp(300, function () {
        //removeSkill(index, renderSkills); I'm just going to code the function in-line
        tasks.splice(index, 1); // fixes the issue with tasks appearing back
    });
    
    // CURRENT BUG: adding a task after deleting one will bring the deleted back again (solved)
});


function renderTask() {
    $("#currTasks").html(""); // clear previous
    
    const taskCount = tasks.length;
    //console.log(`There are ${taskCount} tasks.`);
    $("#taskCount").text(`Pending: ${taskCount}`);

    
    let status = "Ongoing";

    tasks.forEach((task, index) => { // keeping track of data index
        let today = new Date();
        today.setHours(0, 0, 0, 0);
        task.taskDeadline.setHours(0, 0, 0, 0);
        // some bugs over dates and "Due today"
        if (task.taskDeadline > today) {
            status = "Ongoing";
        } else if (task.taskDeadline < today) {
            status = "Completed";
        } else {
            status = "Due Today"; 
        }

        let taskItem = $(`
            <div class="task" data-index="${index}"> 
                <h3>${task.taskTitle}</h3>
                <p>${task.taskDesc}</p>
                <p><strong>Deadline:</strong> ${task.taskDeadline} - ${status}</p>
                <p><strong>Priority:</strong> ${task.taskPriority}</p>

                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        `);

        taskItem.hide().fadeIn();

        $("#currTasks").append(taskItem);
    });
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
    if (query === "") { return; }


    // search for title (phased out description search)
    //const resultTask = tasks.filter(task => {
    const resultTask = tasks.filter(function(individTask) {
        return individTask.taskTitle.toLowerCase().includes(query);
        // || task.taskDesc.toLowerCase().includes(query);
    });

    
    // render results (this is temporary and will replace each search)
    resultTask.forEach((task, index) => {
        let taskItem = $(`
            <div class="task" data-index="${index}"> 
                <h3>${task.taskTitle}</h3>
                <p>${task.taskDesc}</p>
                <p><strong>Deadline:</strong> ${task.taskDeadline} - ${status}</p> 
                <p><strong>Priority:</strong> ${task.taskPriority}</p>
            </div>
        `); // bug with status

        searchResultsContainer.append(taskItem);
    });
}



// sorting

$("#sortButton").on("click", function() {
    tasks.sort((a, b) => a.taskPriority - b.taskPriority);
    renderTask(); // re-render
});


