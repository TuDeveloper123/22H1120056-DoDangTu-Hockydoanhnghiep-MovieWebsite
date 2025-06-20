// File Path: backend/helpers/permission.js

const userModel = require("../models/userModel");

const isAdmin = async (userId) => {
    try {
        const user = await userModel.findById(userId);
        return user?.role === 'ADMIN';
    } catch (error) {
        return false;
    }
};

const isStaffOrAdmin = async (userId) => {
    try {
        const user = await userModel.findById(userId);
        return user && (user.role === 'ADMIN' || user.role === 'STAFF');
    } catch (error) {
        return false;
    }
};

module.exports = {
    isAdmin,
    isStaffOrAdmin
};