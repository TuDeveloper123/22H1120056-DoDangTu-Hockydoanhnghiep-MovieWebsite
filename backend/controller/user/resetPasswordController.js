const userModel = require("../../models/userModel")
const bcrypt = require('bcryptjs')

async function resetPasswordController(req, res) {
    try {
        const { email, password } = req.body

        if (!email) {
            throw new Error("Email không được để trống")
        }

        if (!password) {
            throw new Error("Mật khẩu không được để trống")
        }

        const user = await userModel.findOne({ email })

        if (!user) {
            throw new Error("Không tìm thấy tài khoản với email này")
        }

        // Hash the new password
        const salt = bcrypt.genSaltSync(10)
        const hashPassword = await bcrypt.hashSync(password, salt)

        if (!hashPassword) {
            throw new Error("Đã có lỗi xảy ra khi mã hóa mật khẩu")
        }

        // Update the user's password
        await userModel.findOneAndUpdate(
            { email },
            { password: hashPassword }
        )

        res.status(200).json({
            message: "Đổi mật khẩu thành công",
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

module.exports = resetPasswordController