import express from "express";

const app = express();
const port = 3000;

app.use(logger);

app.get("/", (req, res) => {
  res.send("Hello");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});


function logger(req, res, next) {
  console.log(`Method: ${req.method}`);
  console.log(`URL: ${req.url}`);
  next();

}