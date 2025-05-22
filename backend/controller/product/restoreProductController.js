const uploadProductPermission = require('../../helpers/permission');
const productModel = require('../../models/productModel');

async function restoreProductController(req, res) {
    try {
        if (!uploadProductPermission(req.userId)) {
            throw new Error("Yêu cầu bị từ chối");
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
        res.status(400).json({
            message: err.message || err,
            error: true,
            success: false
        });
    }
}

module.exports = restoreProductController;