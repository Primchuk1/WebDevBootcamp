// HINTS:
// 1. Import express and axios

// 2. Create an express app and set the port number.

// 3. Use the public folder for static files.

// 4. When the user goes to the home page it should render the index.ejs file.

// 5. Use axios to get a random secret and pass it to index.ejs to display the
// secret and the username of the secret.

// 6. Listen on your predefined port and start the server.

import express from "express";
import axios from "axios";

const app = express();
const port = 3000;
const URL = "https://secrets-api.appbrewery.com/random";

app.use(express.static('public'));

app.get("/", async (req, res) => {
    try {
        const response = await axios.get(URL);
        //const result = JSON.stringify(response.data);
        console.log(response);
        res.render("index.ejs", {
            secret: response.data["secret"],
            user: response.data.username
        })
    } catch (error) {
        res.render("index.ejs", {
            secret: error.response.data
        })
    }
})

app.listen(port, () => {
    console.log("listening at port " + port);
    
})