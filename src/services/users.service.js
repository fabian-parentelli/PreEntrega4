import UserRepository from "../repsitories/users.repository.js";
import CartRepository from '../repsitories/carts.repository.js';
import { isValidPassword, generateToken, createHash, tokenPassword } from '../utils/utils.js';
import { sendEmail } from './mail.service.js';
import { recoverPassword_HTML } from '../utils/html/recoverPassword.js';
import { deleteUsersHtml } from "../utils/html/deleteUsers.js";
import { UserNotFound } from "../utils/custom-exceptions.js";
import { __mainDirname } from '../utils/path.js';
import moment from "moment";

const userManager = new UserRepository();
const cartManager = new CartRepository();

const saveUser = async (user) => {
    const { first_name, last_name, age, email, password } = user;

    if (!first_name || !last_name || !email || !password || !age) {
        throw new UserNotFound('Incomplete Value');
    };

    const exists = await userManager.getByEmail(email);
    if (exists) throw new UserNotFound('User already exists');

    const hashedPassword = createHash(password);
    const newUser = { ...user };

    const addCart = await cartManager.save();
    newUser.cart = addCart._id;

    newUser.password = hashedPassword;

    const result = await userManager.save(newUser);
    if (!result) throw new UserNotFound('User not save');

    return { status: 'success', payload: result };
};

const loginUser = async (email, password) => {
    const user = await userManager.getByEmail(email);
    if (!user) throw new UserNotFound('Incorrect credentials');

    const date = new Date().toLocaleString();
    await userManager.lastConnection(user._id, date);

    const comparePassword = isValidPassword(user, password);
    if (!comparePassword) throw new UserNotFound('Incorrect credentials');

    delete user.password;
    const accesToken = generateToken(user);
    return { accesToken };
};

const recoverPassword = async (email) => {
    const user = await userManager.getByEmail(email);
    if (!user) throw new UserNotFound('User not found'); 

    user.recoverPassword = `http://localhost:8080/password/${user._id}`;
    const passwordToken = tokenPassword(user);

    const emailTo = {
        to: user.email,
        subject: 'Recuperar contraseña',
        html: await recoverPassword_HTML(user.recoverPassword)
    };
    await sendEmail(emailTo);
    return passwordToken;
};

const getById = async (id) => {
    const user = await userManager.getById(id);
    return user;
};

const newPassword = async (user, newPass) => {

    const userBd = await userManager.getByEmail(user.email);
    if (!userBd) throw new UserNotFound('Incorrect credentials')

    const comparePassword = isValidPassword(userBd, newPass);
    if (comparePassword) throw new UserNotFound('Change your password');

    const hashedPassword = createHash(newPass);
    user.password = hashedPassword;

    delete user.recoverPassword;
    const result = await userManager.update(user._id, user.password);
    if (!result) throw new UserNotFound('The password was not saved');
    delete user.password;

    return { status: 'success', payload: user };
};

const changeRole = async (id, user) => {
    const userBD = await userManager.getById(id);
    if (!userBD) throw new UserNotFound('User not found');

    const documents = userBD.documents.map(item => ({ name: item.name.split('-')[1].split('.')[0] }));

    const identification = documents.find(doc => doc.name === 'identificacion');
    const proofAdress = documents.find(doc => doc.name === 'domicilio');
    const accountState = documents.find(doc => doc.name === 'cuenta');

    if (user.role === 'user') {
        if (!identification || !proofAdress || !accountState);
        throw new UserNotFound('You must upload all of the documents to become an premium user');
    };
    const newRole = (userBD.role === "user") ? "premium" : "user";

    const role = await userManager.updateRole(user._id, newRole);
    if (!userBD) throw new UserNotFound('User not found');

    return { status: 'success', payload: role };
};

const changeRoleAdmin = async (id) => {

    const userBD = await userManager.getById(id);
    if (!userBD) throw new UserNotFound('User not found');

    const newRole = (userBD.role === "user") ? "premium" : "user";

    const role = await userManager.updateRole(id, newRole);
    if (!userBD) throw new UserNotFound('User not found');

    return { status: 'success', payload: role };
};


const docUpload = async (id, uploadedFiles, fileType) => {
    const user = await userManager.getById(id)
    if (!user) throw new UserNotFound('User not found');

    for (let i = 0; i < uploadedFiles.length; i++) {
        const obj = {
            name: uploadedFiles[i],
            reference: `${__mainDirname}/uploads/${fileType[i]}/${uploadedFiles[i]}`
        };
        user.documents.push({ ...obj });
    };

    const newDoc = await userManager.docUpload(user._id, user.documents);
    if (!newDoc) throw new UserNotFound('User not update');

    return { status: `${fileType} upload`, newDoc };
};

const lastConnection = async () => {
    await userManager.lastConnection();
};

const getAll = async () => {
    const users = await userManager.getAll();
    if (!users) throw new UserNotFound('User not found');

    const userReduce = users.map(user => ({
        first_name: user.first_name,
        email: user.email,
        role: user.role,
        id: user._id
    }));

    return { status: 'success', payload: userReduce };
};

const deleteUsers = async () => {
    const users = await userManager.getAll();
    if (!users) throw new UserNotFound('User not found');

    const now = moment();
    const inactiveUsers = users.filter(user => {
        const lastConnection = moment(user.last_connection, 'D/M/YYYY, HH:mm:ss');
        const diffMinutes = now.diff(lastConnection, 'days');
        return diffMinutes > 2;
    });

    for (const user of inactiveUsers) {
        const emailTo = {
            to: user.email,
            subject: 'Recuperar contraseña',
            html: await deleteUsersHtml(user.first_name)
        };
        await sendEmail(emailTo);
    };
    console.log(userManager);
    await userManager.deleteUsers(inactiveUsers);
    return { status: 'success', delted: inactiveUsers };
};

const deleteUsersAdmin = async (id) => {
    const users = await userManager.getAll();
    if (!users) throw new UserNotFound('User not found');

    await userManager.deleteUsersAdmin(id);
    return { status: 'Success' };
};

const logoutUser = async ({ user }) => {
    const date = new Date().toLocaleString();
    await userManager.lastConnection(user._id, date);
    return { status: 'success' };
};

export {
    saveUser,
    loginUser,
    recoverPassword,
    getById,
    newPassword,
    changeRole,
    lastConnection,
    docUpload,
    getAll,
    deleteUsers,
    changeRoleAdmin,
    deleteUsersAdmin,
    logoutUser
};