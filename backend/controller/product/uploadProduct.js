// File Path: backend/controllers/product/uploadProduct.js

const { isAdmin } = require("../../helpers/permission");
const productModel = require("../../models/productModel");

async function UploadProductController(req, res) {
    try {
        const sessionUserId = req.userId;

        // Chỉ Admin mới có quyền thêm phim
        if (!(await isAdmin(sessionUserId))) {
            throw new Error("Yêu cầu bị từ chối. Cần quyền Admin.");
        }

        const uploadProduct = new productModel(req.body);
        const saveProduct = await uploadProduct.save();

        res.status(201).json({
            message: "Thêm phim thành công",
            error: false,
            success: true,
            data: saveProduct
        });

    } catch (err) {
        const statusCode = err.message.includes("Yêu cầu bị từ chối") ? 403 : 400;
        res.status(statusCode).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

module.exports = UploadProductController;