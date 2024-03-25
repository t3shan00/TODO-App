const express = require('express')
const { query } = require('../helpers/db.js') // Import the database query helper

const todoRouter = express.Router() // Create a new router

// Route to get all tasks from the database
todoRouter.get("/", async (req, res) => {
    try {
        const result = await query('select * from task') // Execute SQL query
        const rows = result.rows ? result.rows : [] // Get rows or empty array if none
        res.status(200).json(rows) // Send tasks back to the client
    } catch (error) {
        // Handle errors
        console.log(error)
        res.statusMessage = error
        res.status(500).json({error: error})
    }
})

// Route to add a new task to the database
todoRouter.post("/new", async (req, res) => {
    try {
        // Insert task into database
        const result = await query('insert into task (description) values ($1) returning *', 
        [req.body.description])
        res.status(200).json({id:result.rows[0].id}) // Send back the new task ID
    } catch (error) {
        // Handle errors
        console.log(error)
        res.statusMessage = error
        res.status(500).json({error: error})
    }
})

// Route to delete a task by ID from the database
todoRouter.delete("/delete/:id", async (req, res) => {
    try {
        // Delete task from database
        const result = await query('delete from task where id = $1', 
        [Number(req.params.id)])
        res.status(200).json({id: req.params.id}) // Confirm deletion with task ID
    } catch (error) {
        // Handle errors
        console.log(error)
        res.statusMessage = error
        res.status(500).json({error: error})
    }
})

module.exports = {
    todoRouter // Export the router
}
