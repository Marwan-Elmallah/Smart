const { Restaurant, User } = require("../../database").models;
const MailManger = require("../../helper/MailManger");
const MailTemplets = require("../../helper/MailTemplets");
const TokenManager = require("../../helper/jwt");
const CryptoJS = require("crypto-js");

class AuthRestaurantController {
    static async login(req, res) {
        const { email, password } = req.body
        let { isRestaurant } = req.body
        isRestaurant = JSON.parse(isRestaurant)
        let record
        if (isRestaurant == true) {
            record = await Restaurant.findOne({
                where: { email }
            })
        } else {
            record = await User.findOne({ where: { email } })
        }
        if (!record) {
            return res.status(404).json({
                error: true,
                code: 404,
                message: "Account is not Exist"
            })
        }
        if (!record.status) {
            return res.status(401).json({
                error: true,
                code: 401,
                message: "Account Not Activated"
            })
        }
        const bytes = CryptoJS.AES.decrypt(record.password, process.env.BCRYPT_SEKRET_KET);
        const originalText = bytes.toString(CryptoJS.enc.Utf8);
        if (originalText !== password) {
            return res.status(401).json({
                error: true,
                code: 401,
                message: "Wrong Password"
            })
        }
        // token avail for 1 day
        const token = TokenManager.generateToken({ record }, 1)
        return res.status(200).json({
            error: false,
            code: 200,
            message: `Welcome ${record.name}`,
            id: record.id,
            token
        })
    }

    static async resetPassword(req, res) {
        const { email, isRestaurant } = req.body
        let record
        if (isRestaurant) {
            record = await Restaurant.findOne({ where: { email } })
            if (!record) {
                return res.status(404).json({
                    error: true,
                    code: 404,
                    message: 'Restaurant Not Found'
                })
            }
        } else {
            record = await User.findOne({ where: { email } })
            if (!record) {
                return res.status(404).json({
                    error: true,
                    code: 404,
                    message: 'User Not Found'
                })
            }
        }
        const token = TokenManager.generateToken({ record }, 1)
        MailManger.send(email, 'Reset Password', null, MailTemplets.ResetPassword(record, token, "createPassword"))
        return res.status(200).json({
            error: false,
            code: 200,
            message: 'Email Sent Successfully',
            data: record
        })
    }

    static async updatePassword(req, res) {
        const { isRestaurant, id, password } = req.body
        let record
        if (!isRestaurant) {
            const userExist = await User.findByPk(id)
            if (!userExist) {
                return res.status(404).json({
                    error: true,
                    code: 404,
                    message: 'User Not Found'
                })
            }
            record = await userExist.update({ password })
        } else {
            const restaurantExist = await Restaurant.findByPk(id)
            if (!restaurantExist) {
                return res.status(404).json({
                    error: true,
                    code: 404,
                    message: 'Restaurant Not Found'
                })
            }
            record = await restaurantExist.update({ password })
        }
        await record.save()
        return res.status(200).json({
            error: false,
            code: 200,
            message: 'Password Updated Successfully',
            data: record
        })
    }
}
module.exports = AuthRestaurantController