import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

let post_collection = []; 

app.get("", (req, res) => {


    res.render("index.ejs", {
        posts: post_collection
    });
})

app.get("/cars", (req, res) => {
    const result = post_collection.find( post => post.title == "cars");
    res.send(result.body);
})

app.post("/Create_Post", (req, res) => {
    const post = {
        title: req.body["post_title"],
        body: req.body["post_body"],
        author: req.body["post_author"]
    }
    post_collection.push(post);

    res.redirect("/");
})

app.post("/Update_Post", (req, res) => {
    const post = post_collection[req.body["index"]];
    post.title = req.body["post_title"];
    post.body = req.body["post_body"];
    post.author = req.body["post_author"];

    res.redirect("/");
})

app.post("/Delete_Post", (req, res) => {
    post_collection.splice(req.body["index"], 1);

    res.redirect("/");
})

app.listen(port, () => {
    console.log(`Listening at port ${port}`);
})