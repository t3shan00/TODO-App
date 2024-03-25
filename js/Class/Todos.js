// Import Task class for creating task instances
import { Task } from "./Task.js";

// Define the Todos class to manage task operations
class Todos {
    // Private field to store tasks
    #tasks = []
    // Private field to store the backend API URL
    #backend_url = ''

    // Constructor initializes the class with a backend URL
    constructor(url) {
        this.#backend_url = url
    }

    // Method to fetch and load tasks from the backend
    getTasks = () => {
        return new Promise(async(resolve, reject) => {
            fetch(this.#backend_url)
            .then((response) => response.json())
            .then((json) => {
                // Convert fetched data into Task instances and store them
                this.#readJson(json)
                // Resolve the promise with the updated tasks array
                resolve(this.#tasks)
            },(error) => {
                // Reject the promise if there's an error
                reject(error)
            })
        })
    }

    // Method to add a new task to the backend and local store
    addTask = (text) => {
        return new Promise(async(resolve, reject) => {
            const json = JSON.stringify({description: text})
            fetch(this.#backend_url + '/new', {
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                body: json
            })
            .then((response) => response.json())
            .then((json) => {
                // Add the new task to the local store and resolve the promise with it
                resolve(this.#addToArray(json.id,text))
            },(error) => {
                // Reject the promise if there's an error
                reject(error)
            })
        })
    }

    // Method to remove a task from the backend and local store by its ID
    removeTask = (id) => {
        return new Promise(async(resolve, reject) => {
            fetch(this.#backend_url + '/delete/' + id, {
                method: 'delete'
            })
            .then((response) => response.json())
            .then((json) => {
                // Remove the task from the local store
                this.#removeFromArray(id)
                // Resolve the promise with the ID of the removed task
                resolve(json.id)
            },(error) => {
                // Reject the promise if there's an error
                reject(error)
            })
        })
    }

    // Private method to populate the tasks array with Task instances from JSON
    #readJson = (tasksAsJson) => {
        tasksAsJson.forEach(node => {
            const task = new Task(node.id,node.description)
            this.#tasks.push(task)
        })
    }

    // Private method to add a task to the local store and return the Task instance
    #addToArray = (id,text) => {
        const task = new Task(id,text)
        this.#tasks.push(task)
        return task
    }

    // Private method to remove a task from the local store by its ID
    #removeFromArray = (id) => {
        const arrayWithoutRemoved = this.#tasks.filter(task => task.id !== id)
        this.#tasks = arrayWithoutRemoved
    }
}

// Export the Todos class for use in other modules
export { Todos }
