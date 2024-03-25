// Define the Task class representing a single task with an id and text
class Task {
    // Private field to store the task's ID
    #id
    // Private field to store the task's text description
    #text

    // Constructor initializes a new Task instance with an id and text
    constructor (id, text) {
        this.#id = id
        this.#text = text
    }

    // Public method to get the task's ID
    getId() {
        return this.#id
    }

    // Public method to get the task's text description
    getText() {
        return this.#text
    }
}

// Export the Task class for use in other modules
export { Task }
