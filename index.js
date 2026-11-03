
var listItems = document.querySelectorAll("#list li");

for (let i = 0; i < listItems.length; i++) {
    addCheckBoxes(listItems[i])
}

function addCheckBoxes(li){
    let box = document.createElement("input");

    box.type = "checkbox";

    li.prepend(box);

    box.addEventListener("change", function(){
        if (box.checked) {
            li.classList.add("complete")
        }
        else {
            li.classList.remove("complete")
        }
    });
}

function addTask(){
    let content = $("#task").val()
    if (content === ""){
        alert("Type in a task to add")
    }
    else {
        let li = document.createElement("li")
        li.textContent = content;
        addCheckBoxes(li)
        let list = $("#list")
        list.append(li)

        $("#task").val("")
    }
}

let addButton = document.querySelector(".add.task")
addButton.addEventListener("click", addTask);