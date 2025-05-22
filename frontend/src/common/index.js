const backendDomin = "http://localhost:8080" // Đảm bảo đúng port backend

    const SummaryApi = {
        signUP : {
            url : `${backendDomin}/api/signup`,
            method : "post"
        },
        signIn : {
            url : `${backendDomin}/api/signin`,
            method : "post"
        },
        current_user : {
            url : `${backendDomin}/api/user-details`,
            method : "get"
        },
        logout_user : {
            url : `${backendDomin}/api/userLogout`,
            method : 'get'
        },
        allUser : {
            url : `${backendDomin}/api/all-user`,
            method : 'get'
        },
        updateUser : { // Dùng để đổi role
            url : `${backendDomin}/api/update-user`,
            method : "post"
        },
        // --- Product (Movie) APIs ---
        uploadProduct : { // Đổi tên thành uploadMovie nếu muốn
            url : `${backendDomin}/api/upload-product`,
            method : 'post'
        },
        allProduct : { // Đổi tên thành allMovies nếu muốn
            url : `${backendDomin}/api/get-product`,
            method : 'get'
        },
        updateProduct : { // Đổi tên thành updateMovie nếu muốn
            url : `${backendDomin}/api/update-product`,
            method  : 'post'
        },
        categoryProduct : { // Lấy các thể loại
            url : `${backendDomin}/api/get-categoryProduct`,
            method : 'get'
        },
        categoryWiseProduct : { // Lấy phim theo thể loại
            url : `${backendDomin}/api/category-product`,
            method : 'post'
        },
        productDetails : { // Lấy chi tiết phim
            url : `${backendDomin}/api/product-details`,
            method : 'post'
        },
        searchProduct : { // Tìm phim
            url : `${backendDomin}/api/search`,
            method : 'get'
        },
        filterProduct : { // Lọc phim theo thể loại
            url : `${backendDomin}/api/filter-product`,
            method : 'post'
        },
        // --- Booking APIs ---
        createBooking : {
            url : `${backendDomin}/api/create-booking`,
            method : 'post'
        },
        // --- Admin Booking APIs ---
        getBookingHistory : {
            url : `${backendDomin}/api/admin/booking-history`,
            method : 'get'
        },
        myBookings: {
            url: `${backendDomin}/api/my-bookings`,
            method: 'get'
        },
        getBookedSeats: {
            // Method GET nên không cần method: 'get'
            // URL sẽ được tạo động trong component
            url: `${backendDomin}/api/booked-seats`
        },
        getPendingTickets : {
             url : `${backendDomin}/api/admin/pending-tickets`,
             method : 'get'
        },
        checkInTicket : {
            url : `${backendDomin}/api/admin/checkin-ticket`,
            method : 'post'
        },

        
         // --- Forgot Password APIs ---
        checkEmail : {
            url : `${backendDomin}/api/check-email`,
            method : "post"
        },
        resetPassword : {
            url : `${backendDomin}/api/reset-password`,
            method : "post"
        },


        // *** API Xóa/Khôi Phục Phim ***
        softDeleteProduct: {
            // URL động, sẽ cần nối thêm productId
            url: `${backendDomin}/api/product/soft-delete`,
            method: 'post'
        },
        restoreProduct: {
            // URL động
            url: `${backendDomin}/api/product/restore`,
            method: 'post'
        },
        deleteProductPermanently: {
            // URL động
            url: `${backendDomin}/api/product/permanent-delete`,
            method: 'delete'
        },
        getDeletedProducts: {
            url: `${backendDomin}/api/deleted-products`,
            method: 'get'
        },

        
        //--- Comment APIs ---
        addComment: {
            url: `${backendDomin}/api/comments`,
            method: 'post'
        },
        getComments: {
            // URL động, cần nối movieId
            url: `${backendDomin}/api/comments`,
            method: 'get'
        },
        editComment: {
            // URL động, cần nối commentId
            url: `${backendDomin}/api/comments`,
            method: 'put'
        },
        deleteComment: {
            // URL động, cần nối commentId
            url: `${backendDomin}/api/comments`,
            method: 'delete'
        }

       
    }

    export default SummaryApi