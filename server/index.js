// Load environment variables from .env file
require('dotenv').config()

// Import necessary modules
const express = require('express')
const cors = require('cors')

// Import custom database query helper and routes
const { query } = require('./helpers/db.js')
const { todoRouter } = require('./routes/todo.js')

// Initialize Express app
const app = express()

// Use CORS to allow cross-origin requests
app.use(cors())

// Parse JSON bodies (as sent by API clients)
app.use(express.json())

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({extended: false}))

// Use the todoRouter for handling routes starting with '/'
app.use('/', todoRouter)

// Define the port to run the server on from environment variables
const port = process.env.PORT

// Route to get all tasks. Asynchronous function to handle database query.
app.get("/", async (req, res) => {
    console.log(query) // Log the query function for debugging
    try{
        // Fetch all tasks from the database
        const result = await query('select * from task')
        // Check if result has rows property, else default to an empty array
        const rows = result.rows ? result.rows : []
        // Send a 200 OK response along with the fetched tasks
        res.status(200).json(rows)
    } catch (error) {
        // Log the error and send a 500 Internal Server Error response
        console.log(error)
        res.statusMessage = error
        res.status(500).json({error: error})
    }
})

// Route to add a new task. Uses the POST method for data submission.
app.post("/new", async (req, res) => {
    try {
        // Insert a new task into the database with the description provided in request body
        const result = await query('insert into task (description) values ($1) returning *',
        [req.body.description])
        // Send a 200 OK response along with the id of the newly created task
        res.status(200).json({id:result.rows[0].id})
    } catch (error) {
        // Log the error and send a 500 Internal Server Error response
        console.log(error)
        res.statusMessage = error
        res.status(500).json({error: error})
    }
})

// Route to delete a task by ID. Uses the DELETE method.
app.delete("/delete/:id", async (req, res) => {
    // Convert the id from params to a number
    const id = Number(req.params.id)
    try {
        // Delete the task with the specified id from the database
        const result = await query('delete from task where id = $1',
        [id])
        // Send a 200 OK response along with the id of the deleted task
        res.status(200).json({id: id})
    } catch (error) {
        // Log the error and send a 500 Internal Server Error response
        console.log(error)
        res.statusMessage = error
        res.status(500).json({error: error})
    }
})

// Start the server on the specified port
app.listen(port)
