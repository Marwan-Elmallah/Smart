const { Agent, Order, Restaurant } = require("../../database").models;

class AgentController {

    static async allAgents(req, res) {
        const { id } = req.query
        let whereClause = {}
        if (id) { whereClause.id = id }
        const records = await Agent.findAll({
            where: { ...whereClause },
        })
        return res.status(200).json({
            error: false,
            code: 200,
            message: 'All Agents',
            data: records
        })
    }

    static async create(req, res) {
        const { name, email, password, phone } = req.body
        const emailExiat = await Agent.findOne({ where: { email } })
        if (emailExiat) {
            return res.status(400).json({
                error: true,
                code: 400,
                message: "Agent Email Already Exists"
            })
        }
        const newAgent = await Agent.create({
            name,
            email,
            password,
            phone,
        })
        return res.status(201).json({
            error: false,
            code: 201,
            message: 'Agent Added Successfully',
            data: newAgent
        })
    }

    static async update(req, res) {
        const { id, name, phone, } = req.body
        if (!id) {
            return res.status(400).json({
                error: true,
                code: 400,
                message: "Agent ID is required"
            })
        }
        const agentExist = await Agent.findByPk(id)
        if (!agentExist) {
            return res.status(404).json({
                error: true,
                code: 404,
                message: "Agent not found"
            })
        }
        if (name == agentExist.name &&
            phone == agentExist.phone) {
            return res.status(400).json({
                error: true,
                code: 400,
                message: "No changes To update"
            })
        }
        if (name) { agentExist.name = name }
        if (phone) { agentExist.phone = phone }
        await agentExist.save()
        return res.status(200).json({
            error: false,
            code: 200,
            message: 'Agent Updated Successfully',
            data: agentExist
        })
    }

    static async delete(req, res) {
        let { id } = req.query
        if (!id) {
            return res.status(400).json({
                error: true,
                code: 400,
                message: "Agent ID is required"
            })
        }
        let agentExist = await Agent.findByPk(id)
        if (!agentExist) {
            return res.status(404).json({
                error: true,
                code: 404,
                message: "Agent not found"
            })
        }
        await Agent.destroy({
            where: {
                id
            }
        })
        return res.status(200).json({
            error: false,
            code: 200,
            message: 'Agent Deleted Successfully'
        })
    }

    static async RestaurantOrder(req, res) {
        const allOrders = await Order.findAll({
            include: [{
                model: Restaurant,
                attributes: ['name']
            }],
            attributes: ['restaurantId', 'status']
        });

        if (allOrders.length === 0) {
            return res.status(404).json({
                error: true,
                code: 404,
                message: 'No orders found'
            });
        }

        let restaurants = [];

        allOrders.forEach(order => {
            let existingRestaurant = restaurants.find(rest => rest.id === order.restaurantId);

            if (existingRestaurant) {
                existingRestaurant.count++;
            } else {
                restaurants.push({
                    id: order.restaurantId,
                    name: order.Restaurant.name,
                    count: 1
                });
            }
        });

        restaurants.forEach(restaurant => {
            restaurant.percentage = (restaurant.count / allOrders.length) * 100;
        });

        return res.status(200).json({
            error: false,
            code: 200,
            message: 'All Orders',
            data: restaurants
        });
    }

}

module.exports = AgentController