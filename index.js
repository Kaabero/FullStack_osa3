const express = require('express')
const app = express()

app.use(express.json())

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345"
},
{
    id: 4,
    name: "Mary Poppendick",
    number: "39-23-6423122"
    
}
]
app.get('/api/persons', (req, res) => {
    res.json(persons)
  })

app.get('/api/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people </p>` + '<br />' + Date())
    
  })

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })

  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })

  function getRandomId(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min) + min)
  }

  app.post('/api/persons', (request, response) => {
    const body = request.body
    const name = persons.find(person => person.name === body.name)

    if (name) {
        return response.status(400).json({ 
            error: 'name must be unique' 
      })

    }

  

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
  
    const person = {
      id: getRandomId(1, 5000),
      name: body.name,
      number: body.number,
    }
  
    persons = persons.concat(person)
  
    response.json(person)
  })
  
const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
