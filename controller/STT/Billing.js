const { Billing, Subscription } = require("../../database").models

class BillingSTTController {
    static async create(req, res) {
        const { subscriptionId } = req.body
        const subscription = await Subscription.findByPk(subscriptionId)
        if (!subscription) {
            return res.status(404).json({
                error: true,
                code: 404,
                message: "Subscription not found"
            })
        }
        const bill = await Billing.findOne({
            where: {
                subscriptionId
            }
        })
        if (subscription.tier == "Tier1") {
            await bill.update({
                firstTierCost: subscription.numberOfMinutes * 0.0416,
            })
        } else if (subscription.tier == "Tier2") {
            await bill.update({
                secondTierCost: (subscription.numberOfMinutes - 6000) * 0.0375,
                firstTierCost: 6000 * 0.0416,
            })
        } else if (subscription.tier == "Tier3") {
            await bill.update({
                thirdTierCost: (subscription.numberOfMinutes - 12000) * 0.0333,
                secondTierCost: 12000 * 0.0375,
                firstTierCost: 6000 * 0.0416
            })
        } else {
            await bill.update({
                fourthTierCost: (subscription.numberOfMinutes - 30000) * 0.0167,
                thirdTierCost: 30000 * 0.0333,
                secondTierCost: 12000 * 0.0375,
                firstTierCost: 6000 * 0.0416
            })
        }
        await bill.update({
            totalCost: bill.firstTierCost + bill.secondTierCost + bill.thirdTierCost + bill.fourthTierCost
        })
        return res.status(200).json({
            error: false,
            code: 200,
            message: 'Billing created successfully',
            data: bill
        })
    }

    static async totalBilling(req, res) {
        const allBilling = await Billing.findAll({
            attributes: ['totalCost']
        })
        console.log(allBilling);
        let total = allBilling.reduce((acc, bill) => acc + bill.totalCost, 0)
        return res.status(200).json({
            error: false,
            code: 200,
            message: 'Total Billing',
            data: total,
        })
    }
    // static async totalBilling(req, res) {
    //     const { subscriptionId } = req.query;
    //     let records
    //     if (subscriptionId) {
    //         records = await Billing.findAll({
    //             where: {
    //                 subscriptionId
    //             },
    //             include: [{ model: Subscription }]
    //         })
    //     } else {
    //         records = await Billing.findAll({
    //             include: [{ model: Subscription }]
    //         })
    //     }
    //     return res.status(200).json({
    //         error: false,
    //         code: 200,
    //         message: 'All Billing',
    //         data: records,
    //     })
    // }
}

module.exports = BillingSTTController