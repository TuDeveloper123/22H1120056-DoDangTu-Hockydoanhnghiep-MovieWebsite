const uploadProductPermission = require('../../helpers/permission');
const productModel = require('../../models/productModel');

async function softDeleteProductController(req, res) {
    try {
        if (!uploadProductPermission(req.userId)) {
            throw new Error("Yêu cầu bị từ chối");
        }

        const { productId } = req.params; // Lấy ID từ URL params

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
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

module.exports = softDeleteProductController;