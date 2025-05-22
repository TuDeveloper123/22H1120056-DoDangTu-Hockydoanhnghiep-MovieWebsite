const productModel = require("../../models/productModel")

    const searchProduct = async(req,res)=>{
        try{
            const query = req.query.q

            const regex = new RegExp(query,'i','g') // 'i' for case-insensitive, 'g' for global (though maybe not needed for find)

            const product = await productModel.find({
                isDeleted: { $ne: true },
                "$or" : [
                    {
                        productName : regex // Tìm theo tên phim
                    },
                    {
                        category : regex    // Tìm theo thể loại
                    }
                ]
                // Optional: Thêm điều kiện trạng thái nếu muốn chỉ tìm phim đang chiếu/chiếu sớm
                // status: { "$in": ["showing", "early_access"] }
            })


            res.json({
                data  : product ,
                message : "Kết quả tìm kiếm phim", // Đổi message
                error : false,
                success : true
            })
        }catch(err){
            res.json({
                message : err.message || err,
                error : true,
                success : false
            })
        }
    }

    module.exports = searchProduct