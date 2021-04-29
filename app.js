const express = require("express");
const { urlencoded } = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.use(urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

const articlesSchema = mongoose.Schema({
  title: String,
  content: String,
});

const Articles = mongoose.model("Articles", articlesSchema);

app
  .route("/articles")
  .get((req, res) => {
    Articles.find((err, foundArticles) => {
      !err ? res.send(foundArticles) : res.send(err);
    });
  })
  .post((req, res) => {
    const newArticle = new Articles({
      title: req.body.title,
      content: req.body.content,
    });

    newArticle.save((err, foundArticle) => {
      !err ? res.send(foundArticle) : res.send(err);
    });
  })
  .delete((req, res) => {
    Articles.deleteMany((err) => {
      !err ? res.send("Successfully Deleted all articles") : res.send(err);
    });
  });

app
  .route("/articles/:articleTitle")
  .get((req, res) => {
    const { articleTitle } = req.params;

    Articles.findOne({ title: articleTitle }, (err, foundArticle) => {
      !err ? res.send(foundArticle) : res.send(err);
    });
  })
  .put((req, res) => {
    const { articleTitle } = req.params;
    const { title, content } = req.body;

    Articles.update(
      { title: articleTitle },
      { title: title, content: content },
      { overwrite: true },
      (err) => {
        !err ? res.send("Successfully updated article") : res.send(err);
      }
    );
  })
  .patch((req, res) => {
    const { articleTitle } = req.params;
    const updateContent = req.body;

    Articles.update(
      { title: articleTitle },
      { $set: updateContent },
      (err) => {
      !err ? res.send("Successfully updated article") : res.send(err);
    });
  })
  .delete((req, res) => {
    const { articleTitle } = req.params;

    Articles.deleteOne(
      { title: articleTitle },
      (err) => {
      !err ? res.send("Successfully deleted article") : res.send(err);
    });
  });

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
