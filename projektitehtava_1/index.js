const express = require('express')
const fs = require('fs')
const bodyParser = require('body-parser')
const PORT = 3000

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())

// Landing page (route '/')
app.use(express.static('public'))

// Sends all saved messages as a reponse
app.get('/guestbook', (req, res) => {
  const data = require('./JSON_Guestbook_data.json')

  let results = fs.readFileSync('./public/guestbook.html', 'utf-8')

  data.forEach((element) => {
    results += `<tr>
        <td>${element.id}</td>
        <td>${element.username}</td>
        <td>${element.country}</td>
        <td>${element.date}</td>
        <td>${element.message}</td>
      </tr>`
  })
  results += '</body></html>'

  res.send(results)
})

// Sends the newmessage html form as a response
app.get('/newmessage', (req, res) => {
  res.sendFile(__dirname + '/public/newmessage.html')
})

// Receives the newmessage form and saves it to the database
app.post('/newmessage', (req, res) => {
  const data = require('./JSON_Guestbook_data.json')
  const body = req.body

  const newMessage = {
    id: data.length + 1,
    username: body.username,
    country: body.country,
    date: new Date(),
    message: body.message,
  }

  data.push(newMessage)

  jsonStr = JSON.stringify(data)

  fs.writeFile('JSON_Guestbook_data.json', jsonStr, (err) => {
    if (err) throw err
  })
  res.send(`New message: ${newMessage.message}, saved successfully!`)
})

// Sends the ajaxmessage html form as a response
app.get('/ajaxmessage', (req, res) => {
  res.sendFile(__dirname + '/public/ajaxmessage.html')
})

// Receives the ajaxmessage form data, saves it to the database and sends all messages as a response
app.post('/ajaxmessage', (req, res) => {
  const data = require('./JSON_Guestbook_data.json')
  const body = req.body

  const newMessage = {
    id: data.length + 1,
    username: body.username,
    country: body.country,
    date: new Date(),
    message: body.message,
  }

  data.push(newMessage)

  jsonStr = JSON.stringify(data)

  fs.writeFile('JSON_Guestbook_data.json', jsonStr, (err) => {
    if (err) throw err
  })
  const messages = data.map((element) => {
    return element.message
  })

  res.send(messages)
})

app.listen(PORT, () => {
  console.log(`Server is runninn on port ${PORT}.`)
})
