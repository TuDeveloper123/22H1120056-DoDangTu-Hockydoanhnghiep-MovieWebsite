const express = require('express')
    const router = express.Router()

    // Comment Controllers
    const addCommentController = require('../controller/comment/addCommentController');
    const getCommentsByMovieController = require('../controller/comment/getCommentsByMovieController');
    const editCommentController = require('../controller/comment/editCommentController');
    const deleteCommentController = require('../controller/comment/deleteCommentController');

    // User Controllers
    const userSignUpController = require("../controller/user/userSignUp")
    const userSignInController = require('../controller/user/userSignIn')
    const userDetailsController = require('../controller/user/userDetails')
    const userLogout = require('../controller/user/userLogout')
    const allUsers = require('../controller/user/allUsers')
    const updateUser = require('../controller/user/updateUser')
    const checkEmailController = require('../controller/user/checkEmailController')
    const resetPasswordController = require('../controller/user/resetPasswordController')
    const updatePasswordController = require('../controller/user/updatePasswordController');
    const updateProfileController = require('../controller/user/updateProfileController');

    // Product (Movie) Controllers
    const UploadProductController = require('../controller/product/uploadProduct')
    const getProductController = require('../controller/product/getProduct')
    const updateProductController = require('../controller/product/updateProduct')
    const getCategoryProduct = require('../controller/product/getCategoryProductOne') 
    const getCategoryWiseProduct = require('../controller/product/getCategoryWiseProduct')
    const getProductDetails = require('../controller/product/getProductDetails')
    const searchProduct = require('../controller/product/searchProduct')
    const filterProductController = require('../controller/product/filterProduct')

    // *** Delete Controllers ***
    const softDeleteProductController = require('../controller/product/softDeleteProductController');
    const restoreProductController = require('../controller/product/restoreProductController');
    const deleteProductPermanentlyController = require('../controller/product/deleteProductPermanentlyController');
    const getDeletedProductsController = require('../controller/product/getDeletedProductsController');

    // Booking Controllers
    const createBookingController = require('../controller/booking/createBookingController');
    const getBookingHistoryController = require('../controller/booking/getBookingHistoryController'); // Admin
    const getPendingTicketsController = require('../controller/booking/getPendingTicketsController'); // Admin
    const checkInTicketController = require('../controller/booking/checkInTicketController'); // Admin
    const getMyBookingsController = require('../controller/booking/getMyBookingsController');
    const getBookedSeatsController = require('../controller/booking/getBookedSeatsController');

    // Middleware
    const authToken = require('../middleware/authToken')

    // User Routes
    router.post("/signup",userSignUpController)
    router.post("/signin",userSignInController)
    router.get("/user-details",authToken,userDetailsController)
    router.get("/userLogout",userLogout)
    router.post("/check-email", checkEmailController)
    router.post("/reset-password", resetPasswordController)
    router.post("/update-password", authToken, updatePasswordController)
    router.post("/update-profile", authToken, updateProfileController); // Cập nhật ảnh đại diện

    // Admin Panel User Routes
    router.get("/all-user",authToken,allUsers)
    router.post("/update-user",authToken,updateUser) // Dùng để đổi role

    // Product (Movie) Routes
    router.post("/upload-product",authToken,UploadProductController) // Đổi thành upload-movie nếu muốn
    router.get("/get-product",getProductController) // Đổi thành get-movie nếu muốn
    router.post("/update-product",authToken,updateProductController) // Đổi thành update-movie nếu muốn
    router.get("/get-categoryProduct",getCategoryProduct) // Lấy các thể loại phim
    router.post("/category-product",getCategoryWiseProduct) // Lấy phim theo thể loại
    router.post("/product-details",getProductDetails) // Lấy chi tiết phim
    router.get("/search",searchProduct) // Tìm kiếm phim
    router.post("/filter-product",filterProductController) // Lọc phim theo thể loại

    // *** Thêm Route Xóa/Khôi Phục Phim ***
    router.post("/product/soft-delete/:productId", authToken, softDeleteProductController); // Dùng POST hoặc PATCH/PUT
    router.post("/product/restore/:productId", authToken, restoreProductController);
    router.delete("/product/permanent-delete/:productId", authToken, deleteProductPermanentlyController); // Dùng DELETE
    router.get("/deleted-products", authToken, getDeletedProductsController); // Lấy danh sách phim đã xóa

    // Booking Routes
    router.post("/create-booking", authToken, createBookingController); // User đặt vé
    // ---- ADMIN BOOKING ROUTES ----
    router.get("/admin/booking-history", authToken, getBookingHistoryController); // Admin xem lịch sử
    router.get("/admin/pending-tickets", authToken, getPendingTicketsController); // Admin xem vé chờ check-in
    router.post("/admin/checkin-ticket", authToken, checkInTicketController); // Admin check-in vé
    router.get("/my-bookings", authToken, getMyBookingsController);
    router.get("/booked-seats/:movieId/:cinemaName/:showtime", getBookedSeatsController);

    // --- Comment Routes ---
    router.post("/comments", authToken, addCommentController);           // Thêm comment mới (cần đăng nhập)
    router.get("/comments/:movieId", getCommentsByMovieController);     // Lấy comment theo phim (public)
    router.put("/comments/:commentId", authToken, editCommentController); // Sửa comment (chỉ chủ sở hữu)
    router.delete("/comments/:commentId", authToken, deleteCommentController); // Xóa comment (chủ sở hữu hoặc admin)


   

    module.exports = router
