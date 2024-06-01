const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');

const groceryRouter = require('./routes/groceries.js');
const recipeRouter = require('./routes/recipes.js');

const server = express();

server.use(bodyParser.json());
server.use(cors());

server.use('/groceries', groceryRouter);
server.use('/recipes', recipeRouter);
server.get("/*", function (req, res) {
    res.sendFile(path.join(__dirname, "dist/index.html"), function (err) {
    if (err) {
        res.status(500).send(err);
    }
    });
});

server.listen(process.env.PORT ||  8000, () => console.log('Server is started...'));

module.exports = server

