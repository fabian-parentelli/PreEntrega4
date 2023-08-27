import swaggerJSDoc from "swagger-jsdoc";
import { __mainDirname } from "../utils/path.js";

const swaggerPtions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentacion del proyecto e-commers de Coder House',
            description: 'E-comers funcional con CRUD de usuarios, productos y manejo de ventas'
        }
    },
    apis: [`${__mainDirname}/docs/**/*.yaml`]
};

export const specs = swaggerJSDoc(swaggerPtions);