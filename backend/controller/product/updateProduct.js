const uploadProductPermission = require('../../helpers/permission')
    const productModel = require('../../models/productModel')

    async function updateProductController(req,res){
        try{

            if(!uploadProductPermission(req.userId)){
                throw new Error("Yêu cầu bị từ chối")
            }

            const { _id, ...resBody} = req.body // resBody sẽ chứa status và cinemaHall nếu được gửi lên

            const updateProduct = await productModel.findByIdAndUpdate(_id,resBody)

            res.json({
                message : "Chỉnh sửa phim thành công", // Đổi message
                data : updateProduct,
                success : true,
                error : false
            })

        }catch(err){
            res.status(400).json({
                message : err.message || err,
                error : true,
                success : false
            })
        }
    }

    module.exports = updateProductController