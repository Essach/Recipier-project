const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const groceryRouter = require("../routes/groceries.js");
const recipeRouter = require("../routes/recipes.js");

const server = express();

server.use(bodyParser.json());

const corsOptions = {
    origin: "*",
    methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
    // other options
};

server.use(cors(corsOptions));

server.use("/groceries", groceryRouter);
server.use("/recipes", recipeRouter);
server.get("/*", function (req, res) {
    res.sendFile(path.join(__dirname, "dist/index.html"), function (err) {
        if (err) {
            res.status(500).send(err);
        }
    });
});
server.get("/", function (req, res) {
    const options = {
        root: path.join(__dirname),
    };

    res.sendFile("index.html", options, function (err) {
        if (err) {
            console.error("Error sending file:", err);
        } else {
            console.log("Sent:", fileName);
        }
    });
});

server.listen(process.env.PORT || 8000, function (err) {
    if (err) console.error(err);
    console.log("Server listening...");
});

module.exports = server;
