
const express = require('express');
const bodyParser = require('body-parser');
const useragent = require('express-useragent');
const cors = require('cors');
const routes = require('./routes');
const {ConnectDatabase} = require('./configs/database.config');
const HandleError = require('./middlewares/handleError.middleware');
const NotFound = require('./middlewares/notFound.middleware');
const Log = require('./middlewares/logger.middleware');
const path = require("path");
require('dotenv').config({path: path.resolve(__dirname, './.env')});

const app = express();

ConnectDatabase().then(r => r);

app.use(cors());
app.use(useragent.express());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())
app.set('trust proxy', true)
app.use(Log);

routes(app);

app.use(NotFound);
app.use(HandleError);

module.exports = app;
