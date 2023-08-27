import chai from "chai";
import supertest from "supertest";
import config from '../../src/config/dotEnv.config.js';
import jwt from 'jsonwebtoken';

const expect = chai.expect;
const requester = supertest('http://localhost:8080');

describe('Testin Carts', () => {

    let authToken;

    before(async () => {

        const user = {
            _id: '64cfcc2994a5b6d8537988e6',
            first_name: 'faraday',
            last_name: 'Amarilla',
            email: 'fara@gmail.com',
            age: 33,
            password: '$2b$10$6DiJvuNJW3Vib8zghEhaYeTi7iwpu3cih8nZ1JAITWJVlWWy4naUy',
            role: 'user' 
        };

        authToken = jwt.sign({ user }, config.privateKey, { expiresIn: '1m' });
    });

    it('POST /api/carts crear un nuevo carrito', async () => {

        const { statusCode, _body } = await requester.post('/api/carts');

        expect(statusCode).to.be.eql(200);
        expect(_body.data.products).to.be.an('array'); // verifico si es un array
        expect(_body.data.products).to.be.empty;       // verifico si el array lo devuelve vacío.
    });

    it('GET /api/carts/:cid Obtener un carrito por su Id', async () => {

        const { _body } = await requester.post('/api/carts');
        const cid = _body.data._id;

        const result = await requester.get(`/api/carts/${cid}`);

        expect(result.statusCode).to.be.eql(200);
        expect(result._body.data[0]._id).to.be.eql(cid);
    });

    it('POST api/carts/:cid/products/:pid Agregar un producto al carrito', async () => {

        const cartResult = await requester.post('/api/carts');
        const cid = cartResult._body.data._id;
        const pid = '64cfc8923e4d0d4a66ff0c8c';

        const result = await requester.post(`/api/carts/${cid}/products/${pid}`).set('Authorization', `Bearer ${authToken}`);

        expect(result.statusCode).to.be.eql(200);
        expect(result._body.data).to.have.property('acknowledged');

        const resultCart = await requester.get(`/api/carts/${cid}`);

        const productInCart = resultCart._body.data[0].products;
        const existProduct = productInCart.some(productObj => productObj.product._id === pid);

        expect(resultCart.statusCode).to.be.eql(200);
        expect(existProduct).to.be.true;
    });
    
    it('Delete /:cid/products/:pid Eliminar un producto al carrito', async () => {

        const cartResult = await requester.post('/api/carts');
        const cid = cartResult._body.data._id;
        const pid = '64cfc8923e4d0d4a66ff0c8c';
        await requester.post(`/api/carts/${cid}/products/${pid}`).set('Authorization', `Bearer ${authToken}`);

        const { statusCode, _body } = await requester.delete(`/api/carts/${cid}/products/${pid}`).set('Authorization', `Bearer ${authToken}`);

        expect(statusCode).to.be.eql(200); 
        expect(_body.data).to.have.property('acknowledged');

        const resultCart = await requester.get(`/api/carts/${cid}`);
        const productInCart = resultCart._body.data[0].products;
        const existProduct = productInCart.some(productObj => productObj.product._id === pid);
        expect(existProduct).to.be.false;
    });
});

// mocha test/integration/Carts.integration.test.js