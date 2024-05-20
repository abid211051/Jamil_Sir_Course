import "./style.css"

const baseUrl = "https://todo-crudl.deno.dev/abid/todos";
let todoDiv;
let progressDiv;
let completeDiv;
let form;
document.addEventListener("DOMContentLoaded", initialize);

function initialize() {
    todoDiv = document.querySelector('.todo');
    progressDiv = document.querySelector('.prog');
    completeDiv = document.querySelector('.complete');
    form = document.querySelector(".form");
    getTodos();
    form.addEventListener('submit', addTask);
}

async function getTodos() {
    try {
        todoDiv.innerHTML = "";
        progressDiv.innerHTML = "";
        completeDiv.innerHTML = "";
        const res = await fetch(baseUrl);
        const todos = await res.json();
        // console.log(todos);
        todos?.map((todo) => {
            let todoItem = `
            <div id=${todo?.id} class="flex gap-2 justify-between items-center flex-wrap bg-slate-100 p-2">
            ${todo.status === "complete" ? '' : '<input type="checkbox" class="check">'}
                    <p>${todo?.title}</p>
                    <button class="delete">
                    <img src="./icons8-cross.svg" width="25" height="25" alt="Icon" />
                  </button>
                </div>
        `
            if (todo.status === "todo") {
                todoDiv.innerHTML += todoItem;
            } else if (todo.status === "progress") {
                progressDiv.innerHTML += todoItem;
            } else if (todo.status === "complete") {
                completeDiv.innerHTML += todoItem;
            }
        })
        const checkbox = document.getElementsByClassName("check");
        for (let i = 0; i < checkbox.length; i++) {
            checkbox[i].addEventListener("change", updateTodo);
        }

        const deleteBtn = document.getElementsByClassName("delete");
        for (let i = 0; i < deleteBtn.length; i++) {
            deleteBtn[i].addEventListener("click", deleteTodo);
        }
    } catch (error) {
        console.log(error);
    }
}
async function addTask(e) {
    e.preventDefault();
    try {
        const data = e.target.todo.value;
        if (data.length > 0) {
            const res = await fetch(baseUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: data })
            })
            if (res.ok) {
                e.target.todo.value = "";
                getTodos();
            }
        }
    } catch (error) {
        console.log(error);
    }
}

async function updateTodo(e) {
    try {
        if (this.checked) {
            const todoId = e.target.parentElement.id;
            const res = await fetch(baseUrl + '/' + todoId);
            const todo = await res.json();

            if (todo?.status == "todo") {
                await fetch(baseUrl + '/' + todoId, {
                    method: 'PUT',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ status: "progress" })
                })
            } else if (todo?.status == "progress") {
                await fetch(baseUrl + '/' + todoId, {
                    method: 'PUT',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ status: "complete" })
                })
            }
            getTodos();
        }
    } catch (error) {
        console.log(error);
    }
}


async function deleteTodo() {
    try {
        const todoId = this.parentElement.id;
        const res = await fetch(baseUrl + '/' + todoId, { method: "DELETE" });
        if (res.ok) {
            getTodos();
        }
    } catch (error) {
        console.log(error);
    }
}