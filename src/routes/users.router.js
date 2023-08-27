import Router from "./router.js";
import * as userController from '../controllers/users.controller.js';
import { passportEnum } from "../config/enums.config.js";
import uploader from '../utils/multer.js';

export default class UsersRouter extends Router {
    init() {
        this.post('/login', ['PUBLIC'], passportEnum.NOTHING, userController.loginUser);
        this.post('/register', ['PUBLIC'], passportEnum.NOTHING, userController.registerUser);
        this.get('/current', ['PUBLIC'], passportEnum.JWT, userController.current);
        this.post('/recover_password', ['PUBLIC'], passportEnum.NOTHING, userController.recoverPassword);
        this.put('/new_password', ['PUBLIC'], passportEnum.JWT, userController.newPassword);
        this.put('/premium/:uid', ['USER', 'PREMIUM'], passportEnum.JWT, userController.changeRole);
        this.post('/:uid/documents', ['USER'], passportEnum.JWT, uploader.array('documents'), userController.docUpload);
    };
};