import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import axios from "axios";

const app = express();
const port = 3000; 

const db = new pg.Client({
    host: "localhost",
    user: "postgres",
    database: "booknotes",
    password: "Primchuk1006*",
    port: 5432
});

db.connect();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

let books = [];
let current_sort = "rating";
let descending = true;

async function getBooks(sortBy = "title", order = "ASC") {
    let validColumns = ["title", "date_read", "rating"];
    if (!validColumns.includes(sortBy)) {
        sortBy = "title";
    }

    order = order === "DESC" ? "DESC" : "ASC"; // Validate order
    const result = await db.query(`SELECT * FROM books ORDER BY ${sortBy} ${order}`);
    return result.rows;
}


async function getBook(isbn){
    const result = await db.query("SELECT * FROM books WHERE isbn = $1", [isbn]);
    return result.rows[0];
}

async function deleteBook(isbn){
    await db.query("DELETE FROM books WHERE isbn = $1", [isbn]);
}


app.get("/", async (req, res) => {
    const sortBy = req.query.sort || "title";
    const order = req.query.order === "DESC" ? "DESC" : "ASC";
    
    books = await getBooks(sortBy, order);
    
    res.render("index.ejs", {
        books: books,
        sortBy: sortBy,
        order: order
    });
});


app.get("/notes/:isbn", async (req, res) => {
    const isbn = req.params.isbn;
    const book = await getBook(isbn);

    res.render("notes.ejs", {
        book
    })
})

app.post("/add-book", async (req, res) => {
    const { isbn, title, author, date_read, description, rating, notes } = req.body;
    await db.query(
        "INSERT INTO books (isbn, title, author, date_read, description, rating, notes) VALUES ($1, $2, $3, $4, $5, $6, $7)",
        [isbn, title, author, date_read, description, rating, notes]
    );
    res.redirect("/");
});

app.post("/edit-book", async (req, res) => {
    const { isbn, title, author, date_read, description, rating, notes } = req.body;
    await db.query(
        "UPDATE books SET title = $1, author = $2, date_read = $3, description = $4, rating = $5, notes = $6 WHERE isbn = $7",
        [title, author, date_read, description, rating, notes, isbn]
    );
    res.redirect("/notes/" + isbn);

})

app.post("/delete", async (req, res) => {
    const isbn = req.body["isbn"];
    await deleteBook(isbn);

    res.redirect("/");
    
})

app.listen(port, () => {
    console.log(`Server running at port ${port}`);
})
