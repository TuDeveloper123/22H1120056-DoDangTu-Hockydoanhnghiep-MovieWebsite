const uploadProductPermission = require('../../helpers/permission');
const productModel = require('../../models/productModel');

async function getDeletedProductsController(req, res) {
    try {
        // Chỉ Admin mới được xem phim đã xóa
        if (!uploadProductPermission(req.userId)) {
            throw new Error("Yêu cầu bị từ chối");
        }

        const deletedProducts = await productModel.find({ isDeleted: true })
                                              .sort({ updatedAt: -1 }); // Sắp xếp theo ngày xóa (cập nhật) gần nhất

        res.json({
            message: "Danh sách phim đã xóa",
            data: deletedProducts,
            success: true,
            error: false
        });

    } catch (err) {
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

module.exports = getDeletedProductsController;