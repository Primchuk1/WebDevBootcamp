import express from "express";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
    res.send("<h2>Hello Worlds</h2>");
})

app.get("/About", (req, res) => {
    res.send("<h2>My name is Ivan</h2>");
})

app.get("/Contact", (req, res) => {
    res.send("<h2>Call me bro</h2>");
})


app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})