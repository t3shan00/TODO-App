const express = require('express')
const cors = require('cors')
const { Pool } = require('pg')

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))
const port = 3001

app.get("/", (req, res) => {
    const pool = openDb()

    pool.query('SELECT * FROM task', (error, result) => {
        if (error) {
            res.status(500).json({ error: error.message })
        }
        res.status(200).json(result.rows)
    })
})

app.post("/new", (req,res) => {
    const pool = openDb()

   pool.query('insert into task (description) values ($1) returning *',
   [req.body.description],
    (error,result) => {
        if (error) {
            res.status(500).json({error: error.message})
        } else {
            res.status(200).json({id : result.rows[0].id})
        }
    })
})

app.delete("/delete/:id",async(req,res) => {
    const pool = openDb()
    const id = parseInt(req.params.id)
    pool.query('delete from task where id = $1',
    [id],
    (error,result) => {
        if (error) {
            res.status(500).json({error: error.message})
        } else {
            res.status(200).json({id: id})
        }
    })
})

const openDb = () => {
    const pool = new Pool ({
        user: 'postgres',
        host: 'localhost',
        database: 'todo',
        password: 'admin1234',
        port: 5432
    })
    return pool
}

app.listen(port)