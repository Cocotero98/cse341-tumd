const { fileURLToPath } = require('url');
const { dirname, sep } = require('path');

const express = require('express');

const app = express();

const router = express.Router;

require('dotenv').config();

app.use(require('cors')());

const mongoose = require('mongoose');

require('./services/connection')(mongoose);

const { auth } = require('express-openid-connect');

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SECRET,
    baseURL: process.env.BASE_URL,
    clientID: process.env.CLIENT_ID,
    issuerBaseURL: process.env.ISSUER_URL
};

app.use(auth(config));

const port = process.env.PORT || 3000;

app.listen(port);

const { requiresAuth } = require('express-openid-connect');

const swagger_ui = require('swagger-ui-express');

let swagger_document = require('./swagger.render.json');

if(process.env.ENVIRONMENT == 'local') {
    swagger_document = require('./swagger.local.json');
}

// Storing all dependencies inside a single object so that this object can be passed around throughout the application
// Otherwise, required modules would need to be imported inside services, controllers, and models
const dependencies = {
    app: app,
    mongoose: mongoose,
    router: router,
    requires_authentication: requiresAuth,
    swagger_ui: swagger_ui,
    swagger_document: swagger_document
};

// Loading all Mongoose models
require('./models/song')(dependencies);

require('./models/artist')(dependencies);

require('./models/review')(dependencies);

require('./models/genre')(dependencies);

require('./models/user')(dependencies);

// Assigning them to dependencies.models object so that the models can easily be passed around the application
dependencies.models = {
    song: mongoose.model('Song'),
    artist: mongoose.model('Artist'),
    review: mongoose.model('Review'),
    genre: mongoose.model('Genre'),
    user: mongoose.model('User')
};

const configuration = {
    dir: {
    root: __dirname,
    static: __dirname + sep + 'static' + sep,
    views: __dirname + sep + 'views' + sep
    }
};

app.set('view engine', 'ejs');
app.set('views', configuration.dir.views);
app.use(express.static( configuration.dir.static ));

require('./routes')(dependencies);