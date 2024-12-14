const { Subscription, Company, Billing } = require("../../database").models;

class subscriptionController {
    static async allSubscription(req, res) {
        const records = await Subscription.findAll({})
        return res.status(200).json({
            error: false,
            code: 200,
            data: records
        });
    }

    static async create(req, res) {
        const startDate = new Date();
        const companyId = req.loginAuth.record.id;
        const company = await Company.findByPk(companyId)
        if (!company) {
            return res.status(400).json({
                error: true,
                code: 400,
                message: 'Company not found'
            })
        }
        const subscription = await Subscription.create({
            companyId,
            startDate,
            tier: "Tier1"
        })
        await company.update({ currentSubscriptionId: subscription.id, status: true })
        const createdBill = await Billing.create({ subscriptionId: subscription.id })
        await subscription.update({ currentBillingId: createdBill.id })
        await subscription.save()
        return res.status(201).json({
            error: false,
            code: 201,
            message: 'Subscription created successfully',
            data: subscription
        })
    }

    static async update(req, res) {
        const { id, startDate, endDate, numberOfMinutes } = req.body
        const subscription = await Subscription.findByPk(id)
        if (!subscription) {
            return res.status(404).json({
                error: true,
                code: 404,
                message: 'Subscription not found'
            })
        }
        if (startDate === subscription.startDate &&
            endDate === subscription.endDate &&
            numberOfMinutes === subscription.numberOfMinutes) {
            return res.status(400).json({
                error: true,
                code: 400,
                message: 'No changes to update'
            })

        }
        if (startDate) {
            subscription.startDate = startDate
        }
        if (numberOfMinutes) {
            subscription.numberOfMinutes = numberOfMinutes
        }
        if (endDate) {
            subscription.endDate = endDate
        }
        await subscription.save()
        return res.status(200).json({
            error: false,
            code: 200,
            message: 'Subscription updated successfully',
            data: subscription
        })
    }

    static async delete(req, res) {
        const { id } = req.query
        if (!id) {
            return res.status(400).json({
                error: true,
                code: 400,
                message: 'Subscription ID is required'
            })
        }
        const subscription = await Subscription.findByPk(id)
        if (!subscription) {
            return res.status(404).json({
                error: true,
                code: 404,
                message: 'Subscription not found'
            })
        }
        await subscription.destroy()
        return res.status(200).json({
            error: false,
            code: 200,
            message: 'Subscription deleted successfully'
        })
    }
}

module.exports = subscriptionController