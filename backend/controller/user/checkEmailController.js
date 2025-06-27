const userModel = require("../../models/userModel");
const sendEmail = require('../../helpers/sendEmail'); 

async function checkEmailController(req, res) {
    try {
        const { email } = req.body;

        if (!email) {
            throw new Error("Vui lòng nhập email");
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(200).json({
                message: "Không tìm thấy tài khoản với email này",
                error: true,
                success: false
            });
        }

        // Tạo mã OTP ngẫu nhiên gồm 4 chữ số
        const otp = Math.floor(1000 + Math.random() * 9000).toString();

        // ---- TÍCH HỢP GỬI EMAIL ----
        const subject = "[Cinemas] Mã OTP khôi phục mật khẩu của bạn";
        const html = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2>Khôi phục mật khẩu Cinemas</h2>
                <p>Xin chào ${user.name},</p>
                <p>Bạn đã yêu cầu khôi phục mật khẩu. Vui lòng sử dụng mã OTP dưới đây để tiếp tục. Mã OTP này sẽ có hiệu lực trong 5 phút.</p>
                <p style="font-size: 24px; font-weight: bold; letter-spacing: 2px; color: #d9534f; background-color: #f9f9f9; padding: 10px; border-radius: 5px; display: inline-block;">
                    ${otp}
                </p>
                <p>Nếu bạn không yêu cầu điều này, vui lòng bỏ qua email này.</p>
                <p>Trân trọng,<br/>Đội ngũ Cinemas</p>
            </div>
        `;
        
        const emailSent = await sendEmail({ to: email, subject, html });

        if (!emailSent) {
            throw new Error("Không thể gửi email OTP. Vui lòng thử lại.");
        }
        // ---- KẾT THÚC TÍCH HỢP ----


        // Vẫn gửi OTP về client để frontend xác thực
        res.status(200).json({
            message: "Mã OTP đã được gửi đến email của bạn!",
            otp: otp,
            success: true,
            error: false
        });

    } catch (err) {
        res.status(500).json({ // Dùng mã 500 cho lỗi server
            message: err.message || err,
            error: true,
            success: false,
        });
    }
}

module.exports = checkEmailController;