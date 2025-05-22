const productModel = require("../../models/productModel")

    const filterProductController = async(req,res)=>{
     try{
            const categoryList = req?.body?.category || []

            // Tạo query object
            const query = {}

            // Chỉ thêm điều kiện category nếu categoryList không rỗng và không chứa 'all'
            // Hoặc nếu categoryList rỗng (nghĩa là không chọn category nào), thì lấy tất cả
            if (categoryList.length > 0 && !categoryList.includes("all")) {
                 query.category = { "$in" : categoryList };
            }
             // Nếu categoryList rỗng hoặc chứa 'all', không cần thêm điều kiện category, sẽ lấy tất cả phim

            // Thêm điều kiện trạng thái (ví dụ: chỉ lấy phim đang chiếu và chiếu sớm)
            // query.status = { "$in": ["showing", "early_access"] };

            const product = await productModel.find(query);

            res.json({
                data : product,
                message : "Lọc phim thành công", // Đổi message
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

    module.exports = filterProductController