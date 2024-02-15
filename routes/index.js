const routes = (app) => {
    const authRoute = require('./auth.route');

    app.use('/auth', authRoute);
}

module.exports = routes;
