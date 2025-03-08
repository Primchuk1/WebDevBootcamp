import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "Primchuk1006*",
  port: 5432
});

db.connect();


const app = express();
const port = 3000;



app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


let error;

app.get("/", async (req, res) => {
  //Write your code here.
  const result = await db.query(
    "SELECT country_code FROM visited_countries"
  );
  
  const rows = result.rows;
  let countries = [];
  rows.forEach( (country) => { 
    countries.push(country.country_code);
  });
  console.log(countries);
  res.render("index.ejs", {
    countries: countries,
    total: countries.length,
    error: error
  });
  //db.end();
});

app.post("/add", async (req, res) => {
  const country = req.body.country;
  if(country){
    const result = await db.query("SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%';", [country.toLowerCase()]);
    if(result.rows.length > 0){
      const country_code = result.rows[0].country_code;
      const visitedResults = await db.query("SELECT * FROM visited_countries WHERE country_code = $1", [country_code]);
      if(visitedResults.rows.length > 0){
        error = "Already marked as visited";
      } else {
        await db.query("INSERT INTO visited_countries (country_code) VALUES ($1)", [country_code]);
        
      }
    } else {
      error = "Country not found in the database";
    }
    res.redirect("/");
  } else {
    res.status(400).json({error: "Bad bad"});
  }
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
