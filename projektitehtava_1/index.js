const express = require('express')
const fs = require('fs')
const bodyParser = require('body-parser')
const PORT = 3000

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static('public'))

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

  res.send(results)
})

app.get('/newmessage', (req, res) => {
  res.sendFile(__dirname + '/public/newmessage.html')
})

app.post('/newmessage', (req, res) => {
  const data = require('./JSON_Guestbook_data.json')
  const body = req.body
  console.log(body)

  const newmessage = {
    id: data.length + 1,
    username: body.username,
    country: body.country,
    date: new Date(),
    message: body.message,
  }

  data.push(newmessage)

  jsonStr = JSON.stringify(data)

  fs.writeFile('JSON_Guestbook_data.json', jsonStr, (err) => {
    if (err) throw err
    console.log('Saved!')
  })
  res.send(`New message: ${newmessage.message} saved!`)
})

app.listen(PORT, () => {
  console.log(`Server is runninn on port ${PORT}.`)
})
