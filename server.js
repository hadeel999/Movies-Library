'use strict';

const express = require('express');
const dataJson = require("./data.json");
const cors=require('cors');
const axios=require('axios').default;
require('dotenv').config()
const apiKey=process.env.API_KEY;

const app = express();
app.use(cors());
const port = 3000;

app.get("/", handleHomePage);
app.get("/favorite", handleFavorite);
app.get("/trending",handleTrending);
app.get("/search",handleSearch);

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

app.listen(port, handleListen);

function handleListen() {
    console.log(`Example app listening on port ${port}`);
}


function Recipe(id,title,release_date, poster_path, overview) {
    this.id=id;
    this.title = title;
    this.release_date=release_date;
    this.poster_path=poster_path;
    this.overview=overview;
}