const express = require('express')
var morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(cors())

app.use(express.static('dist'))

app.use(express.json())

morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = {
    "persons": [
        {
            "name": "Arto Hellas",
            "number": "040-123456",
            "id": 1
        },
        {
            "name": "Ada Lovelace",
            "number": "39-44-5323523",
            "id": 2
        },
        {
            "name": "Dan Abramov",
            "number": "12-43-234345",
            "id": 3
        },
        {
            "name": "Mary Poppendieck",
            "number": "39-23-6423122",
            "id": 4
        }
    ]
}

app.get('/api/persons', (request, response) => {
    response.json(persons.persons)
})

app.get('/info', (request, response) => {

    var currentdate = new Date();
    var datetime = "" + currentdate.getDate() + "/"
        + (currentdate.getMonth() + 1) + "/"
        + currentdate.getFullYear() + " @ "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds();

    response.send('<p>Phonebook has ' + persons.persons.length + ' entries.</p><p>' + datetime + '</p>')
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons.persons = persons.persons.filter(p => p.id !== id)

    response.status(204).end()
})

const generateId = () => {
    return Math.floor(Math.random() * 100000)
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    }
    if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    }

    if (persons.persons.find(p => p.name === body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }

    persons.persons = persons.persons.concat(person)

    response.json(person)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})