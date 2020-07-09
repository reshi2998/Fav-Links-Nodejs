const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const MySQLStore = require('express-mysql-session');
const passport = require('passport');

const { database } = require('./keys');

// INITIALIZATIONS
const app = express();
require('./lib/passport'); // sabe de la autenticacion que estoy creando

// SETTINGS
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}))
app.set('view engine', '.hbs');

// MIDDLEWARES (funciones que se ejecutan cada vez que se envia una peticion al server)
app.use(session({
    secret: 'mysqlnodesession',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
}))
app.use(flash());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(passport.initialize()); // para inicializar passport
app.use(passport.session()); // se almacena passport en una sesion

// GLOBAL VARIABLES
app.use((req, res, next) => {
    app.locals.message = req.flash('message');
    app.locals.success = req.flash('success');
    app.locals.user = req.user; // se guarda user para ser accedida desde cualquier vista
    next();
});

// ROUTES
app.use(require('./routes/index'));
app.use(require('./routes/authentication'));
app.use('/links', require('./routes/links'));

// PUBLIC
app.use(express.static(path.join(__dirname, 'public')));

// STARTING THE SERVER
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});

