import axios from 'axios';
import express from 'express';
import bodyParser from 'body-parser';

const port = 3000;
const app = express();
const URL = "https://api.potterdb.com/v1/";


app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("index.ejs");
})

app.get("/books", (req, res) => {
    res.render("books.ejs");
})

app.get("/movies", async (req, res) => {
    try {
        const response = await axios.get(URL + "movies");

        res.render("movies.ejs", {
            movies: response.data.data,
        });
    } catch (error) {
        console.log(error.message);
    }
})

app.listen(port, () => {
    console.log(`Listening at port ${port}`);
});