import fetch from 'node-fetch';
import passport from "passport";
import local from "passport-local";
import GitHubStrategy from 'passport-github2';
import { DAOFactory } from '../../DAO/factory.js';

import { createHashPassword, checkPassword } from "../../utils/bcrypt.js";
import { entorno } from "../../config/env-config.js";

const LocalStrategy = local.Strategy;

export async function iniPassport() {
  const userDAO = await DAOFactory('user');

  passport.use(
    "login",
    //en este modelo de passport, solo se trabaja con usuario y contraseña, es porque es que para adaptarlo a nuestro modelo, indicamos en la siguiente linea que el usernameField va a ser el email del esquima de nuestro modelo de usuarios.
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const user = await userDAO.findOne({ email: username });
          
          if (!user) {
            console.log("The username: " + username + " was not found");
            return done(null, false);
          }
          if (!checkPassword(password, user.password)) {
            console.log("Invalid password, check and try again");
            return done(null, false);
          }
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.use(
    "register",
    //en este modelo de passport, solo se trabaja con usuario y contraseña, es porque es que para adaptarlo a nuestro modelo, indicamos en la siguiente linea que el usernameField va a ser el email del esquima de nuestro modelo de usuarios.
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        try {
          const infoOfBody = req.body;
          let user = await userDAO.findOne({ email: username });
          
          if (user) {
            console.log("The user already exist");
            return done(null, false);
          }

          let newUser = await userDAO.create({
            first_name: infoOfBody.first_name,
            last_name: infoOfBody.last_name,
            age: infoOfBody.age,
            country: infoOfBody.country,
            email: infoOfBody.email,
            password: createHashPassword(password),
          });
          console.log("User registration succesful");
          return done(null, newUser);

        } catch (e) {
          console.log("Error in the register process");
          console.log(e);
          return done(e);
        }
      }
    )
  );

  passport.use(
    'github',
    new GitHubStrategy(
      {
        //aqui abajo van los datos de identificacion de la app de github (son datos sensibles, no se publican)
        clientID: entorno.clientId,
        clientSecret: entorno.clientSecret,
        callbackURL: entorno.callbackUrl,
      },
      async (accesToken, _, profile, done) => {
        //console.log(profile);
        try {
          const res = await fetch('https://api.github.com/user/emails', {
            headers: {
              Accept: 'application/vnd.github+json',
              Authorization: 'Bearer ' + accesToken,
              'X-Github-Api-Version': '2022-11-28',
            },
          });
          const emails = await res.json();
          const emailDetail = emails.find((email) => email.verified == true);

          if (!emailDetail) {
            return done(new Error('cannot get a valid email for this user'));
          }
          profile.email = emailDetail.email;

          let user = await userDAO.findOne({ email: profile.email });
          if (!user) {
            let userCreated = await userDAO.create({
              first_name: profile._json.first_name || profile._json.login || "no-first_name",
              last_name: "no-last_name",
              age: 1,
              country: "no-country",
              email: profile.email,
              password: "no-password",
            });
            console.log('User Registration succesful');
            return done(null, userCreated);
          } else {
            console.log('User already exists');
            return done(null, user);
          }
        } catch (e) {
          console.log('Error en auth github');
          console.log(e);
          return done(e);
        }
      }
    )
  );

  //el siguiente metodo siempre es igual y nunca cambia
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  //el siguiente metodo siempre es igual y nunca cambia
  passport.deserializeUser(async (id, done) => {
    let user = await userDAO.findById(id);
    done(null, user);
  });
}
