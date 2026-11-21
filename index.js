// as soon as the website loads, the current list is loaded and formatted
$(document).ready(function() {
    loadList()
});


// a quick function that saves the current list to the user's local storage
function saveList() {
    // list of all the lists
    let lists = [
        {name: "overdue-list", items: $("#overdue-list li")},
        {name : "today-list", items: $("#today-list li")}, 
        {name: "tomorrow-list", items: $("#tomorrow-list li")},
        {name: "week-list", items: $("#week-list li")},
        {name: "future-list", items: $("#future-list li")}
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
        deleteTask(li)

        if (task.completed) {
            li.classList.add("complete");
        }


        // restores checkbox status
        let box = li.querySelector("input");
        box.checked = task.completed;

        
        // adds task back to its original list
        checkingDate(li, task.dueDate)
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

        saveList()
    });

    
}

// a function for adding x's to the task so the user can remove individual items
function deleteTask(li){
    let xSpan = document.createElement("span")
    let ex = document.createTextNode("x")
    xSpan.classList.add("delete")
    xSpan.appendChild(ex)

    li.append(xSpan)

    xSpan.addEventListener("click", function(){
        li.remove()
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
    deleteTask(li)
    checkingDate(li, dueDate)

    //resets the input boxes once the task is added
    $("#task").val("")
    $("#due-date").val("")

    saveList()
}

// a function for checking the due date of the list and adding it to the correct list
function checkingDate(li, dueDate){
    let today = new Date()
    today.setHours(0,0,0,0)

    let taskDate = new Date(dueDate + "T00:00:00")

    let tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    let startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay())

    let endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)

    // adds the task to the correct list based on 
    if (!dueDate){
        $("#today-list").append(li)
        return
    }
    else if (taskDate.getTime() === today.getTime()) {
        $("#today-list").append(li)
    }
    else if (taskDate.getTime() === tomorrow.getTime()){
        $("#tomorrow-list").append(li)
    }
    else if (taskDate > tomorrow && taskDate <= endOfWeek) {
        $("#week-list").append(li)
    }
    else if (taskDate < today){
        $("#overdue-list").append(li)
    }
    else if (taskDate > endOfWeek){
        $("#future-list").append(li)
    }
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
            case "overdue-clear":
                clear($("#overdue-list"))
                break;

            case "today-clear":
                clear($("#today-list"))
                break;

            case "tomorrow-clear":
                clear($("#tomorrow-list"))
                break;

            case "week-clear":
                clear($("#week-list"))
                break;

            case "future-clear":
                clear($("#future-list"))
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

//checks and/or changes the tasks every minute
setInterval(function() {
    $("#overdue-list li, #today-list li, #tomorrow-list li, #week-list li, #future-list li").each(function() {
        let li = this
        let dueDate = li.querySelector(".due-date").dataset.date
        checkingDate($(li).detach(), dueDate)
    });

    saveList()
}, 60000);
