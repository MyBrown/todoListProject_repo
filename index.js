// as soon as the website loads, the current list is loaded and formatted
$(document).ready(function() {
    loadList()
    
    for (let i = 0; i < listItems.length; i++) {
        addCheckBoxes(listItems[i])
    }
});


// a quick function that saves the current list to the user's local storage
function saveList() {
    // list of all the lists
    let lists = [
        {name: "general-list", items: $("#general-list li")}, 
        {name : "today-list", items: $("#today-list li")}, 
        {name: "week-list", items: $("#week-list li")}
    ]

    // a new list that will hold all of our information
    let tasks = [];

    // goes through each item in the list and identifies the checkbox, the task, and the due date to add them to the array
    lists.forEach(function(list) {
        list.items.each(function() {

            let li = this

            let box = li.querySelector("input");
            let title = li.querySelector(".task-title");
            let dueDate = li.querySelector(".due-date")

            tasks.push({
                list: list.name,
                title: title.textContent,
                dueDate: dueDate.dataset.date,
                completed: box.checked
            });
        });
    });

    localStorage.setItem("lists", JSON.stringify(tasks));
}



// a function for loading the current list when the website has loaded
function loadList() {

    // Pulls all the info from local storage
    let tasks = JSON.parse(localStorage.getItem("lists")) || [];

    tasks.forEach(function(task) {

        let li = document.createElement("li");

        // assigns the title and due date
        let title = document.createElement("span");
        title.classList.add("task-title");
        title.textContent = task.title;
        li.append(title);

        let dueDate = document.createElement("span");
        dueDate.classList.add("due-date");
        dueDate.dataset.date = task.dueDate || "";
        dueDate.textContent = task.dueDate
            ? "Due date: " + task.dueDate
            : "";
        li.append(dueDate);

        addCheckBoxes(li);

        if (task.completed) {
                    li.classList.add("complete");
        }


        // restores checkbox status
        let box = li.querySelector("input");
        box.checked = task.completed;

        
        // adds task back to its original list
        if (task.list === "general-list") {
            $("#general-list").append(li);
        }
        else if (task.list === "today-list") {
            $("#today-list").append(li);
        }
        else if (task.list === "week-list") {
            $("#week-list").append(li);
        }
    });   
}



// a function to add check boxes in front of each task
function addCheckBoxes(li){

    // creates the box itself
    let box = document.createElement("input");
    box.type = "checkbox";

    //attaches it to the beginning of the task
    li.prepend(box);

    // adds a listener that strikes through the task when the corresponding box is checked
    box.addEventListener("change", function(){
        if (box.checked) {
            li.classList.add("complete")
        }
        else {
            li.classList.remove("complete")
        }

        // saves the list with each additional task
        saveList()
    });

    
}

// a function for adding a new task to the list and displaying the due date
function addTask(){
    let content = $("#task").val()
    let dueDate = $("#due-date").val()
    
    // makes sure no empty task can be added to the list
    if (content === ""){
        alert("Please add a title for the task")
        return
    }

    let li = document.createElement("li")

    let title = document.createElement("span");
    title.classList.add("task-title");
    title.textContent = content;
    li.append(title);

    let span = document.createElement("span")
    span.classList.add("due-date");
    span.dataset.date = dueDate
    span.textContent = dueDate ? "Due date: " + dueDate : "";
    li.append(span);

    addCheckBoxes(li)

    //checking the date so that the task goes to the right list
    if (dueDate === ""){
        $("#general-list").append(li)
    }
    else {
        let today = new Date()
        today.setHours(0,0,0,0)

        let taskDate = new Date(dueDate + "T00:00:00")

        if (taskDate.getTime() === today.getTime()) {
            $("#today-list").append(li)
        }
        else if (taskDate > today) {
            $("#week-list").append(li)
        }
        else {
            $("#general-list").append(li)
        }
    }

    //resets the input boxes once the task is added
    $("#task").val("")
    $("#due-date").val("")

    saveList()
}

// button for adding a task to 
let addButton = document.querySelector(".add.task")
addButton.addEventListener("click", addTask);

// collects all of the clear buttons
let clearButtons = document.querySelectorAll(".clear")
// deletes the list according to which button is pushed
clearButtons.forEach(function(button) {
    button.addEventListener("click", function() {
    
        switch (button.id) {
            case "general-clear":
                clear($("#general-list"))
                break;

            case "today-clear":
                clear($("#today-list"))
                break;

            case "week-clear":
                clear($("#week-list"))
                break;

            default:
                break;
        }
    });
});


function clear(list){
    list.empty()
    saveList()
}