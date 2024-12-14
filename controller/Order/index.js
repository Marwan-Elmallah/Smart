const { Op } = require("sequelize");
const moment = require('moment');


const { Customer, Restaurant, MenuItem, Order } = require("../../database").models;

class OrderController {
    static async create(req, res) {
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

    static async AllOrder(req, res) {
        const { restaurantId, name, id, status, paymentMethod, createdAt, orderType, sort, page, limit, orderBy } = req.query
        let whereClause = {}
        const order = orderBy || 'DESC';
        const sortedBy = sort || 'id';
        const pageNum = page ? parseInt(page) : 1;
        const pageLimit = limit ? parseInt(limit) : 10;
        const offset = (pageNum - 1) * pageLimit;

        if (id) { whereClause.id = id }
        if (restaurantId) { whereClause.restaurantId = restaurantId }
        if (status) { whereClause.status = status }
        if (paymentMethod) { whereClause.paymentMethod = paymentMethod }

        if (orderType) { whereClause.orderType = orderType }
        let records = await Order.findAll({
            where: whereClause,
            include: [{ model: Customer }],
            order: [[sortedBy, order]],
            limit: pageLimit,
            offset
        });
        if (name) {
            records = records.filter(order => order.customer.name.startsWith(name))
        }
        if (createdAt) {
            records = records.filter(order => moment(order.createdAt).format('DD-MM-YYYY') === moment(createdAt).format('DD-MM-YYYY'))
        }
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
        return res.status(200).json({
            error: false,
            code: 200,
            message: 'Orders fetched successfully',
            pagination,
            data: records
        });
    }

    static async update(req, res) {
        const { status, id } = req.body;
        const order = await Order.findByPk(id);
        if (!order) {
            return res.status(404).json({
                error: true,
                code: 404,
                message: 'Order not found'
            });
        }
        await order.update({ status })
        return res.status(200).json({
            error: false,
            code: 200,
            message: 'Order updated successfully',
            data: order
        });
    }

    static async delete(req, res) {
        const { id } = req.query;
        const order = await Order.findByPk(id);
        if (!order) {
            return res.status(404).json({
                error: true,
                code: 404,
                message: 'Order not found'
            });
        }
        await order.destroy();
        return res.status(200).json({
            error: false,
            code: 200,
            message: 'Order deleted successfully'
        });
    }
}

module.exports = OrderController;