'use strict';
require('dotenv').config();
const URL=process.env.link;
const port = 3003;
const dataJson = require("./data.json");

const express = require('express');
const cors=require('cors');
const bodyParser=require('body-parser');


const {Client} = require('pg');
const client = new Client(URL);
const axios=require('axios').default;

//const pg=require('pg');
//const client=new pg.Client(URL);
const apiKey=process.env.API_KEY;


const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.get("/", handleHomePage);
app.get("/favorite", handleFavorite);
app.get("/trending",handleTrending);
app.get("/search",handleSearch);
app.post("/addMovie",handleAddMovies);
app.get("/getMovies",handleGetMovies);
app.use("*",handleNotFound);
app.use(handleError);


function handleHomePage(req, res) {   
        let newRecipe = new Recipe(dataJson.title, dataJson.poster_path, dataJson.overview);
        res.json(newRecipe);
}

function handleFavorite(req, res) {
    res.send("Welcome to Favorite Page");
}

function handleTrending(req,res){
axios.get("https://api.themoviedb.org/3/trending/all/week?api_key=37ddc7081e348bf246a42f3be2b3dfd0&language=en-US")
    .then(result=>{
        console.log(result.data.results);
        let recipes=result.data.results.map(recipe=>{
            return new Recipe(recipe.id,recipe.title,recipe.release_date,recipe.poster_path,recipe.overview);
        })
        res.json(recipes);
    })
    .catch((error)=>{
        console.log(error);
        //res.send("Inside catch");
    })
}

function handleSearch(req,res){
    let recipeName=req.query.recipeName;
    let url=`https://api.themoviedb.org/3/search/movie?query=${recipeName}&api_key=668baa4bb128a32b82fe0c15b21dd699`;
axios.get(url)
    .then(result=>{
        res.json(result.data.results);
    })
    .catch((error)=>{
        console.log(error);
        //res.send("Inside catch");
    })

    let recipeName2=req.query.recipeName2;
    let url2=`https://api.themoviedb.org/3/search/keyword?query=${recipeName2}&api_key=668baa4bb128a32b82fe0c15b21dd699`;
axios.get(url2)
    .then(result=>{
        res.json(result.data.results);
    })
    .catch((error)=>{
        console.log(error);
        //res.send("Inside catch");
    })

    let recipeName3=req.query.recipeName3;
    let url3=`https://api.themoviedb.org/3/search/person?query=${recipeName3}&api_key=668baa4bb128a32b82fe0c15b21dd699`;
axios.get(url3)
    .then(result=>{
        res.json(result.data.results);
    })
    .catch((error)=>{
        console.log(error);
        //res.send("Inside catch");
    })

}

function handleNotFound(req,res){
res.send("Page not found");
}

function handleError(err,req,res){
    res.status(500).send(err);
}

function handleAddMovies(req,res){
console.log(req.body);
const id=req.body.id;
const title=req.body.title;
const release_date=req.body.release_date;
const poster_path=req.body.poster_path;
const overview=req.body.overview;
//const {id,title,release_date,poster_path,overview}=req.body;
let sql=`INSERT INTO movie(id,title,release_date,poster_path,overview) VALUES($1, $2, $3, $4, $5) RETURNING *;`
let values=[id,title,release_date,poster_path,overview];
client.query(sql,values).then((result)=>{
    console.log(result.rows);
    //return res.send("HHHHHHHHHHHHHHHHHH");
    //return res.json(result.rows);
    return res.status(201).json(result.rows[0]);
}).catch((err) => {
    handleError(err, req, res);
});
}

function handleGetMovies(req,res){

       let sql = 'SELECT * from movie;'
    client.query(sql).then((result) => {
        console.log(result);
        res.json(result.rows);
    }).catch((err) => {
        handleError(err, req, res);
    });
}

client.connect().then(()=>{
    app.listen(port,()=>{
        console.log(`Server is listening ${port}`);
    });
})

/*app.listen(port, handleListen);

function handleListen() {
    console.log(`Example app listening on port ${port}`);
}*/


function Recipe(id,title,release_date, poster_path, overview) {
    this.id=id;
    this.title = title;
    this.release_date=release_date;
    this.poster_path=poster_path;
    this.overview=overview;
}