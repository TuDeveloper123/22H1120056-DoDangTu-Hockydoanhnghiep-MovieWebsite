// File Path: backend/controllers/product/updateProduct.js

const { isAdmin } = require('../../helpers/permission');
const productModel = require('../../models/productModel');

async function updateProductController(req, res) {
    try {
        // Chỉ Admin mới có quyền cập nhật phim
        if (!(await isAdmin(req.userId))) {
            throw new Error("Yêu cầu bị từ chối. Cần quyền Admin.");
        }

        const { _id, ...resBody } = req.body;

        const updateProduct = await productModel.findByIdAndUpdate(_id, resBody);

        res.json({
            message: "Chỉnh sửa phim thành công",
            data: updateProduct,
            success: true,
            error: false
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

module.exports = updateProductController;