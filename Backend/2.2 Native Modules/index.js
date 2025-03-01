const fs = require("fs");

/*
fs.writeFile("message.txt", "Hello from NodeJSivan", err => {
    if (err) {
      console.error(err);
    } else {
        console.log("success");
    }
  });
*/

  fs.readFile("message.txt", "utf8", (err, data) => {
    if (err) throw err;
    console.log(data);
  });