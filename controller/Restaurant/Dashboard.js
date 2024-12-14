const { Order } = require("../../database").models

class DashboardController {
    static async totalSales(req, res) {
        const { id } = req.query
        if (!id) {
            return res.status(404).json({
                error: true,
                code: 404,
                message: 'Restaurant ID is required'
            })
        }
        const orders = await Order.findAll({
            where: {
                restaurantId: id
            },
            attributes: ['total']
        })
        if (orders.length === 0) {
            return res.status(404).json({
                error: true,
                code: 404,
                message: 'No orders found'
            })
        }
        const total = orders.reduce((acc, order) => acc + order.total, 0)
        return res.status(200).json({
            error: false,
            code: 200,
            data: total
        })
    }

    static async mostItemsOrder(req, res) {
        const { id } = req.query;

        // Checking if restaurant ID is provided
        if (!id) {
            return res.status(400).json({
                error: true,
                code: 400,
                message: 'Restaurant ID is required'
            });
        }

        try {
            // Fetching orders for the given restaurant ID
            const orders = await Order.findAll({
                where: { restaurantId: id },
                attributes: ['items']
            });

            // Handling case where no orders are found
            if (orders.length === 0) {
                return res.status(404).json({
                    error: true,
                    code: 404,
                    message: 'No orders found'
                });
            }

            let items = [];
            let totalQuantity = 0;
            // Processing each order to count items and total quantity
            const orderItemsList = orders.map(order => order.items);
            // const orderItemsList = orders.map(order => order.items);
            orderItemsList.forEach(order => {
                order.forEach(item => {
                    // Finding index of item in items array
                    const itemIndex = items.findIndex(i => i.id === item.id);
                    if (itemIndex !== -1) {
                        // If item already exists, update its quantity
                        items[itemIndex].qty += item.qty;
                        items[itemIndex].arabic_name = item.arabic_name
                        items[itemIndex].english_name = item.english_name
                    } else {
                        // If item doesn't exist, add it to items array
                        items.push({ id: item.id, qty: item.qty });
                    }
                    // Increment total quantity
                    totalQuantity += item.qty;
                });
            });

            // Calculating percentage for each item
            items.forEach(item => {
                item.percentage = (item.qty / totalQuantity) * 100;
            });

            // Returning the result
            return res.status(200).json({
                error: false,
                code: 200,
                data: items.sort((a, b) => b.qty - a.qty)
            });
        } catch (error) {
            // Handling unexpected errors
            console.error('Error retrieving orders:', error);
            return res.status(500).json({
                error: true,
                code: 500,
                message: 'Internal Server Error'
            });
        }
    }

}

module.exports = DashboardController