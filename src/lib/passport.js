const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const helpers = require('../lib/helpers');

// passport me permite hacer autenticacion con otras redes sociales
// en este caso se hara de forma local con base de datos

//SIGNIN
passport.use('local.signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  }, async (req, username, password, done) => {
    // consulto si el usuario existe
    const rows = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length > 0) { // si el hay filas entonces existe
      const user = rows[0];
      // compara password de form contra password cifrada de bd, devuelve true o false
      const validPassword = await helpers.matchPassword(password, user.password) 
      if (validPassword) {
        // no hay error entonces paso null
        done(null, user, req.flash('success', 'Welcome ' + user.username));
      } else {
        done(null, false, req.flash('message', 'Incorrect Password'));
      }
    } else { // si no hay filas entonces no existe
      return done(null, false, req.flash('message', 'Username does not exists.'));
    }
  }));

// SIGNUP
passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => { // done se ejecuta cuando termine la autenticacion
    const { fullname } = req.body;
    const newUser = {
        username,
        password,
        fullname
    };
    newUser.password = await helpers.encryptPassword(password);
    const result = await pool.query('INSERT INTO users SET ?', [newUser]);
    newUser.id = result.insertId; // propiedad de result, ver con console.log(result)
    return done(null, newUser);
}));

// cuando serializo guardo el id del usuario en la sesion
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// cuando desserializo tomo el id para obtener los datos de la sesion
passport.deserializeUser(async (id, done) => {
    const rows = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    done(null, rows[0]);
});