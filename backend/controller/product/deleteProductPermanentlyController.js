const uploadProductPermission = require('../../helpers/permission');
const productModel = require('../../models/productModel');

async function deleteProductPermanentlyController(req, res) {
    try {
        if (!uploadProductPermission(req.userId)) {
            throw new Error("Yêu cầu bị từ chối");
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
            data: deletedProduct, // Có thể trả về phim đã xóa nếu cần
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

module.exports = deleteProductPermanentlyController;