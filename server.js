'use strict';

const express = require('express');
const dataJson = require("./data.json");

const app = express();
const port = 3000;

app.get("/", handleHomePage);
app.get("/favorite", handleFavorite);


function handleHomePage(req, res) {   
        let newRecipe = new Recipe(dataJson.title, dataJson.poster_path, dataJson.overview);
        res.json(newRecipe);
}

function handleFavorite(req, res) {
    res.send("Welcome to Favorite Page");
}

app.listen(port, handleListen);

function handleListen() {
    console.log(`Example app listening on port ${port}`);
}


function Recipe(title, poster_path, overview) {
    this.title = title;
    this.poster_path=poster_path;
    this.overview=overview;
}