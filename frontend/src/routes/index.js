import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Home from '../pages/Home';
import Login from '../pages/Login';
import ForgotPassword from '../pages/ForgotPassword';
import SignUp from '../pages/SignUp';
import AdminPanel from '../pages/AdminPanel';
import AllUsers from '../pages/AllUsers';
import AllProducts from '../pages/AllProducts'; // Trang quản lý phim
import CategoryProduct from '../pages/CategoryProduct'; // Trang lọc phim theo thể loại
import ProductDetails from '../pages/ProductDetails'; // Trang chi tiết phim
import SearchProduct from '../pages/SearchProduct'; // Trang tìm kiếm phim
import BookingPage from '../pages/BookingPage'; // Trang đặt vé mới
import BookingHistory from '../pages/BookingHistory'; // Trang lịch sử đặt vé (Admin)
import TicketStatusManagement from '../pages/TicketStatusManagement'; // Trang quản lý check-in (Admin)
import MyBookings from '../pages/MyBookings'; // Trang lịch sử đặt vé của User
import DeletedMovies from '../pages/DeletedMovies';
import MyAccount from '../pages/MyAccount';

const router = createBrowserRouter([
    {
        path : "/",
        element : <App/>,
        children : [
            { path : "", element : <Home/> },
            { path : "login", element : <Login/> },
            { path : "forgot-password", element : <ForgotPassword/> },
            { path : "sign-up", element : <SignUp/> },
            { path : "product-category", element : <CategoryProduct/> },
            { path : "product/:id", element : <ProductDetails/> },
            { path : 'booking/:id', element: <BookingPage /> },
            { path : 'my-bookings', element: <MyBookings /> }, // Thêm route Lịch sử vé của User
            { path : 'my-account', element: <MyAccount /> },
            { path : "search", element : <SearchProduct/> },
            {
                path : "admin-panel",
                element : <AdminPanel/>,
                children : [
                    // Redirect /admin-panel to /admin-panel/all-products by default (optional)
                    // { index: true, element: <Navigate to="all-products" replace /> },
                    { path : "all-users", element : <AllUsers/> },
                    { path : "all-products", element : <AllProducts/> },
                    { path: "booking-history", element: <BookingHistory /> },
                    { path: "ticket-status", element: <TicketStatusManagement /> },
                    { path: "deleted-movies", element: <DeletedMovies /> }
                ]
            },
             // Optional: Add a 404 Not Found route
            // { path: "*", element: <NotFoundPage /> }
        ]
    }
]);

export default router;