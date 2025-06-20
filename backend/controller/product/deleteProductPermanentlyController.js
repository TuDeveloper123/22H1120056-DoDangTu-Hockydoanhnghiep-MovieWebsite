// File Path: backend/controllers/product/deleteProductPermanentlyController.js

const { isAdmin } = require('../../helpers/permission');
const productModel = require('../../models/productModel');

async function deleteProductPermanentlyController(req, res) {
    try {
        // Chỉ Admin mới có quyền xóa vĩnh viễn
        if (!(await isAdmin(req.userId))) {
            throw new Error("Yêu cầu bị từ chối. Cần quyền Admin.");
        }

        const { productId } = req.params;

        if (!productId) {
            throw new Error("Thiếu Product ID");
        }

        const deletedProduct = await productModel.findByIdAndDelete(productId);

        if (!deletedProduct) {
             throw new Error("Không tìm thấy phim để xóa vĩnh viễn");
        }

        res.json({
            message: "Xóa phim vĩnh viễn thành công",
            data: deletedProduct,
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

module.exports = deleteProductPermanentlyController;