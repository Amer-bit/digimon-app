"use strict";

require("dotenv").config();
const express = require("express");
const methodOverRide = require("method-override");
const cors = require("cors");
const pg = require("pg");
const superagent = require("superagent");

const app = express();

app.set("view engine", "ejs");

app.use(cors());
app.use(methodOverRide("_method"));
const client = new pg.Client(process.env.DATABASE_URL);
const PORT = process.env.PORT || 4000;
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public"));

//////////////////// Routes Definition \\\\\\\\\\\\\\\\\\\\\\\\

// app.get('/', (req, res)=>{res.send('hey')})

app.get("/", favouriteHandler);
app.post("/addfav", addCharHandler);
app.delete('/deletechar/:charid', deleteHandler);
app.put('/updatechar/:charid', updateHandler);

/////////////////////// Routes Handlers \\\\\\\\\\\\\\\\\\\\

function favouriteHandler(req, res) {
  const url = `https://digimon-api.herokuapp.com/api/digimon`;
  superagent(url).then((data) => {
    const apiResults = data.body;
    res.render("char", { favchar: apiResults });
  });
}

function addCharHandler(req, res) {
  let { name, img, level } = req.body;
  const SQL = `INSERT INTO favchar (name, img, level) VALUES ($1,$2,$3) RETURNING *;`;
  const safeValues = [name, img, level];
  client.query (SQL, safeValues)


const SQL2 = `SELECT * FROM favchar`
client.query(SQL2)
.then(data => {
    const dbChar = data.rows;    
    res.render('favourite', {dbChar : dbChar});
})
}

function deleteHandler(req ,res) {    
    const charId = req.params.charid;
    const SQL = `DELETE FROM favchar WHERE id=$1;`;
    const safeValues = [charId];
    client.query(SQL, safeValues)
    .then(
        res.redirect('/')
    )
    
}

function updateHandler(req, res) {
    const charId = req.params.charid;
    const {name, img, level} = req.body
    const SQL = `UPDATE favchar SET name=$1, img=$2, level=$3 WHERE id=$4;`
    const safeValues = [name,img, level,charId];
    client.query(SQL, safeValues)
    .then(data => {
        res.redirect('/char')
    })
    .catch((error)=> {
        errorHandler(req, res, error)
    })
    
}


function errorHandler(req, res,error){
    res.status(501).send(error)
}

//////////////////////////////////////////////

client
  .connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`The server is up and running on ${PORT}`);
    });
  })
  .catch((error) => {
    throw new Error(error);
  });
