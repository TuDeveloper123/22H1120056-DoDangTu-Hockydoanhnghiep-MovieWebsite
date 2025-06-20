const mongoose = require('mongoose')

// Cấu trúc mới cho suất chiếu
const showingSchema = mongoose.Schema({
    cinemaName: { type: String, required: true, trim: true },
    showtimes: { type: [String], required: true } // Mảng các giờ chiếu, ví dụ: ["19:00", "21:00"]
});


const productSchema = mongoose.Schema({
    productName : String, // Tên phim
    brandName : String,   // Quốc gia / Đạo diễn
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
    // cinemaHall đã được thay thế bằng cấu trúc showings mới
    showings: [showingSchema], // <-- THAY ĐỔI QUAN TRỌNG: Mảng các rạp và suất chiếu

    isDeleted: {
        type: Boolean,
        default: false,
        index: true
    }
},{
    timestamps : true
})


const productModel = mongoose.model("product",productSchema)

module.exports = productModel