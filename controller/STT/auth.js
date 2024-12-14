const { Company, Subscription, Billing } = require("../../database").models;
const { Op } = require("sequelize");
const MailManger = require("../../helper/MailManger");
const MailTemplets = require("../../helper/MailTemplets");
const TokenManager = require("../../helper/jwt");
const CryptoJS = require("crypto-js");
const { ConvertDate } = require("../../helper/Helper");

class AuthController {
    static async register(req, res) {
        const { name, email, password, phone } = req.body
        const emailExist = await Company.findAll({ where: { email } })
        if (emailExist.length > 0) {
            return res.status(400).json({
                error: true,
                code: 400,
                message: 'Email Already Exists'
            })
        }
        const newCompany = await Company.create({
            name,
            email,
            phone,
            password,
        })
        const subscription = await Subscription.create({
            companyId: newCompany.id,
            startDate: new Date(),
            tier: "demo"
        }, { isTrial: true })
        await newCompany.update({ currentSubscriptionId: subscription.id })
        return res.status(200).json({
            error: false,
            code: 200,
            message: 'You Are Registered Successfully, you enjoy for 7 Days or 20 minutes with Demo Subscription',
            data: newCompany,
        })
    }

    static async login(req, res) {
        const { email, password } = req.body
        const record = await Company.findOne({
            where: { email }
        })
        if (!record) {
            return res.status(404).json({
                error: true,
                code: 404,
                message: "Company is not Exist"
            })
        }
        if (record.status == false) {
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
        const { email } = req.body
        const record = await Company.findOne({
            where: { email }
        })
        if (!record) {
            return res.status(404).json({
                error: true,
                code: 404,
                message: "Company is not Exist"
            })
        }
        const token = TokenManager.generateToken({ email }, 1)
        MailManger.send(email, 'Reset Password', null, MailTemplets.ResetPassword(record, token, "speech/createPassword"))
        return res.status(200).json({
            error: false,
            code: 200,
            message: 'Email Sent Successfully',
        })
    }

    static async allCompanies(req, res) {
        const { numberOfMinutes, name, companyId } = req.query
        let { endDate } = req.query
        let whereClause = {}
        if (companyId) { whereClause.currentSubscriptionId = companyId }
        if (name) { whereClause.name = { [Op.like]: `%${name}%` } }
        let records = await Company.findAll({
            where: { ...whereClause },
            include: [
                {
                    model: Subscription,
                    include: [{
                        model: Billing,
                        attributes: ["totalCost"]
                    }],
                }
            ]
        })
        if (numberOfMinutes) {
            records = records.filter((company) => company.Subscription.numberOfMinutes == numberOfMinutes)
        }
        if (endDate) {
            endDate = endDate.split('-').reverse().join('-')
            records = records.filter((company) => ConvertDate(company.Subscription.endDate) === endDate)
        }
        return res.status(200).json({
            error: false,
            code: 200,
            message: 'Company fetched Successfully',
            data: records,
        })
    }

    static async updateImage(req, res) {
        const { id } = req.body
        if (!req.file) {
            return res.status(400).json({
                error: true,
                code: 400,
                message: "you should upload an image"
            });
        }
        const companyExist = await Company.findByPk(id)
        if (!companyExist) {
            return res.status(404).json({
                error: true,
                code: 404,
                message: "Company is not Exist"
            });
        }
        await companyExist.update({ image: `${req.protocol}://${req.get('host')}/image/${req.file.filename}` })
        return res.status(200).json({
            error: false,
            code: 200,
            message: "Image Uploaded Successfully",
            data: companyExist
        });
    }

    static async update(req, res) {
        const { id, password, name, status, phone } = req.body
        const record = await Company.findByPk(id)
        if (!record) {
            return res.status(404).json({
                error: true,
                code: 404,
                message: "Company is not Exist"
            })
        }
        if (record.name == name &&
            record.password == password &&
            record.phone == phone) {
            return res.status(400).json({
                error: true,
                code: 400,
                message: "No changes To update"
            })
        }
        if (name) { record.name = name }
        if (status) { record.status = status }
        if (phone) { record.phone = phone }
        if (password) {
            record.password = password
        }
        await record.update({
            name,
            status,
            phone,
            password
        })
        // record.save()
        return res.status(200).json({
            error: false,
            code: 200,
            message: "Company Updated Successfully",
            data: record
        })
    }

    static async delete(req, res) {
        const { id } = req.query
        if (!id) {
            return res.status(400).json({
                error: true,
                code: 400,
                message: "company id is required"
            })
        }
        const record = await Company.findByPk(id)
        if (!record) {
            return res.status(404).json({
                error: true,
                code: 404,
                message: "Company is not Exist"
            })
        }
        await record.destroy()
        return res.status(200).json({
            error: false,
            code: 200,
            message: "Company Deleted Successfully",
        })
    }

    static async updatePassword(req, res) {
        const { email, password } = req.body
        const record = await Company.findOne({
            where: { email }
        })
        if (!record) {
            return res.status(404).json({
                error: true,
                code: 404,
                message: "Company is not Exist"
            })
        }
        await record.update({ password })
        return res.status(200).json({
            error: false,
            code: 200,
            message: 'Password Updated Successfully',
            data: record
        })
    }
}

module.exports = AuthController