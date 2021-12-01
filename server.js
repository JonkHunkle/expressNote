const uniqid = require('uniqid')
const fs = require('fs')
const db = require('./db/db.json')
const express = require('express')
const path = require('path')
const app = express()
const PORT = process.env.port || 3001


app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'))

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/index.html'))
);
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/notes.html'))
);

app.get('/api/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/db/db.json'))
})

app.post('/api/notes', (req, res) => {
  let newNote = req.body
  let newID = uniqid()
  newNote.id = newID
  fs.readFile('./db/db.json', (err, data) => {
    if (err)
      throw err;
    let noteDB = JSON.parse(data)
    noteDB.push(newNote)

    fs.writeFile('./db/db.json', JSON.stringify(noteDB), 'utf-8', (err, data) => {
      if (err) throw err;
      console.log('new note!')
    })
  })
  res.redirect('/notes')
})

app.delete('/notes/:id', (req, res) => {
  let jsonPath = path.join(__dirname, './db/db.json')
  for (let i = 0; i < db.length; i++) {
    if (db.id === req.params.id) {
      db.splice(i, 1)
      break
    }
  }
  fs.writeFile(jsonPath, db)
  res.json(db)
})


app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`))