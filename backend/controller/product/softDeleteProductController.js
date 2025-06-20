// File Path: backend/controllers/product/softDeleteProductController.js

const { isAdmin } = require('../../helpers/permission');
const productModel = require('../../models/productModel');

async function softDeleteProductController(req, res) {
    try {
        // Chỉ Admin mới có quyền xóa mềm
        if (!(await isAdmin(req.userId))) {
            throw new Error("Yêu cầu bị từ chối. Cần quyền Admin.");
        }

        const { productId } = req.params;

        if (!productId) {
            throw new Error("Thiếu Product ID");
        }

        const updatedProduct = await productModel.findByIdAndUpdate(
            productId,
            { isDeleted: true },
            { new: true } // Trả về document đã cập nhật
        );

        if (!updatedProduct) {
            throw new Error("Không tìm thấy phim để xóa");
        }

        res.json({
            message: "Đã chuyển phim vào thùng rác",
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

module.exports = softDeleteProductController;