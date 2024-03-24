const express = require('express')
const { query } = require ('../helpers/db.js')

const todoRouter = express.Router()

todoRouter.get("/", async (req, res) => {
    console.log(query)
    try{
        const result = await query('select * from task')
        const rows = result.rows ? result.rows : []
        res.status(200).json(rows)
    } catch (error) {
        console.log(error)
        res.statusMessage = error
        res.status(500).json({error: error})
    }
})

todoRouter.post("/new", async (req, res) => {
    try {
        const result = await query('insert into task (description) values ($1) returning *',
        [req.body.description])
        res.status(200).json({id:result.rows[0].id})
    } catch (error) {
        console.log(error)
        res.statusMessage = error
        res.status(500).json({error: error})
    }
})

todoRouter.delete("/delete/:id", async (req, res) => {
    const id = Number(req.params.id)
    try {
        const result = await query('delete from task where id = $1',
        [id])
        res.status(200).json({id: id})
    } catch (error) {
        console.log(error)
        res.statusMessage = error
        res.status(500).json({error: error})
    }
})

module.exports = {
    todoRouter
}