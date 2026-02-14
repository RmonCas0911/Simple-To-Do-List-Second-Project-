const todoValue = document.getElementById("todoText");
const todoAlert = document.getElementById("Alerta");
const listItems = document.getElementById("listaDeCosas");
const addUpdate = document.getElementById("AddUpdateCLick");

let todo = JSON.parse(localStorage.getItem("todo-list")) || [];

let updateText = null;

function createToDoItems() {
    if (todoValue.value.trim() === "") {
        todoAlert.textContent = "¡Por favor, añade algo!";
        todoAlert.style.color = "red";
        todoValue.focus();
        return;
    }

    let isPresent = false;
    todo.forEach((element) => {
        if (element.item === todoValue.value) {
            isPresent = true;
        }
    });

    if (isPresent) {
        todoAlert.textContent = "Esta cosa ya está en la lista";
        todoAlert.style.color = "red";
        return;
    }

    let li = document.createElement("li");
    const todoItems = `<div title="Click para completar" onclick="CompletedToDoItems(this)">${todoValue.value}</div>
                       <div>
                           <img class="edit todo-controls" onclick="UpdateToDoItems(this)" src="images/pencil.png" />
                           <img class="delete todo-controls" onclick="DeleteToDoItems(this)" src="images/delete.png" />
                       </div>`;
    li.innerHTML = todoItems;
    listItems.appendChild(li);

    todo.push({ item: todoValue.value, status: false });
    localStorage.setItem("todo-list", JSON.stringify(todo));
    
    todoValue.value = "";
    todoAlert.textContent = "¡Tarea agregada!";
    todoAlert.style.color = "green";
}

function UpdateToDoItems(e) {
    const parentDiv = e.parentElement.parentElement.querySelector("div");
    if (parentDiv.style.textDecoration === "") {
        todoValue.value = parentDiv.innerText;
        updateText = parentDiv;
        addUpdate.setAttribute("onclick", "UpdateSelectionItems()");
        addUpdate.innerText = "Actualizar"; // Opcional: cambia el texto del botón
        todoValue.focus();
    }
}

function UpdateSelectionItems() {
    let isPresent = false;
    todo.forEach(element => {
        if (element.item === todoValue.value) { isPresent = true; }
    });

    if (isPresent) {
        todoAlert.textContent = "Esta cosa ya está metida en la lista";
        todoAlert.style.color = "red";
        return;
    }

    todo.forEach(element => {
        if (element.item === updateText.innerText.trim()) {
            element.item = todoValue.value;
        }
    });

    localStorage.setItem("todo-list", JSON.stringify(todo));
    updateText.innerText = todoValue.value;
    addUpdate.setAttribute("onclick", "createToDoItems()");
    addUpdate.innerText = "Añadir";
    todoValue.value = "";
    todoAlert.textContent = "Elemento actualizado";
    todoAlert.style.color = "green";
}

function ReadToDoItems(){
    listItems.innerHTML = ""; // Limpiar antes de leer
    todo.forEach((element) => {
        let li = document.createElement("li");
        let style = element.status ? "style='text-decoration: line-through'":"";
        const todoItems = `<div ${style} title="Click para completar" onclick="CompletedToDoItems(this)">${element.item}</div>
                           <div>
                               ${element.status ? "" : '<img class="edit todo-controls" onclick="UpdateToDoItems(this)" src="images/pencil.png" />'}
                               <img class="delete todo-controls" onclick="DeleteToDoItems(this)" src="images/delete.png" />
                           </div>`;
        li.innerHTML = todoItems;
        listItems.appendChild(li);
    });
}
ReadToDoItems();

function CompletedToDoItems(e){
    if(e.style.textDecoration === "" ){
        e.style.textDecoration="line-through";
        const editBtn = e.parentElement.querySelector("img.edit");
        if (editBtn) editBtn.remove();

        todo.forEach((element) =>{
            if (element.item === e.innerText.trim()){
                element.status = true;
            }
        });
        localStorage.setItem("todo-list", JSON.stringify(todo));
        todoAlert.textContent = "¡Tarea realizada!";
        todoAlert.style.color = "green";
    }
}

function DeleteToDoItems(e){
    let deleteValue = e.parentElement.parentElement.querySelector("div").innerText;
    if (confirm(`¿Seguro que quieres borrar "${deleteValue}"?`)){
        e.parentElement.parentElement.classList.add("deleted-item");
        todo = todo.filter((element) => element.item !== deleteValue.trim());
        localStorage.setItem("todo-list", JSON.stringify(todo));
        setTimeout(() =>{
            e.parentElement.parentElement.remove();
        }, 300);
        todoAlert.textContent = "Tarea eliminada correctamente";
        todoAlert.style.color = "red";
    }
}

// Corregido todo.Value -> todoValue
todoValue.addEventListener("keyup", function (e){
    if (e.key === "Enter"){
        addUpdate.click();
    }
});