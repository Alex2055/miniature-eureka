const fs = require('fs');
const express = require('express');
const app = express()
const PORT = process.env.PORT || 3001;
const path = require('path')
const { v4: uuidv4 } = require('uuid');



app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));

})



app.get('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', function (err, data) {
    if (err) {
      res.json([]);
    }
    else {
      res.json(JSON.parse(data));
    }
  })

});

app.post('/api/notes', (req, res) => {

  const note = req.body;
  note.id = uuidv4();
  fs.readFile('./db/db.json', function (err, data) {
    let notes = [];
    if (!err && data) {
      notes = JSON.parse(data);
    }
    notes.push(note);

    fs.writeFile('./db/db.json', JSON.stringify(notes), err => {
      if (err) {
        res.status(500).send('error');
      }
      else {
        res.json(note)
      }
    })
  })
});

app.delete('/api/notes/:id', (req, res) => {
  const id = req.params.id;
  
  fs.readFile('./db/db.json', (err, data) => {
    let notes = [];
    if (!err && data) {
      notes = JSON.parse(data);
    }
    notes = notes.filter(note => note.id !== id);
    fs.writeFile('./db/db.json', JSON.stringify(notes), err => {
      if(err){
        res.status(500).send('error');
      }
      else{
        res.sendStatus(200);
      }
    })

  });
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));

});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})