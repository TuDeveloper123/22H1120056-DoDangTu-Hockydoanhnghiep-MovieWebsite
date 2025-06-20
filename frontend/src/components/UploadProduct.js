import React, { useState } from 'react';
import { CgClose } from "react-icons/cg";
import { FaCloudUploadAlt, FaPlus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { toast } from 'react-toastify';
import productCategory from '../helpers/productCategory';
import uploadImage from '../helpers/uploadImage';
import DisplayImage from './DisplayImage';
import SummaryApi from '../common';

// Danh sách trạng thái phim
const movieStatus = [
  { value: 'upcoming', label: 'Sắp chiếu' },
  { value: 'showing', label: 'Đang chiếu' },
  { value: 'early_access', label: 'Chiếu sớm' },
];

const UploadProduct = ({ onClose, fetchData }) => {
    const [data, setData] = useState({
        productName: "",
        brandName: "",
        category: "",
        productImage: [],
        description: "",
        sellingPrice: "",
        status: "upcoming",
        // Cấu trúc mới cho rạp và suất chiếu
        showings: [{ cinemaName: "", showtimes: [""] }]
    });

    const [openFullScreenImage, setOpenFullScreenImage] = useState(false);
    const [fullScreenImage, setFullScreenImage] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    // Xử lý thay đổi các trường input cơ bản
    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
    };

    // ===== LOGIC MỚI CHO RẠP & SUẤT CHIẾU =====
    const handleCinemaChange = (index, event) => {
        const newShowings = [...data.showings];
        newShowings[index][event.target.name] = event.target.value;
        setData(prev => ({ ...prev, showings: newShowings }));
    };

    const handleShowtimeChange = (cinemaIndex, timeIndex, event) => {
        const newShowings = [...data.showings];
        newShowings[cinemaIndex].showtimes[timeIndex] = event.target.value;
        setData(prev => ({ ...prev, showings: newShowings }));
    };

    const addCinema = () => {
        setData(prev => ({
            ...prev,
            showings: [...prev.showings, { cinemaName: "", showtimes: [""] }]
        }));
    };

    const removeCinema = (index) => {
        const newShowings = [...data.showings];
        newShowings.splice(index, 1);
        setData(prev => ({ ...prev, showings: newShowings }));
    };

    const addShowtime = (cinemaIndex) => {
        const newShowings = [...data.showings];
        newShowings[cinemaIndex].showtimes.push("");
        setData(prev => ({ ...prev, showings: newShowings }));
    };

    const removeShowtime = (cinemaIndex, timeIndex) => {
        const newShowings = [...data.showings];
        newShowings[cinemaIndex].showtimes.splice(timeIndex, 1);
        setData(prev => ({ ...prev, showings: newShowings }));
    };
    // ===========================================

    // Xử lý upload ảnh
    const handleUploadProduct = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setIsUploading(true);
            const uploadImageCloudinary = await uploadImage(file);
            setIsUploading(false);
            if (uploadImageCloudinary.url) {
                setData(prev => ({
                    ...prev,
                    productImage: [...prev.productImage, uploadImageCloudinary.url]
                }));
                toast.success("Tải ảnh lên thành công!");
            }
        }
    };

    // Xử lý xóa ảnh
    const handleDeleteProductImage = (index) => {
        const newProductImage = [...data.productImage];
        newProductImage.splice(index, 1);
        setData(prev => ({ ...prev, productImage: newProductImage }));
        toast.info("Đã xóa ảnh.");
    };

    // Xử lý submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(SummaryApi.uploadProduct.url, {
            method: SummaryApi.uploadProduct.method,
            credentials: 'include',
            headers: { "content-type": "application/json" },
            body: JSON.stringify(data)
        });
        const responseData = await response.json();
        if (responseData.success) {
            toast.success(responseData.message);
            onClose();
            fetchData();
        }
        if (responseData.error) {
            toast.error(responseData.message);
        }
    };

    return (
        <div className='fixed w-full h-full bg-slate-200 bg-opacity-50 top-0 left-0 right-0 bottom-0 flex justify-center items-center z-50'>
            <div className='bg-white p-4 rounded-lg shadow-xl w-full max-w-3xl h-full max-h-[95%] overflow-hidden flex flex-col'>
                <div className='flex justify-between items-center pb-3 border-b mb-2'>
                    <h2 className='font-bold text-xl'>Thêm phim mới</h2>
                    <button className='text-2xl hover:text-red-600 cursor-pointer p-1 rounded-full hover:bg-gray-100' onClick={onClose}><CgClose /></button>
                </div>
                <form className='flex-grow p-4 space-y-4 overflow-y-auto' onSubmit={handleSubmit}>
                    {/* Các trường thông tin cơ bản */}
                    <div><label htmlFor='productName' className='block mb-1 font-medium'>Tên phim:</label><input type='text' id='productName' name='productName' value={data.productName} onChange={handleOnChange} className='p-2 bg-slate-100 border rounded w-full' required /></div>
                    <div><label htmlFor='brandName' className='block mb-1 font-medium'>Quốc gia / Đạo diễn:</label><input type='text' id='brandName' name='brandName' value={data.brandName} onChange={handleOnChange} className='p-2 bg-slate-100 border rounded w-full' required /></div>
                    <div><label htmlFor='category' className='block mb-1 font-medium'>Thể loại:</label><select required value={data.category} name='category' onChange={handleOnChange} className='p-2 bg-slate-100 border rounded w-full'><option value="">-- Chọn thể loại --</option>{productCategory.map(el => el.value !== "all" && <option value={el.value} key={el.value}>{el.label}</option>)}</select></div>
                    <div><label htmlFor='status' className='block mb-1 font-medium'>Trạng thái:</label><select required value={data.status} name='status' onChange={handleOnChange} className='p-2 bg-slate-100 border rounded w-full'>{movieStatus.map(el => <option value={el.value} key={el.value}>{el.label}</option>)}</select></div>
                    <div><label htmlFor='sellingPrice' className='block mb-1 font-medium'>Giá vé (VNĐ):</label><input type='number' id='sellingPrice' name='sellingPrice' value={data.sellingPrice} onChange={handleOnChange} className='p-2 bg-slate-100 border rounded w-full' required min="0" /></div>

                    {/* ===== Giao diện quản lý Rạp & Suất chiếu ===== */}
                    <div className="border-t pt-4 space-y-3">
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold text-md">Quản lý Rạp & Suất chiếu</h3>
                            <button type="button" onClick={addCinema} className="text-sm font-medium bg-green-500 text-white py-1 px-3 rounded-md hover:bg-green-600 flex items-center gap-1"><FaPlus />Thêm rạp</button>
                        </div>
                        {data.showings.map((showing, cinemaIndex) => (
                            <div key={cinemaIndex} className="bg-gray-50 p-3 rounded-lg border space-y-3">
                                <div className="flex items-center gap-2">
                                    <input type="text" name="cinemaName" value={showing.cinemaName} onChange={(e) => handleCinemaChange(cinemaIndex, e)} className="p-2 bg-white border rounded w-full font-medium" placeholder={`Tên rạp ${cinemaIndex + 1}`} required />
                                    {data.showings.length > 1 && <button type="button" onClick={() => removeCinema(cinemaIndex)} className="text-red-500 p-2 rounded-full hover:bg-red-100"><MdDelete /></button>}
                                </div>
                                <div className="pl-4 border-l-2 border-gray-200 space-y-2">
                                    {showing.showtimes.map((time, timeIndex) => (
                                        <div key={timeIndex} className="flex items-center gap-2">
                                            <input type="time" value={time} onChange={(e) => handleShowtimeChange(cinemaIndex, timeIndex, e)} className="p-1.5 bg-white border rounded w-full" required />
                                            {showing.showtimes.length > 1 && <button type="button" onClick={() => removeShowtime(cinemaIndex, timeIndex)} className="text-red-500 p-1"><MdDelete /></button>}
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => addShowtime(cinemaIndex)} className="text-sm text-blue-600 hover:underline flex items-center gap-1"><FaPlus />Thêm giờ chiếu</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ===== Giao diện Upload ảnh (giữ nguyên) ===== */}
                    <div>
                        <label className='block mb-1 font-medium'>Poster phim ({data.productImage.length}):</label>
                        <label htmlFor='uploadImageInput'><div className='p-3 bg-slate-100 border rounded h-32 w-full flex justify-center items-center cursor-pointer hover:bg-slate-200'><div className='text-slate-500 flex flex-col gap-2 items-center'><span className='text-4xl'><FaCloudUploadAlt /></span><p className='text-sm'>{isUploading ? "Đang tải..." : "Tải poster mới"}</p><input type='file' id='uploadImageInput' className='hidden' onChange={handleUploadProduct} accept="image/*" disabled={isUploading} /></div></div></label>
                        {data.productImage.length === 0 && <p className='text-red-600 text-xs mt-1'>*Vui lòng chọn ít nhất một poster.</p>}
                    </div>
                    {data.productImage.length > 0 && <div className='flex items-center gap-2 flex-wrap border p-2 rounded bg-gray-50'><div className='flex items-center gap-2 flex-wrap'>{data.productImage.map((el, index) => (<div className='relative group' key={el + index}><img src={el} alt={`p ${index}`} width={80} height={80} className='bg-slate-100 border cursor-pointer object-cover h-20 w-20 rounded' onClick={() => {setOpenFullScreenImage(true); setFullScreenImage(el);}} /><button type="button" className='absolute -top-2 -right-2 p-1 text-white bg-red-600 rounded-full hidden group-hover:flex' onClick={() => handleDeleteProductImage(index)}><MdDelete /></button></div>))}</div></div>}
                    
                    {/* ===== Mô tả phim (giữ nguyên) ===== */}
                    <div><label htmlFor='description' className='block mb-1 font-medium'>Mô tả phim:</label><textarea id="description" className='h-36 bg-slate-100 border rounded resize-none p-2 w-full' placeholder='Nhập mô tả...' onChange={handleOnChange} name='description' value={data.description}></textarea></div>
                    
                    <button className='w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold mt-4'>Thêm phim</button>
                </form>
                {openFullScreenImage && <DisplayImage onClose={() => setOpenFullScreenImage(false)} imgUrl={fullScreenImage} />}
            </div>
        </div>
    );
};

export default UploadProduct;