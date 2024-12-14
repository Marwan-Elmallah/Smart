const { Customer, Restaurant } = require("../../database").models

class CustomerController {
    static async create(req, res) {
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

    static async allCustomers(req, res) {
        const { restaurantId } = req.query
        let records
        if (restaurantId) {
            records = await Customer.findAll({
                where: { restaurantId }
            })
        } else {
            records = await Customer.findAll({})
        }
        return res.status(200).json({
            error: false,
            code: 200,
            message: 'All Customers',
            data: records
        })
    }

    static async delete(req, res) {
        const { id } = req.query
        if (!id) {
            return res.status(400).json({
                error: true,
                code: 400,
                message: 'Customer ID is required'
            })
        }
        const customer = await Customer.findByPk(id)
        if (!customer) {
            return res.status(404).json({
                error: true,
                code: 404,
                message: 'Customer Not Found'
            })
        }
        await customer.destroy()
        return res.status(200).json({
            error: false,
            code: 200,
            message: 'Customer Deleted Successfully'
        })
    }

    static async update(req, res) {
        const { id, name, phone, mobile, address } = req.body
        const customer = await Customer.findByPk(id)
        if (!customer) {
            return res.status(404).json({
                error: true,
                code: 404,
                message: 'Customer Not Found'
            })
        }
        if (name) { customer.name = name }
        if (phone) { customer.phone = phone }
        if (mobile) { customer.mobile = mobile }
        if (address) { customer.address = address }
        await customer.save()
        return res.status(200).json({
            error: false,
            code: 200,
            message: 'Customer Updated Successfully',
            data: customer
        })
    }
}

module.exports = CustomerController