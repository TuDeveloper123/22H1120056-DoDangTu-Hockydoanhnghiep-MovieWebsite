const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    productName : String, // Tên phim
    brandName : String,   // Quốc gia / Đạo diễn (Bạn có thể đổi tên trường nếu muốn rõ ràng hơn)
    category : String,    // Thể loại
    productImage : [],    // Poster phim
    description : String, // Mô tả phim
    price : Number,       // Giá vé gốc (có thể không cần nếu giá vé cố định)
    sellingPrice : Number,// Giá vé bán (Giá vé chính)
    status: {             // Trạng thái phim
        type: String,
        enum: ['showing', 'upcoming', 'early_access'], // đang chiếu, sắp chiếu, chiếu sớm
        default: 'upcoming'
    },
    cinemaHall: {         // Số rạp / Tên rạp
        type: String,
        default: "Rạp 1"
    },
    isDeleted: { // <-- Thêm trường này
        type: Boolean,
        default: false,
        index: true // Index để query nhanh hơn
    }
},{
    timestamps : true
})


const productModel = mongoose.model("product",productSchema) // Giữ tên model là "product" cho tiện

module.exports = productModel