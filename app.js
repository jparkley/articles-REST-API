
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const app = new express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true})); // in order to parse requests
app.use(express.static("public")); // use "public" directory for static files

// Connect to MongoDB
const dbUrl = "mongodb+srv://" + dotenv.parsed.DB_USER + ":" + dotenv.parsed.DB_PASSWORD  + "@" + dotenv.parsed.DB_HOST + "/" + dotenv.parsed.DB_DATABASE;
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
//mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true, useUnifiedTopology: true });

const articleSchema = {
  title: String,
  content: String
};
const Article = mongoose.model("Article", articleSchema); // create model using schema


///////////// Request targetting all articles/////////////
/////////////////////////////////////////////////////////
app.route("/articles") // Routing and chaining methods of get, post, and delete
.get(function(req, res){
  Article.find(function(err, foundArticles){
    if(!err){
      if(foundArticles){
        res.send(foundArticles);
      }
    } else {
      res.send(err);
    }
  });
})
.post(function(req, res){
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });
  newArticle.save(function(err){
    if(!err){
      res.send("Successfully added");
    } else {
      res.send(err);
    }
  });
})
.delete(function(req, res){
    Article.deleteMany(function(err){
      if(!err){
        res.send("Successfully deleted");
      } else {
        res.send(err);
      }
    });
});


////// Request targetting a specific article/////////////
/////////////////////////////////////////////////////////
app.route("/articles/:articleTitle")
.get(function(req, res){
    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
    if (!err) {
      if (foundArticle) {
        res.send(foundArticle);
      } else {
        res.send("No matching article found");
      }
    } else {
      res.send(err);
    }
  });
})
.put(function(req, res){
    Article.update(
      {title: req.params.articleTitle},
      {title: req.body.title, content: req.body.content},
      {overwrite: true},
      function(err){
        if (!err) {
          res.send("Successfully updated")
        } else {
          res.send(err);
        }
    });
})
.patch(function(req, res){
  Article.update(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err){
      if (!err) {
        res.send("Successfully updated(patch)")
      } else {
        res.send(err);
      }
    });
})
.delete(function(req, res){
  Article.deleteOne({title: req.params.articleTitle}, function(err){
    if (!err) {
      res.send("Successfully deleted the article")
    } else {
      res.send(err);
    }
  });
});



app.listen(3000, function(){
  console.log("server started");
});
