import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "Primchuk1006*",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let currentUserId = 1;

async function checkVisisted(user_id) {
  const result = await db.query("SELECT country_code FROM visited_countries WHERE user_id = $1", [user_id]);
  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  return countries;
}

async function getUsers() {
  const users = await db.query("SELECT * FROM users");
  return users.rows;
}

async function getUserInfo(user_id) {
  const userInfo = await db.query("Select * FROM users INNER JOIN visited_countries ON users.id = visited_countries.user_id WHERE users.id = $1", [user_id]);
  return userInfo.rows;
}

app.get("/", async (req, res) => {
  const users = await getUsers();
  const countries = await checkVisisted(currentUserId);
  const info = await getUserInfo(currentUserId);
  console.log(info);
  const current_color = (users.find((user) => user.id === currentUserId)).color;
  res.render("index.ejs", {
    countries: countries,
    total: countries.length,
    users: users,
    color: current_color,
  });
});
app.post("/add", async (req, res) => {
  const input = req.body["country"];

  try {
    const result = await db.query(
      "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%';",
      [input.toLowerCase()]
    );

    const data = result.rows[0];
    const countryCode = data.country_code;
    try {
      await db.query(
        "INSERT INTO visited_countries (country_code, user_id) VALUES ($1, $2)",
        [countryCode, currentUserId]
      );
      res.redirect("/");
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/user", async (req, res) => {
  if(req.body["add"] === "new"){
    res.render("new.ejs");
  } else{
    try {
      currentUserId = parseInt(req.body.user);
      res.redirect("/");
    } catch (err) {
      console.log(err);
    }
  }

  
});

app.post("/new", async (req, res) => {
  const name = req.body["name"];
  const color = req.body["color"];

  const result = await db.query("INSERT INTO users (name, color) VALUES ($1, $2) RETURNING id", [name, color]);
  currentUserId = result.rows[0].id;
  res.redirect("/");

  //Hint: The RETURNING keyword can return the data that was inserted.
  //https://www.postgresql.org/docs/current/dml-returning.html
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
