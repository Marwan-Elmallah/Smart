const { Op } = require("sequelize");
const { Restaurant, RestaurantRequest, Menu } = require("../../database").models;

const cron = require('node-cron');
const moment = require("moment");

class RestaurantController {
    static async scheduleTasks() {
        cron.schedule("0 0 * * *", async () => {
            try {
                await RestaurantController.updateRestaurantStatuses();
            } catch (error) {
                // Handle the error here. For example, log the error or send a notification.
            }
        });
    }

    static async updateRestaurantStatuses() {
        const today = moment().format("YYYY-MM-DD");

        console.log(today);

    }

    static async allRestaurant(req, res) {
        const { id, name } = req.query;
        let { status } = req.query
        let whereClause = {};
        if (id) { whereClause.id = id }
        if (name) { whereClause.name = { [Op.like]: `%${name}%` } }
        if (status) {
            status = JSON.parse(status)
            whereClause.status = status
        }
        const records = await Restaurant.findAll({
            where: { ...whereClause },
        })
        return res.status(200).json({
            error: false,
            code: 200,
            message: 'All Restaurant',
            data: records,
        })
    }

    static async create(req, res) {
        const { email, password, restaurantRequestId, restaurantName, phone, address } = req.body
        const emailExist = await Restaurant.findOne({ where: { email } })
        if (emailExist) {
            return res.status(400).json({
                error: true,
                code: 400,
                message: 'Email Already Exists'
            })
        }
        if (!restaurantRequestId) {
            if (!restaurantName || !phone || !address) {
                return res.status(400).json({
                    error: true,
                    code: 400,
                    message: 'Restaurant Data is Required'
                })
            }
            const newRestaurant = await Restaurant.create({
                email,
                password,
                name: restaurantName,
                phone,
                address
            })
            await Menu.create({
                restaurantId: newRestaurant.id,
                name: `Main Menu ${restaurantName}`,
            })
            return res.status(201).json({
                error: false,
                code: 201,
                message: 'Restaurant and Menu Created Successfully',
                data: newRestaurant
            })
        }
        const restaurantExist = await Restaurant.findAll({ where: { restaurantRequestId } })
        if (restaurantExist.length > 0) {
            return res.status(400).json({
                error: true,
                code: 400,
                message: 'Restaurant Already Exists'
            })
        }
        const restaurantRequest = await RestaurantRequest.findByPk(restaurantRequestId)
        if (!restaurantRequest) {
            return res.status(404).json({
                error: true,
                code: 404,
                message: 'Restaurant Request Not Found'
            })
        }
        await restaurantRequest.update({ status: 'approved' })
        const newRestaurant = await Restaurant.create({
            email,
            password,
            name: restaurantRequest.restaurantName,
            restaurantRequestId,
            phone: restaurantRequest.phone,
            address: restaurantRequest.address
        })
        await Menu.create({
            restaurantId: newRestaurant.id,
            name: `Main Menu ${restaurantRequest.restaurantName}`,
        })
        return res.status(201).json({
            error: false,
            code: 201,
            message: 'Restaurant and Menu Created Successfully',
            data: newRestaurant
        })
    }

    static async delete(req, res) {
        const { id } = req.query
        if (!id) {
            return res.status(400).json({
                error: true,
                code: 400,
                message: 'Restaurant ID is required'
            })
        }
        const restaurant = await Restaurant.findByPk(id)
        if (!restaurant) {
            return res.status(404).json({
                error: true,
                code: 404,
                message: 'Restaurant Not Found'
            })
        }
        const menu = await Menu.findOne({
            where: { RestaurantId: restaurant.id }
        })
        await menu.destroy()
        await restaurant.destroy()
        return res.status(200).json({
            error: false,
            code: 200,
            message: 'Restaurant Deleted Successfully'
        })
    }

    static async update(req, res) {
        const { id, name, status, phone } = req.body
        const restaurant = await Restaurant.findByPk(id)
        if (!restaurant) {
            return res.status(404).json({
                error: true,
                code: 404,
                message: 'Restaurant Not Found'
            })
        }
        if (name) { restaurant.name = name }
        if (status) { restaurant.status = status }
        if (phone) { restaurant.phone = phone }
        await restaurant.update({ name, status, phone })
        return res.status(200).json({
            error: false,
            code: 200,
            message: 'Restaurant Updated Successfully',
            data: restaurant
        })
    }

}

module.exports = RestaurantController