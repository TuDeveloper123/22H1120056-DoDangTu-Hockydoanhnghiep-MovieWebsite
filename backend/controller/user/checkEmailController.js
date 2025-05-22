const userModel = require("../../models/userModel")

async function checkEmailController(req, res) {
    try {
        const { email } = req.body

        if (!email) {
            throw new Error("Vui lòng nhập email")
        }

        const user = await userModel.findOne({ email })

        if (!user) {
            return res.status(200).json({
                message: "Không tìm thấy tài khoản với email này",
                error: true,
                success: false
            })
        }

        // Generate a random 4-digit OTP
        const otp = Math.floor(1000 + Math.random() * 9000).toString()

        // In a real system, you would send this OTP via email
        // For simplicity, we'll just return it in the response
        // This is not secure for production, just for demonstration purposes

        res.status(200).json({
            message: "Email tồn tại trong hệ thống",
            otp: otp,
            success: true,
            error: false
        })

    } catch (err) {
        res.json({
            message: err.message || err,
            error: true,
            success: false,
        })
    }
}

module.exports = checkEmailController