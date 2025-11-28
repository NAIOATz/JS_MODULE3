const form = document.getElementById("todo-form")
const taskInput = document.getElementById("task-input")
const deadlineInput = document.getElementById("deadline-input")
const todoList = document.getElementById("todo-list")

form.addEventListener("submit", (e) => {
    e.preventDefault()
    const task = taskInput.value
    const deadline = deadlineInput.value

    console.log(task)
    console.log(deadline)

    const li = document.createElement("li")
    const textSpan = document.createElement("span")
    textSpan.textContent = `${task} - ${deadline}`

    const editBtn = document.createElement("button")
    editBtn.textContent = 'Edit'
    editBtn.classList.add("edit-btn")

    const deleteBtn = document.createElement("button")
    deleteBtn.textContent = "Delete"
    deleteBtn.classList.add("delete-btn")

    li.appendChild(textSpan)
    li.appendChild(editBtn)
    li.appendChild(deleteBtn)

    todoList.appendChild(li)

    taskInput.value = ""
    deadlineInput.value = ""

    // deleteBtn.addEventListener("click", () => {
    //     li.remove()
    // })
})
