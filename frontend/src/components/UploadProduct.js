import React, { useState } from 'react'
import { CgClose } from "react-icons/cg";
// import productCategory from '../helpers/productCategory'; // Đã import ở AdminEditProduct
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from '../helpers/uploadImage';
import DisplayImage from './DisplayImage';
import { MdDelete } from "react-icons/md";
import SummaryApi from '../common';
import {toast} from 'react-toastify'
import productCategory from '../helpers/productCategory'; // Import category phim

// Thêm danh sách trạng thái phim
const movieStatus = [
  { value: 'upcoming', label: 'Sắp chiếu' },
  { value: 'showing', label: 'Đang chiếu' },
  { value: 'early_access', label: 'Chiếu sớm' },
];

const UploadProduct = ({
    onClose,
    fetchData
}) => {
  const [data,setData] = useState({
    productName : "",   // Tên phim
    brandName : "",     // Quốc gia / Đạo diễn
    category : "",      // Thể loại
    productImage : [],  // Poster
    description : "",   // Mô tả
    price : "",         // Giá vé gốc (tùy chọn)
    sellingPrice : "",  // Giá vé chính
    status : "upcoming", // Trạng thái mặc định
    cinemaHall: "Rạp 1" // Rạp mặc định
  })
  const [openFullScreenImage,setOpenFullScreenImage] = useState(false)
  const [fullScreenImage,setFullScreenImage] = useState("")


  const handleOnChange = (e)=>{
      const { name, value} = e.target

      setData((preve)=>{
        return{
          ...preve,
          [name]  : value
        }
      })
  }

  const handleUploadProduct = async(e) => {
    const file = e.target.files[0]
    // Thêm kiểm tra kích thước, loại file nếu cần
    if (file) {
        const uploadImageCloudinary = await uploadImage(file)
        if (uploadImageCloudinary.url) {
            setData((preve)=>{
            return{
                ...preve,
                productImage : [ ...preve.productImage, uploadImageCloudinary.url]
            }
            })
        } else {
            toast.error("Lỗi tải ảnh lên")
        }
    }
  }

  const handleDeleteProductImage = async(index)=>{
    console.log("image index",index)

    const newProductImage = [...data.productImage]
    newProductImage.splice(index,1)

    setData((preve)=>{
      return{
        ...preve,
        productImage : [...newProductImage]
      }
    })

  }

  const handleSubmit = async(e) =>{
    e.preventDefault()

    // Validate required fields
    if (!data.productName || !data.brandName || !data.category || data.productImage.length === 0 || !data.sellingPrice || !data.status || !data.cinemaHall) {
        toast.error("Vui lòng điền đầy đủ thông tin bắt buộc.");
        return;
    }


    const response = await fetch(SummaryApi.uploadProduct.url,{
      method : SummaryApi.uploadProduct.method,
      credentials : 'include',
      headers : {
        "content-type" : "application/json"
      },
      body : JSON.stringify(data)
    })

    const responseData = await response.json()

    if(responseData.success){
        toast.success(responseData?.message)
        onClose()
        fetchData()
    }


    if(responseData.error){
      toast.error(responseData?.message)
    }


  }

  return (
    <div className='fixed w-full  h-full bg-slate-200 bg-opacity-35 top-0 left-0 right-0 bottom-0 flex justify-center items-center z-20'> {/* Thêm z-index */}
       <div className='bg-white p-4 rounded w-full max-w-2xl h-full max-h-[90%] overflow-hidden'> {/* Tăng max-h */}

            <div className='flex justify-between items-center pb-3'>
                <h2 className='font-bold text-lg'>Thêm phim mới</h2> {/* Đổi title */}
                <div className='w-fit ml-auto text-2xl hover:text-red-600 cursor-pointer' onClick={onClose}>
                    <CgClose/>
                </div>
            </div>

          {/* Tăng chiều cao cho form và cho phép scroll */}
          <form className='grid p-4 gap-3 overflow-y-scroll h-[calc(100%-50px)] pb-5' onSubmit={handleSubmit}>
            <label htmlFor='productName'>Tên phim :</label>
            <input
              type='text'
              id='productName'
              placeholder='Nhập tên phim...'
              name='productName'
              value={data.productName}
              onChange={handleOnChange}
              className='p-2 bg-slate-100 border rounded'
              required
            />


            <label htmlFor='brandName' className='mt-1'>Quốc gia / Đạo diễn :</label> {/* Đổi label */}
            <input
              type='text'
              id='brandName'
              placeholder='Nhập quốc gia hoặc đạo diễn...'
              value={data.brandName}
              name='brandName'
              onChange={handleOnChange}
              className='p-2 bg-slate-100 border rounded'
              required
            />

              <label htmlFor='category' className='mt-1'>Thể loại :</label> {/* Đổi label */}
              <select required value={data.category} name='category' onChange={handleOnChange} className='p-2 bg-slate-100 border rounded'>
                  <option value={""}>Chọn thể loại</option>
                  {
                    productCategory.map((el,index)=>{
                      // Bỏ qua option "Tất cả" khi thêm/sửa phim
                      if (el.value !== "all") {
                          return(
                            <option value={el.value} key={el.value+index}>{el.label}</option>
                          )
                      }
                      return null;
                    })
                  }
              </select>

              {/* Thêm trường chọn Trạng thái */}
              <label htmlFor='status' className='mt-1'>Trạng thái :</label>
              <select required value={data.status} name='status' onChange={handleOnChange} className='p-2 bg-slate-100 border rounded'>
                  {
                      movieStatus.map((el, index) => {
                          return (
                              <option value={el.value} key={el.value + index}>{el.label}</option>
                          )
                      })
                  }
              </select>

              {/* Thêm trường nhập Rạp */}
               <label htmlFor='cinemaHall' className='mt-1'>Rạp chiếu :</label>
               <input
                   type='text'
                   id='cinemaHall'
                   placeholder='Nhập tên hoặc số rạp...'
                   value={data.cinemaHall}
                   name='cinemaHall'
                   onChange={handleOnChange}
                   className='p-2 bg-slate-100 border rounded'
                   required
               />

              <label htmlFor='productImage' className='mt-1'>Poster phim :</label> {/* Đổi label */}
              <label htmlFor='uploadImageInput'>
              <div className='p-2 bg-slate-100 border rounded h-32 w-full flex justify-center items-center cursor-pointer'>
                        <div className='text-slate-500 flex justify-center items-center flex-col gap-2'>
                          <span className='text-4xl'><FaCloudUploadAlt/></span>
                          <p className='text-sm'>Tải poster phim</p> {/* Đổi text */}
                          <input type='file' id='uploadImageInput' className='hidden' onChange={handleUploadProduct} accept="image/*"/> {/* Thêm accept */}
                        </div>
              </div>
              </label>
              <div>
                  {
                    data?.productImage[0] ? (
                        <div className='flex items-center gap-2 flex-wrap'> {/* Thêm flex-wrap */}
                            {
                              data.productImage.map((el,index)=>{
                                return(
                                  <div className='relative group' key={el + index}>
                                      <img
                                        src={el}
                                        alt={'poster '+index}
                                        width={80}
                                        height={80}
                                        className='bg-slate-100 border cursor-pointer object-cover' // Thêm object-cover
                                        onClick={()=>{
                                          setOpenFullScreenImage(true)
                                          setFullScreenImage(el)
                                        }}/>

                                        <div className='absolute bottom-0 right-0 p-1 text-white bg-red-600 rounded-full hidden group-hover:block cursor-pointer' onClick={()=>handleDeleteProductImage(index)}>
                                          <MdDelete/>
                                        </div>
                                  </div>

                                )
                              })
                            }
                        </div>
                    ) : (
                      <p className='text-red-600 text-xs'>*Vui lòng chọn poster phim</p> // Đổi text
                    )
                  }

              </div>

              <label htmlFor='sellingPrice' className='mt-1'>Giá vé (VNĐ) :</label> {/* Đổi label */}
              <input
                type='number'
                id='sellingPrice'
                placeholder='Nhập giá vé...'
                value={data.sellingPrice}
                name='sellingPrice'
                min="0" // Giá không âm
                onChange={handleOnChange}
                className='p-2 bg-slate-100 border rounded'
                required
              />

              {/* Có thể bỏ giá gốc nếu không cần */}
              {/* <label htmlFor='price' className='mt-1'>Giá gốc (nếu có) :</label>
              <input
                type='number'
                id='price'
                placeholder='Nhập giá gốc...'
                value={data.price}
                name='price'
                onChange={handleOnChange}
                className='p-2 bg-slate-100 border rounded'
              /> */}


              <label htmlFor='description' className='mt-1'>Mô tả phim :</label> {/* Đổi label */}
              <textarea
                className='h-28 bg-slate-100 border resize-none p-1'
                placeholder='Nhập mô tả phim...'
                rows={3}
                onChange={handleOnChange}
                name='description'
                value={data.description}
              >
              </textarea>

              <button className='px-3 py-2 bg-red-600 text-white mb-10 hover:bg-red-700 mt-4'>Thêm phim</button> {/* Đổi text button */}
          </form>




       </div>



       {/***display image full screen */}
       {
        openFullScreenImage && (
          <DisplayImage onClose={()=>setOpenFullScreenImage(false)} imgUrl={fullScreenImage}/>
        )
       }


    </div>
  )
}

export default UploadProduct