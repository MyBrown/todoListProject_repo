// as soon as the website loads, the current list is loaded and formatted
$(document).ready(function() {
    loadList()
    
    for (let i = 0; i < listItems.length; i++) {
        addCheckBoxes(listItems[i])
    }
});


// a quick function that saves the current list to the user's local storage
function saveList() {
    // the list where all of li reside
    let listItems = document.querySelectorAll("#list li");

    // a new list that holds all of the information from each task
    let tasks = [];

    // goes through each item in the list and identifies the checkbox, the task, and the due date to add them to the array
    listItems.forEach(function(li) {
        let box = li.querySelector("input");
        let title = li.querySelector(".task-title");
        let dueDate = li.querySelector(".due-date")

        tasks.push({
            title: title.textContent,
            dueDate: dueDate.dataset.date,
            completed: box.checked
        });
    });

    localStorage.setItem("listItems", JSON.stringify(tasks));
}



// a function for loading the current list when the website has loaded
function loadList() {
    
    // pulls all of the info from the local storage array
    let tasks = JSON.parse(localStorage.getItem("listItems")) || [];


    // loops throught the above array and pieces out the title, the due date, and the checkbox
    tasks.forEach(function(task) {

        let li = document.createElement("li");

        let title = document.createElement("span");
        title.classList.add("task-title");
        title.textContent = task.title;
        li.append(title);

        let dueDate = document.createElement("span");
        dueDate.classList.add("due-date")
        dueDate.dataset.date = task.dueDate || ""
        dueDate.textContent = task.dueDate
            ? "Due date: " + task.dueDate
            : "";
        li.append(dueDate);


        addCheckBoxes(li);

        // checks for if the box is clicked
        let box = li.querySelector("input");
        box.checked = task.completed;
        if (task.completed) {
            li.classList.add("complete");
        }
        $("#list").append(li);
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
    }
    else {

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
        let list = $("#list")
        list.append(li)

        $("#task").val("")
        $("#due-date").val("")
    }

    saveList()
}

// button for adding a task to 
let addButton = document.querySelector(".add.task")
addButton.addEventListener("click", addTask);

// clears the whole list with a push of the button
let clearButton = document.querySelector(".clear")
clearButton.addEventListener("click", function() {
    console.log("Clear list!")
    list = document.querySelector("#list")
    list.textContent = ""

    localStorage.removeItem("listItems")
});