const { Op } = require("sequelize");

const { RestaurantRequest } = require("../../database").models

class RestaurantsRequestController {
    static async allRequests(req, res) {
        const { restaurantName, numberOfBranches, status, sort, page, limit, orderBy } = req.query;
        let { createdAt } = req.query
        const order = orderBy || 'DESC';
        const sortedBy = sort || 'id';
        const pageNum = page ? parseInt(page) : 1;
        const pageLimit = limit ? parseInt(limit) : 10;
        const offset = (pageNum - 1) * pageLimit;
        let whereClause = {};
        if (restaurantName) { whereClause.restaurantName = restaurantName }
        if (numberOfBranches) { whereClause.numberOfBranches = { [Op.gte]: numberOfBranches } }
        if (createdAt) {
            createdAt = createdAt.split('-').reverse().join('-')
            whereClause.createdAt = {
                [Op.gte]: new Date(createdAt)
            }
        }
        if (status) { whereClause.status = status }
        const records = await RestaurantRequest.findAll({
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
        return res.status(200).json({
            error: false,
            code: 200,
            message: 'All Restaurants Requests',
            pagination,
            data: records
        })
    }


    static async create(req, res) {
        const { email, firstName, lastName, jobTitle, restaurantName, phone, address } = req.body
        const requestExist = await RestaurantRequest.findAll({
            where: { phone, email }
        })
        if (requestExist.length > 0) {
            return res.status(400).json({
                error: true,
                code: 400,
                message: "A Request With This Email Already Exists"
            })
        }
        const newRequest = await RestaurantRequest.create({
            email,
            firstName,
            lastName,
            jobTitle,
            restaurantName,
            phone,
            address
        })
        return res.status(201).json({
            error: false,
            code: 201,
            message: 'Restaurant Request Added Successfully',
            data: newRequest
        })
    }

}

module.exports = RestaurantsRequestController