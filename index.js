const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
require('dotenv').config()

const Person = require('./models/person')

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(cors())
app.use(express.json())

morgan.token('body', (req) => { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.static('dist'))

let persons = [
]

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })

})

app.get('/api/info', (request, response) => {
  Person.find({}).then(persons => {
    response.send(`<p>Phonebook has info for ${persons.length} people </p>` + '<br />' + Date()) 
  })   
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
  })
  .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

/*
function getRandomId(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) + min)
}
*/

app.post('/api/persons', (request, response) => {
  const body = request.body
  /*
  const name = persons.find(person => person.name === body.name)

  if (name) {
    return response.status(400).json({ 
      error: 'name must be unique' 
  })
  */
  

  if (!body.name || !body.number) {
      if (!body.number && !body.name) {
          return response.status(400).json({ 
              error: 'name and number is missing' 
          })
      }
      if (!body.name) {
          return response.status(400).json({ 
              error: 'name is missing' 
          })
      }
      if (!body.number) {
          return response.status(400).json({ 
              error: 'number is missing' 
          })
      } 
    }
  
  const person = new Person({
    // id: getRandomId(1, 5000),
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

app.use(unknownEndpoint)
app.use(errorHandler)
  
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
