const EJS = require("ejs");
const bodyParser = require("body-parser");
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));

let recipesArray = [];

app.get("/", function (req, res) {
  res.render("index",{recipesArray: recipesArray});
});

app.post("/", function (req, res) {
  // Generate an array of URLs to scrape
  const urls = Array.from({ length: 101 }, (v, i) =>`https://pinchofyum.com/recipes/all/page/${i+1}`);

  // Use Promise.all() to wait for all the scraping to complete
  Promise.all(urls.map((url) => axios.get(url)))
    .then((responses) => {

      responses.forEach((response) => {
        const $ = cheerio.load(response.data);

        const vegan = req.body.vegan;
        const veggi = req.body.veggi;
        const dessert = req.body.dessert;
        const fish = req.body.fish;
        const all = req.body.fish;

        if (all) {
          $("article.category-all").each((i, element) => {
            const link = $(element).find("a.block").attr("href");
            const title = $(element).find("h3").text();
            recipesArray.push({ title: title, link: link });
          });
        } else if (veggi) {
          $("article.category-vegetarian").each((i, element) => {
            const link = $(element).find("a.block").attr("href");
            const title = $(element).find("h3").text();
            recipesArray.push({ title: title, link: link });
          });
        } else if (vegan) {
          $("article.category-vegan").each((i, element) => {
            const link = $(element).find("a.block").attr("href");
            const title = $(element).find("h3").text();
            recipesArray.push({ title: title, link: link });
          });
        } else if (dessert) {
          $("article.category-dessert").each((i, element) => {
            const link = $(element).find("a.block").attr("href");
            const title = $(element).find("h3").text();
            recipesArray.push({ title: title, link: link });
          });
        } else if (fish) {
          $("article.category-fish").each((i, element) => {
            const link = $(element).find("a.block").attr("href");
            const title = $(element).find("h3").text();
            recipesArray.push({ title: title, link: link });
          });
        } 
      });    

      res.render("index", {recipesArray: recipesArray});
    })
    .catch((error) => {
      console.log(error);
      res.render("error");
    });
});

app.listen(3000, function () {
  console.log(`App listening on port 3000!`);
});