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

server.listen(8000, () => console.log('Server is started...'));

module.exports = server

