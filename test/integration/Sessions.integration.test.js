import chai from 'chai';
import supertest from 'supertest';
import config from '../../src/config/dotEnv.config.js';
import jwt from 'jsonwebtoken';

const expect = chai.expect;
const requester = supertest('http://localhost:8080');

describe('Testin Sessions', () => {

    it('Registar Usuario', async () => {

        const user = {
            first_name: 'Fabian',
            last_name: 'Parentelli',
            age: 35,
            role: 'admin',
            email: 'fabianParentelli007code@gmail.com',
            password: '1234'
        };

        const { statusCode, _body } = await requester.post('/api/users/register').send(user);

        expect(statusCode).to.be.eql(200);
        expect(_body).to.be.an('object');
        expect(_body.data).to.have.property('_id');
    });

    it('Loguear al usuario', async () => {

        const credentials = {
            email: 'fabianParentelli007code@gmail.com',
            password: '1234'
        };

        const { statusCode ,_body } = await requester.post('/api/users/login').send(credentials);
        
        const result = jwt.verify(_body.data.accesToken, config.privateKey);

        expect(statusCode).to.be.eql(200);
        expect(result).to.be.an('object');
        expect(result).to.have.property('user');
    });
});

// mocha test/integration/Sessions.integration.test.js