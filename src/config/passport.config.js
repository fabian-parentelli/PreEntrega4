import passport from 'passport';
import jwt from 'passport-jwt';
import config from '../config/dotEnv.config.js';

const JWTStrategy = jwt.Strategy;
const EXTRACTJWT = jwt.ExtractJwt;

const initializePassport = () => {

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: EXTRACTJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.privateKey
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload);
        } catch (error) {
            return done(error);
        };
    }));
};

export default initializePassport;