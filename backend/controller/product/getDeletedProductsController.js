// File Path: backend/controllers/product/getDeletedProductsController.js

const { isAdmin } = require('../../helpers/permission');
const productModel = require('../../models/productModel');

async function getDeletedProductsController(req, res) {
    try {
        // Chỉ Admin mới được xem phim đã xóa
        if (!(await isAdmin(req.userId))) {
            throw new Error("Yêu cầu bị từ chối. Cần quyền Admin.");
        }

        const deletedProducts = await productModel.find({ isDeleted: true })
                                              .sort({ updatedAt: -1 }); // Sắp xếp theo ngày xóa gần nhất

        res.json({
            message: "Danh sách phim đã xóa",
            data: deletedProducts,
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

module.exports = getDeletedProductsController;