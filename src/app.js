const express = require('express');
const bodyParser = require('body-parser');

const { sequelize } = require('./model')
const { getProfile } = require('./middleware/getProfile')

const app = express();

app.use(bodyParser.json());
app.use(getProfile);

app.set('sequelize', sequelize);
app.set('models', sequelize.models);

const contracts = require("./routes/contracts");
const jobs = require("./routes/jobs");
const balances = require("./routes/balances");

app.use("/contracts", contracts);
app.use("/jobs", jobs);
app.use("/balances", balances);

module.exports = app;