'use strict'

require('dotenv').config();
const express = require('express');;
const methodOverRide = require('method-override');
const cors = require('cors');
const pg = require('pg');
const superagent = require('superagent')

const app = express();

app.set ('view engine', 'ejs');

app.use(cors());
app.use(methodOverRide('_method'));
const client = new pg.Client(process.env.DATABASE_URL);
const PORT = process.env.PORT || 4000;

//////////////////// Routes Definition \\\\\\\\\\\\\\\\\\\\\\\\

// app.get('/', (req, res)=>{res.send('hey')})

app.get('/char', favouriteHandler);
app.get('/addfav', addCharHandler);



/////////////////////// Routes Handlers \\\\\\\\\\\\\\\\\\\\

function favouriteHandler(req, res) {
    const url = `https://digimon-api.herokuapp.com/api/digimon`
    superagent(url)
    .then( data => {
       const apiResults = data.body;
       res.render('favourite', {favchar : apiResults});
        
    })
}

function addCharHandler(req, res){
   
    
}














app.listen(PORT, () => {console.log( `The server is up and running on ${PORT}`)})