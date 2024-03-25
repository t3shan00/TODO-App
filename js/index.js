// Define the root URL for the backend API
const BACKEND_ROOT_URL = 'https://todo-app-server-5ape.onrender.com'

// Import the Todos class from the Todos module
import { Todos } from "./Class/Todos.js"

// Create an instance of Todos with the backend URL
const todos = new Todos(BACKEND_ROOT_URL)

// Select the list and input elements from the document
const list = document.querySelector('ul')
const input = document.querySelector('input')

// Initially disable the input to prevent user input before the tasks are loaded
input.disabled = true

// Function to render a task in the UI
const renderTask = (task) => {
    // Create a new list item element
    const li = document.createElement('li')
    li.setAttribute('class','list-group-item')
    li.setAttribute('data-key',task.getId().toString())
    li.innerHTML = task.getText()
    renderLink(li,task.getId())
    list.append(li)
}

// Function to add a delete link to a task item
const renderLink = (li, id) => {
    // Create a new anchor element and append it to the list item
    const a = li.appendChild(document.createElement('a'))
    a.innerHTML = '<i class="bi bi-trash"></i>'
    a.setAttribute('style','float: right')
    a.addEventListener('click',(event) => {
        // On click, attempt to remove the task from the backend
        todos.removeTask(id).then((removed_id) => {
            // If successful, remove the task from the UI as well
            const li_to_remove = document.querySelector(`[data-key='${removed_id}']`)
            if (li_to_remove) {
                list.removeChild(li_to_remove)
            }
        }).catch((error) => {
            // Alert the user if there's an error
            alert(error)
        })
    })
}

// Function to retrieve and render tasks from the backend
const getTasks = () => {
    todos.getTasks().then((tasks) => {
        // Render each task in the UI
        tasks.forEach(task => {
            renderTask(task)
        })
        // Enable the input after tasks are loaded
        input.disabled = false
    }).catch((error) => {
        // Alert the user if there's an error fetching the tasks
        alert(error)
    })
}

// Function to save a new task to the backend
const saveTask = async (task) => {
    try {
        const json = JSON.stringify({description: task})
        const response = await fetch(BACKEND_ROOT_URL + '/new', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: json
        })
        return response.json()
    } catch (error){
        // Alert the user if there's an error saving the task
        alert("Error saving task " + error.message)
    }
}

// Add an event listener to the input for the 'Enter' keypress
input.addEventListener('keypress',(event) => {
    if (event.key === 'Enter') {
        event.preventDefault()
        const task = input.value.trim()
        if (task !== '') {
            // If input is not empty, add the new task
            todos.addTask(task).then((task)=> {
                // Render the new task in the UI
                renderTask(task)
                // Clear the input and focus it for a new entry
                input.value = ''
                input.focus()
            })
        }
    }
})

// Fetch and render tasks when the script loads
getTasks()
