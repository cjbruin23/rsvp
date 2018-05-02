const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 3000;
mongoose.connect('mongodb://localhost/rsvp');

app.set('views', './views');
app.set('view engine', 'pug')

app.use(express.static('./public'));
app.use(express.urlencoded({extended: true}));

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('hello');
});

const rsvpSchema = mongoose.Schema({
    name: String,
    email: String,
    attending: String,
    numberOfGuests: Number
})

const Person = mongoose.model('Person', rsvpSchema);


app.get('/', (req, res) => {
    res.render('index')
})

app.post('/reply', (req, res) => {
    let name = req.body.user_name;
    let email = req.body.user_email;
    let userRsvp = req.body.user_rsvp;
    let numberOfGuests = req.body.number_of_guests;


    let newPerson = new Person({
        name: name,
        email: email,
        attending: userRsvp,
        numberOfGuests: numberOfGuests
    })

    newPerson.save(function(err) {
        if (err) throw err;
      
        console.log('User saved successfully!');
      });

    res.render('reply');
})

app.get('/guests', (req, res) => {
    Person.find({}, function(err, users) {
        if (err) throw err;
      
        // object of all the users
        console.log(users);
      });
      res.send();
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))