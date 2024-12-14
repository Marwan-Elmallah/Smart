const { User, Restaurant } = require("../../database").models;
const { Op } = require("sequelize");
const { generateRondomString } = require("../../helper/Helper");
const MailManger = require("../../helper/MailManger");
const MailTemplets = require("../../helper/MailTemplets");
const TokenManager = require("../../helper/jwt");

class UserController {

    static async allUsers(req, res) {
        const { sort, page, limit, orderBy, id, name, phone, level, restaurantId } = req.query;
        let { status } = req.query
        const order = orderBy || 'DESC';
        const sortedBy = sort || 'id';
        const pageNum = page ? parseInt(page) : 1;
        const pageLimit = limit ? parseInt(limit) : 10;
        const offset = (pageNum - 1) * pageLimit;
        const whereClause = {}
        if (id) { whereClause.id = id }
        if (name) { whereClause.name = { [Op.like]: `%${name}%` } }
        if (phone) { whereClause.phone = { [Op.like]: `%${phone}%` } }
        if (restaurantId) { whereClause.restaurantId = restaurantId }
        if (status) {
            status = JSON.parse(status)
            whereClause.status = status
        }
        if (level) { whereClause.level = level }
        const records = await User.findAll({
            where: { ...whereClause },
            order: [[sortedBy, order]],
            limit: pageLimit,
            offset
        })
        const pagination = {
            page: pageNum,
            itemPerPage: pageLimit,
            totalItems: records.length,
            count: records?.length,
            nextPage: pageNum + 1,
            previousPage: pageNum - 1,
            hasNextPage: pageLimit * pageNum < records.length,
            hasNextTwoPage: pageLimit * (pageNum + 2) < records.length,
            hasNextThreePage: pageLimit * (pageNum + 3) < records.length,
            hasPreviousPage: pageNum > 1,
            hasPagenation: records.length > pageLimit,
        }
        res.status(200).json({
            error: false,
            code: 200,
            message: 'All Users',
            pagination,
            data: records
        })
    }

    static async create(req, res) {
        try {
            const { name, level, phone, email } = req.body
            const restaurant = req.loginAuth
            const existingUser = await User.findOne({ where: { email } })
            if (existingUser) {
                return res.status(400).json({
                    error: true,
                    code: 400,
                    message: 'User Email Already Exists'
                })
            }
            // console.log(restaurant);
            const existRestaurant = await Restaurant.findByPk(restaurant.id)
            const record = await User.create({
                email,
                password: generateRondomString(8),
                name,
                level,
                phone,
                restaurantId: existRestaurant.id
            })
            const token = TokenManager.generateToken({ record }, 1)
            await MailManger.send(email, 'Invitation Email', null, MailTemplets.AcceptInvitation(existRestaurant, token, "createPassword"))
            return res.status(201).json({
                error: false,
                code: 201,
                message: 'Invitation Sent Successfully'
            })
        } catch (error) {
            return res.status(500).json({
                error: true,
                code: 500,
                message: 'Internal Server Error',
                error
            })
        }
    }

    static async update(req, res) {
        const { id, name, level, phone } = req.body
        let { status } = req.body
        if (!id) {
            return res.status(400).json({
                error: true,
                code: 400,
                message: 'User ID is required'
            })
        }
        const userExist = await User.findByPk(id)
        if (!userExist) {
            return res.status(404).json({
                error: true,
                code: 404,
                message: 'User Not Found'
            })
        }
        if (name) { userExist.name = name }
        if (level) { userExist.level = level }
        if (phone) { userExist.phone = phone }
        if (status) {
            status = JSON.parse(status)
            userExist.status = status
        }
        await userExist.update({ name, level, phone, status })
        await userExist.save()
        return res.status(200).json({
            error: false,
            code: 200,
            message: 'User Updated Successfully',
            data: userExist
        })
    }

    static async delete(req, res) {
        const { id } = req.query
        if (!id) {
            return res.status(400).json({
                error: true,
                code: 400,
                message: 'User ID is required'
            })
        }
        const userExist = await User.findByPk(id)
        if (!userExist) {
            return res.status(404).json({
                error: true,
                code: 404,
                message: 'User Not Found'
            })
        }
        await userExist.destroy()
        return res.status(200).json({
            error: false,
            code: 200,
            message: 'User Deleted Successfully'
        })
    }
}

module.exports = UserController