import React, { useState } from 'react'
import loginIcons from '../assets/signin.gif'
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import SummaryApi from '../common';

const ForgotPassword = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [step, setStep] = useState(1) // Step 1: Email, Step 2: OTP, Step 3: New Password
  const [data, setData] = useState({
    email: "",
    otp: "",
    password: "",
    confirmPassword: ""
  })
  const [serverOtp, setServerOtp] = useState("") // Store the OTP received from server
  const navigate = useNavigate()

  const handleOnChange = (e) => {
    const { name, value } = e.target

    setData((prev) => {
      return {
        ...prev,
        [name]: value
      }
    })
  }

  // Step 1: Submit email and request OTP
  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const dataResponse = await fetch(SummaryApi.checkEmail.url, {
        method: SummaryApi.checkEmail.method,
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({ email: data.email })
      })

      const dataApi = await dataResponse.json()

      if (dataApi.success) {
        toast.success("Mã OTP đã được gửi!")
        // In a real system, the OTP would be sent via email
        // For demo purposes, we're showing it in a toast notification
        toast.info(`Mã OTP của bạn là: ${dataApi.otp}`)
        setServerOtp(dataApi.otp)
        setStep(2) // Move to OTP verification step
      } else {
        toast.error(dataApi.message)
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi kiểm tra email")
    }
  }

  // Step 2: Verify OTP
  const handleOtpSubmit = (e) => {
    e.preventDefault()
    
    if (data.otp === serverOtp) {
      toast.success("Xác thực OTP thành công!")
      setStep(3) // Move to password reset step
    } else {
      toast.error("Mã OTP không chính xác!")
    }
  }

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault()

    if (data.password !== data.confirmPassword) {
      toast.error("Mật khẩu và xác nhận mật khẩu không khớp!")
      return
    }

    try {
      const dataResponse = await fetch(SummaryApi.resetPassword.url, {
        method: SummaryApi.resetPassword.method,
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({ 
          email: data.email,
          password: data.password
        })
      })

      const dataApi = await dataResponse.json()

      if (dataApi.success) {
        toast.success("Đổi mật khẩu thành công!")
        navigate('/login')
      } else {
        toast.error(dataApi.message)
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi đổi mật khẩu")
    }
  }

  return (
    <section id='forgot-password'>
      <div className='mx-auto container p-4'>
        <div className='bg-white p-5 w-full max-w-sm mx-auto'>
          <div className='w-20 h-20 mx-auto'>
            <img src={loginIcons} alt='login icons' />
          </div>

          <h2 className='text-center font-bold text-xl mb-6'>Quên mật khẩu</h2>

          {step === 1 && (
            <form className='pt-2 flex flex-col gap-4' onSubmit={handleEmailSubmit}>
              <div className='grid'>
                <label>Email : </label>
                <div className='bg-slate-100 p-2'>
                  <input
                    type='email'
                    placeholder='Nhập email của bạn...'
                    name='email'
                    value={data.email}
                    onChange={handleOnChange}
                    required
                    className='w-full h-full outline-none bg-transparent' />
                </div>
              </div>

              <button className='bg-red-600 hover:bg-red-700 text-white px-6 py-2 w-full max-w-[150px] rounded-full hover:scale-110 transition-all mx-auto block mt-4'>
                Tiếp theo
              </button>
            </form>
          )}

          {step === 2 && (
            <form className='pt-2 flex flex-col gap-4' onSubmit={handleOtpSubmit}>
              <div className='grid'>
                <label>Mã OTP : </label>
                <div className='bg-slate-100 p-2'>
                  <input
                    type='text'
                    placeholder='Nhập mã OTP (4 số)...'
                    name='otp'
                    value={data.otp}
                    onChange={handleOnChange}
                    required
                    className='w-full h-full outline-none bg-transparent' />
                </div>
                <p className='text-sm text-gray-500 mt-1'>Vui lòng nhập mã OTP đã được hiển thị.</p>
              </div>

              <button className='bg-red-600 hover:bg-red-700 text-white px-6 py-2 w-full max-w-[150px] rounded-full hover:scale-110 transition-all mx-auto block mt-4'>
                Xác nhận
              </button>
            </form>
          )}

          {step === 3 && (
            <form className='pt-2 flex flex-col gap-4' onSubmit={handleResetPassword}>
              <div>
                <label>Mật khẩu mới : </label>
                <div className='bg-slate-100 p-2 flex'>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder='Nhập mật khẩu mới...'
                    value={data.password}
                    name='password'
                    onChange={handleOnChange}
                    required
                    className='w-full h-full outline-none bg-transparent' />
                  <div className='cursor-pointer text-xl' onClick={() => setShowPassword((prev) => !prev)}>
                    <span>
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label>Xác nhận mật khẩu : </label>
                <div className='bg-slate-100 p-2 flex'>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder='Xác nhận mật khẩu mới...'
                    value={data.confirmPassword}
                    name='confirmPassword'
                    onChange={handleOnChange}
                    required
                    className='w-full h-full outline-none bg-transparent' />
                  <div className='cursor-pointer text-xl' onClick={() => setShowConfirmPassword((prev) => !prev)}>
                    <span>
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                </div>
              </div>

              <button className='bg-red-600 hover:bg-red-700 text-white px-6 py-2 w-full max-w-[150px] rounded-full hover:scale-110 transition-all mx-auto block mt-4'>
                Đổi mật khẩu
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

export default ForgotPassword