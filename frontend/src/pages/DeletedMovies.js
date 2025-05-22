//PHIM ĐÃ XOÁ
import React, { useEffect, useState, useCallback } from 'react';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import moment from 'moment'; // Để hiển thị ngày xóa (updatedAt)
import 'moment/locale/vi';
import displayINRCurrency from '../helpers/displayCurrency';
import { FaTrashRestoreAlt } from "react-icons/fa"; // Icon khôi phục
import { MdDeleteForever } from "react-icons/md"; // Icon xóa vĩnh viễn

moment.locale('vi');

const DeletedMovies = () => {
    const [deletedMovies, setDeletedMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null); // State loading cho từng action (restore/delete)

    const fetchDeletedMovies = useCallback(async () => {
        setLoading(true);
        setActionLoading(null); // Reset action loading
        try {
            const response = await fetch(SummaryApi.getDeletedProducts.url, {
                method: SummaryApi.getDeletedProducts.method,
                credentials: 'include'
            });
            const dataResponse = await response.json();
            if (dataResponse.success) {
                setDeletedMovies(dataResponse.data);
            } else {
                toast.error("Không thể tải danh sách phim đã xóa: " + dataResponse.message);
            }
        } catch (error) {
            toast.error("Lỗi kết nối: " + error.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDeletedMovies();
    }, [fetchDeletedMovies]);

    // Hàm khôi phục phim
    const handleRestore = async (movieId, productName) => {
        if (actionLoading) return; // Ngăn chặn click nhiều lần
        setActionLoading(movieId + '_restore'); // Đánh dấu đang xử lý restore cho phim này

        if (window.confirm(`Bạn có chắc muốn khôi phục phim "${productName}" không?`)) {
            try {
                const response = await fetch(`${SummaryApi.restoreProduct.url}/${movieId}`, {
                    method: SummaryApi.restoreProduct.method,
                    credentials: 'include',
                });
                const dataResponse = await response.json();
                if (dataResponse.success) {
                    toast.success(dataResponse.message || "Khôi phục phim thành công.");
                    fetchDeletedMovies(); // Tải lại danh sách
                } else {
                    toast.error(dataResponse.message || "Khôi phục thất bại.");
                    setActionLoading(null); // Reset loading nếu lỗi
                }
            } catch (error) {
                toast.error("Lỗi kết nối khi khôi phục.");
                setActionLoading(null);
            }
            // finally sẽ được chạy trong fetchDeletedMovies
        } else {
             setActionLoading(null); // Reset nếu hủy confirm
        }
    };

    // Hàm xóa vĩnh viễn
    const handlePermanentDelete = async (movieId, productName) => {
         if (actionLoading) return;
         setActionLoading(movieId + '_delete');

        if (window.confirm(`!!! CẢNH BÁO !!!\nBạn có chắc muốn xóa vĩnh viễn phim "${productName}" không?\nHành động này không thể hoàn tác.`)) {
            try {
                const response = await fetch(`${SummaryApi.deleteProductPermanently.url}/${movieId}`, {
                    method: SummaryApi.deleteProductPermanently.method,
                    credentials: 'include',
                });
                const dataResponse = await response.json();
                if (dataResponse.success) {
                    toast.success(dataResponse.message || "Xóa phim vĩnh viễn thành công.");
                    fetchDeletedMovies(); // Tải lại danh sách
                } else {
                    toast.error(dataResponse.message || "Xóa vĩnh viễn thất bại.");
                    setActionLoading(null);
                }
            } catch (error) {
                toast.error("Lỗi kết nối khi xóa vĩnh viễn.");
                setActionLoading(null);
            }
        } else {
            setActionLoading(null);
        }
    };

    return (
        <div className='bg-white p-4 rounded shadow'>
            <h2 className='text-xl font-bold mb-4'>Phim đã xóa (Thùng rác)</h2>

            {loading && <p className='text-center'>Đang tải dữ liệu...</p>}

            {!loading && deletedMovies.length === 0 && (
                <p className='text-center text-gray-500'>Thùng rác trống.</p>
            )}

            {!loading && deletedMovies.length > 0 && (
                <div className="overflow-x-auto">
                    <table className='w-full min-w-[800px] userTable'>
                        <thead>
                            <tr className='bg-black text-white'>
                                <th>STT</th>
                                <th>Tên phim</th>
                                <th>Thể loại</th>
                                <th>Giá vé</th>
                                <th>Ngày xóa</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {deletedMovies.map((movie, index) => (
                                <tr key={movie._id}>
                                    <td>{index + 1}</td>
                                    <td>{movie.productName}</td>
                                    <td>{movie.category}</td>
                                    <td>{displayINRCurrency(movie.sellingPrice)}</td>
                                    <td>{moment(movie.updatedAt).format('L LTS')}</td>
                                    <td className='flex items-center justify-center gap-2'>
                                        <button
                                            onClick={() => handleRestore(movie._id, movie.productName)}
                                            disabled={actionLoading === movie._id + '_restore' || actionLoading === movie._id + '_delete'}
                                            className={`text-blue-500 hover:text-blue-700 disabled:opacity-50 disabled:cursor-wait p-1 rounded ${actionLoading === movie._id + '_restore' ? 'animate-pulse' : ''}`}
                                            title="Khôi phục"
                                        >
                                             {actionLoading === movie._id + '_restore' ? '...' : <FaTrashRestoreAlt size={18}/>}
                                        </button>
                                        <button
                                            onClick={() => handlePermanentDelete(movie._id, movie.productName)}
                                             disabled={actionLoading === movie._id + '_restore' || actionLoading === movie._id + '_delete'}
                                            className={`text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-wait p-1 rounded ${actionLoading === movie._id + '_delete' ? 'animate-pulse' : ''}`}
                                            title="Xóa vĩnh viễn"
                                        >
                                             {actionLoading === movie._id + '_delete' ? '...' : <MdDeleteForever size={20}/>}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default DeletedMovies;