const express = require("express");
const fs = require("fs");
const PORT = 3000;

const app = express();

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/guestbook", async (req, res) => {
  const data = require("./JSON_Guestbook_data.json");

  let results = fs.readFileSync("./public/guestbook.html", "utf-8");

  data.forEach((element) => {
    results += `<tr>
        <td>${element.id}</td>
        <td>${element.username}</td>
        <td>${element.country}</td>
        <td>${element.date}</td>
        <td>${element.message}</td>
      </tr>`;
  });

  res.send(results);
});

app.listen(PORT, () => {
  console.log(`Server is runninn on port ${PORT}.`);
});
