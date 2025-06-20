// File Path: backend/controllers/product/restoreProductController.js

const { isAdmin } = require('../../helpers/permission');
const productModel = require('../../models/productModel');

async function restoreProductController(req, res) {
    try {
        // Chỉ Admin mới có quyền khôi phục
        if (!(await isAdmin(req.userId))) {
            throw new Error("Yêu cầu bị từ chối. Cần quyền Admin.");
        }

        const { productId } = req.params;

        if (!productId) {
            throw new Error("Thiếu Product ID");
        }

        const updatedProduct = await productModel.findByIdAndUpdate(
            productId,
            { isDeleted: false },
            { new: true }
        );

        if (!updatedProduct) {
            throw new Error("Không tìm thấy phim để khôi phục");
        }

        res.json({
            message: "Khôi phục phim thành công",
            data: updatedProduct,
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

module.exports = restoreProductController;