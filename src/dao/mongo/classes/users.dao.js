import { userModel } from '../models/users.model.js';

export default class User {

    constructor() { };

    getAll = async () => {
        return await userModel.find().lean();
    };

    getByEmail = async (email) => {
        return await userModel.findOne({ email }).lean();
    };

    save = async (user) => {
        return await userModel.create(user);
    };

    getById = async (id) => {
        return await userModel.findById(id).lean();
    };

    update = async (id, password) => {
        return await userModel.updateOne({ _id: id }, { $set: { password: password } });
    };

    updateRole = async (id, role) => {
        return await userModel.updateOne({ _id: id }, { $set: { role: role } });
    };

    docUpload = async (id, doc) => {
        return await userModel.updateOne({ _id: id }, { $set: { documents: doc } });
    };

    lastConnection = async (id, date) => {
        await userModel.updateOne({ _id: id }, { $set: { last_connection: date } });
    };

    deleteUsers = async (users) => {
        const userIds = users.map(user => user._id);
        return await userModel.deleteMany({ _id: { $in: userIds } });
    };

    deleteUsersAdmin = async (id) => {
        await userModel.findByIdAndRemove({_id : id})
    };
};