import express from "express";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "https://secrets-api.appbrewery.com/";

//TODO 1: Fill in your values for the 3 types of auth.
const yourUsername = "primchuk";
const yourPassword = "MyPassword123!";
const yourAPIKey = "051c8479-2694-4d12-a5cf-1c00be301472";
const yourBearerToken = "f7eaa5e7-c3b5-4d5e-a7b6-e0c90573f25d";

app.get("/", (req, res) => {
  res.render("index.ejs", { content: "API Response." });
});

app.get("/noAuth", async (req, res) => {
  try {
    const response = await axios.get(API_URL + "random");
    const result = JSON.stringify(response.data);
    res.render("index.ejs", {
      content: result
    })
  } catch(error) {
    res.render("index.ejs" , {
      content: error
    })
  }
  //TODO 2: Use axios to hit up the /random endpoint
  //The data you get back should be sent to the ejs file as "content"
  //Hint: make sure you use JSON.stringify to turn the JS object from axios into a string.
});

app.get("/basicAuth", async (req, res) => {
  const page = 2;
  const URL = API_URL + "all?page=" + page;
  try {
    const response = await axios.get(URL, {
      auth: {
        username: yourUsername,
        password: yourPassword
      }
    });
    const result = JSON.stringify(response.data);
    res.render("index.ejs", {
      content: result
    });
  } catch(error) {
    res.render("index.ejs", {
      content: error
    })
  }
  //TODO 3: Write your code here to hit up the /all endpoint
  //Specify that you only want the secrets from page 2
  //HINT: This is how you can use axios to do basic auth:
  // https://stackoverflow.com/a/74632908
  /*
   axios.get(URL, {
      auth: {
        username: "abc",
        password: "123",
      },
    });
  */
});

app.get("/apiKey", async (req, res) => {
  const endpoint = "filter";
  const score = 5;
  const URL = API_URL + endpoint + "?score=" + score + "&apiKey=" + yourAPIKey;
  try {
    const response = await axios.get(URL);
    const result = JSON.stringify(response.data);
    res.render("index.ejs", {
      content: result,
    })
  } catch (error){
    res.render("index.ejs", {
      content: error
    })
  }
  //TODO 4: Write your code here to hit up the /filter endpoint
  //Filter for all secrets with an embarassment score of 5 or greater
  //HINT: You need to provide a query parameter of apiKey in the request.
});

app.get("/bearerToken", async (req, res) => {
  const endpoint = "secrets/";
  const id = 42;
  const URL = API_URL + endpoint + id;
  try {
    const response = await axios.get(URL, {
      headers: {
        Authorization: `Bearer ${yourBearerToken}`
      }
    });
    const result = JSON.stringify(response.data);
    res.render("index.ejs", {
      content: result
    })
  } catch (error) {
    res.render("index.ejs", {
      content: error
    })
  }

  //TODO 5: Write your code here to hit up the /secrets/{id} endpoint
  //and get the secret with id of 42
  //HINT: This is how you can use axios to do bearer token auth:
  // https://stackoverflow.com/a/52645402
  /*
  axios.get(URL, {
    headers: { 
      Authorization: `Bearer <YOUR TOKEN HERE>` 
    },
  });
  */
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
