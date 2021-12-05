//--------boiler

const uniqid = require('uniqid');
const fs = require('fs')
const db = require('./db/db.json')
const express = require('express')
const path = require('path')
const app = express()
const PORT = process.env.PORT || 3001
const jsonFilePath = path.join(__dirname, "./db/db.json")

//-------

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'))


app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/notes.html'))
);




app.get('/api/notes', (req, res) => {
  console.info(`${req.method} request received for tips`);
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    console.log('data', data)
    res.json(JSON.parse(data))
  });
});

app.post('/api/notes', (req, res) => {

  const { title, text } = req.body
  if (title && text) {
    const newNote = {
      title,
      text,
      id: uniqid()
    }
    const response = {
      status: 'success',
      body: newNote,
    };

    console.log(response)
    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
      console.log('new note in read file', newNote)
      if (err)
        throw err;
      const parsedDb = JSON.parse(data)

      parsedDb.unshift(newNote)
      console.log('parsed data?', parsedDb)



      fs.writeFile(jsonFilePath, JSON.stringify(parsedDb), (err) => {

        if (err) throw err;
        console.log('new note!')
        res.json(parsedDb)

      })
    })
  }

})



app.delete(`/api/notes/:id`, (req, res) => {
  fs.readFile(jsonFilePath, 'utf8', (err, data) => {
    if (err)
      throw err;
    var parsedData = JSON.parse(data)
    console.log('delete id', req.params.id)
    let jsonPath = path.join(__dirname, './db/db.json')
    dbArray = []
    for (let i = 0; i < parsedData.length; i++) {
      if (parsedData[i].id !== req.params.id) {
        dbArray.push(parsedData[i])
      }
    }
    console.log('new db', dbArray)

    fs.writeFile(jsonPath, JSON.stringify(dbArray), (err, data) => {
      res.json(dbArray)
      if (err) throw err;
      console.log('deleted! note!')
    })
  })
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'))
});

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`))