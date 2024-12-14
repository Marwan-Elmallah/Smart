const { MenuItem, Customer, Order, Restaurant } = require("../../database").models;

class AiController {
    static async get(req, res) {
        const { menuId, phone } = req.query;
        if (menuId && phone) {
            return res.status(400).json({
                error: true,
                code: 400,
                message: 'You should search by only one parameter'
            })
        } else if (menuId) {
            const records = await MenuItem.findAll({
                where: { menuId },
                attributes: ["id", 'arabic_name', 'english_name', 'arabic_ingredients', 'english_ingredients', 'availability', 'price'],
            });
            res.status(200).json({
                error: false,
                code: 200,
                data: records
            })
        } else if (phone) {
            const records = await Customer.findOne({
                where: { phone },
                attributes: ["id", 'name', 'phone', "mobile", 'address'],
            })
            res.status(200).json({
                error: false,
                code: 200,
                data: records
            });
        } else {
            return res.status(400).json({
                error: true,
                code: 400,
                message: 'Please provide menuId or customerId'
            })
        }
    }

    static async createOrder(req, res) {
        const { customerId, restaurantId, orderType, paymentMethod } = req.body;
        let { items } = req.body;
        items = JSON.parse(items);
        try {
            const customer = await Customer.findByPk(customerId);
            const restaurant = await Restaurant.findByPk(restaurantId);
            if (!customer || !restaurant) {
                return res.status(404).json({
                    error: true,
                    code: 404,
                    message: 'Customer or restaurant not found'
                });
            }
            const menuItemIds = items.map(item => item.id);
            const menuItems = await MenuItem.findAll({
                where: { id: menuItemIds }
            });

            if (menuItems.length !== items.length) {
                return res.status(404).json({
                    error: true,
                    code: 404,
                    message: 'Some menu items not found'
                });
            }

            const total = items.reduce((acc, item) => {
                const menuItem = menuItems.find(menuItem => menuItem.id === item.id);
                return acc + menuItem.price * item.qty;
            }, 0);

            items.map((item) => {
                item.arabic_name = menuItems.find(menuItem => menuItem.id == item.id).arabic_name;
                item.english_name = menuItems.find(menuItem => menuItem.id == item.id).english_name;
                item.price = menuItems.find(menuItem => menuItem.id == item.id).price
            })

            const order = await Order.create({
                customerId,
                restaurantId,
                total,
                items,
                orderType,
                paymentMethod
            });

            return res.status(201).json({
                error: false,
                code: 201,
                message: 'Order created successfully',
                data: order
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                error: true,
                code: 500,
                message: 'Internal server error',
                error
            });
        }
    }

    static async createCustomer(req, res) {
        const { name, phone, mobile, address, restaurantId } = req.body
        const restaurantExist = await Restaurant.findOne({
            where: { id: restaurantId }
        })
        if (!restaurantExist) {
            return res.status(404).json({
                error: true,
                code: 404,
                message: 'restaurant not found'
            })
        }
        const newCustomer = await Customer.create({
            name,
            phone,
            mobile,
            address,
            restaurantId
        })
        return res.status(201).json({
            error: false,
            code: 201,
            message: 'Customer Added Successfully',
            data: newCustomer
        })
    }
}

module.exports = AiController