import * as userService from '../services/users.service.js';
import { logger } from '../middlewares/loggs/logger.js';
import { UserNotFound } from '../utils/custom-exceptions.js';

const registerUser = async (req, res) => {
    const user = req.body;
    try {
        const result = await userService.saveUser(user);
        res.sendSuccess(result.payload);
    } catch (error) {
        logger.error(error.message);
        if (error instanceof UserNotFound) res.sendClientError(error.message);
        res.sendServerError(error.message);
    };
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await userService.loginUser(email, password);
        res.sendSuccess(result);
    } catch (error) {
        logger.error(error.message);
        if (error instanceof UserNotFound) res.sendClientError(error.message);
        res.sendServerError(error.message);
    };
};

const current = async (req, res) => {
    try {
        const { user } = req.user;
        res.sendSuccess(user);
    } catch (error) {
        res.sendServerError(error.message);
    };
};

const recoverPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const result = await userService.recoverPassword(email);
        res.sendSuccess(result);
    } catch (error) {
        logger.error(error.message);
        if (error instanceof UserNotFound) res.sendClientError(error.message);
        res.sendServerError(error.message);
    };
};

const newPassword = async (req, res) => {
    const { user } = req.user;
    const { password } = req.body;
    try {
        const result = await userService.newPassword(user, password);
        res.sendSuccess(result);
    } catch (error) {
        logger.error(error.message);
        if (error instanceof UserNotFound) res.sendClientError(error.message);
        res.sendServerError(error.message);
    };
};

const changeRole = async (req, res) => {
    const { user } = req.user;
    const id = req.params.uid;
    try {
        const result = await userService.changeRole(id, user);
        res.sendSuccess(result);
    } catch (error) {
        logger.error(error.message);
        if (error instanceof UserNotFound) res.sendClientError(error.message);
        res.sendServerError(error.message);
    };
};

const changeRoleAdmin = async (req, res) => {
    const id = req.params.uid;
    try {
        const result = await userService.changeRoleAdmin(id);
        if(result) res.sendSuccess(result);
    } catch (error) {
        logger.error(error.message);
        if (error instanceof UserNotFound) res.sendClientError(error.message);
        res.sendServerError(error.message);
    };
};

const docUpload = async (req, res) => {
    const { uid } = req.params;
    const uploadedFiles = req.files.map(file => file.filename);
    const data = req.body
    try {
        const result = await userService.docUpload(uid, uploadedFiles, data.fileType)
        res.sendSuccess(result);
    } catch (error) {
        logger.error(error.message);
        if (error instanceof UserNotFound) res.sendClientError(error.message);
        res.sendServerError(error.message);
    };
};

const getAll = async (req, res) => {
    try {
        const result = await userService.getAll();
        if (result) res.sendSuccess(result);
    } catch (error) {
        logger.error(error.message);
        if (error instanceof UserNotFound) res.sendClientError(error.message);
        res.sendServerError(error.message);
    };
};

const deleteUsers = async (req, res) => {
    try {
        const result = await userService.deleteUsers();
        if (result) res.sendSuccess(result);
    } catch (error) {
        logger.error(error.message);
        if (error instanceof UserNotFound) res.sendClientError(error.message);
        res.sendServerError(error.message);
    };
};

const deleteUsersAdmin = async (req, res) => {
    const id = req.params.uid;
    try {
        const result = await userService.deleteUsersAdmin(id);
        if (result) res.sendSuccess(result);
    } catch (error) {
        logger.error(error.message);
        if (error instanceof UserNotFound) res.sendClientError(error.message);
        res.sendServerError(error.message);
    };
};

const logoutUser = async (req, res) => {
    const user = req.user;
    try {
        const result = await userService.logoutUser(user);
        if (result) res.sendSuccess(result);
    } catch (error) {
        logger.error(error.message);
        if (error instanceof UserNotFound) res.sendClientError(error.message);
        res.sendServerError(error.message);
    };
};

export {
    registerUser,
    loginUser,
    current,
    recoverPassword,
    newPassword,
    changeRole,
    docUpload,
    getAll,
    deleteUsers,
    changeRoleAdmin,
    deleteUsersAdmin,
    logoutUser
};