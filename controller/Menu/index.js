const { Op } = require("sequelize");
const { Menu, MenuItem, Category } = require("../../database").models;


class MenuController {

    static async allMenu(req, res) {
        const { name, id, categoryId, menuId } = req.query
        let { availability } = req.query
        let whereClause = {}
        if (id) { whereClause.id = id }
        if (availability) {
            availability = JSON.parse(availability)
            whereClause.availability = availability
        }
        if (name) {
            whereClause[Op.or] = [
                { english_name: { [Op.like]: `%${name}%` } },
                { arabic_name: { [Op.like]: `%${name}%` } }
            ];
        }
        if (menuId) { whereClause.menuId = menuId }
        if (categoryId) { whereClause.categoryId = categoryId }
        const records = await MenuItem.findAll({
            where: { ...whereClause },
            include: {
                model: Category,
                attributes: ["name"]
            },
        })
        return res.status(200).json({
            error: false,
            code: 200,
            message: 'All Menu Items',
            data: records
        })
    }

    static async create(req, res) {
        try {
            const { english_name, arabic_name, price, arabic_ingredients, english_ingredients, menuId, availability, categoryId } = req.body
            const MenuExist = await Menu.findOne({
                where: {
                    id: menuId
                }
            })
            if (!MenuExist) {
                return res.status(404).json({
                    error: true,
                    code: 404,
                    message: 'Menu Not Found'
                })
            }
            const categoryExist = await Category.findByPk(categoryId)
            if (!categoryExist || categoryExist.menuId != menuId) {
                return res.status(404).json({
                    error: true,
                    code: 404,
                    message: 'Category Not Found'
                })
            }
            const itemsExist = await MenuItem.findAll({
                where: { menuId },
                attributes: ["arabic_name", "english_name"]
            })
            if (itemsExist.length > 0) {
                const itemExist = itemsExist.some(item => item.english_name == english_name || item.arabic_name == arabic_name)
                if (itemExist) {
                    return res.status(404).json({
                        error: true,
                        code: 404,
                        message: 'Item Already Exist'
                    })
                }
            }
            const newMenuItem = await MenuItem.create({
                english_name,
                arabic_name,
                arabic_ingredients,
                english_ingredients,
                price,
                menuId,
                categoryId,
                availability,
            })
            return res.status(201).json({
                error: false,
                code: 201,
                message: 'Menu Item Added Successfully',
                data: newMenuItem,
            })
        } catch (error) {
            return res.status(500).json({
                error: true,
                code: 500,
                message: error.message,
                error
            })
        }
    }

    static async delete(req, res) {
        const { id } = req.query
        if (!id) {
            return res.status(400).json({
                error: true,
                code: 400,
                message: 'menu ID is required'
            })
        }
        const menuItem = await MenuItem.findByPk(id)
        if (!menuItem) {
            return res.status(404).json({
                error: true,
                code: 404,
                message: 'Item Not Found'
            })
        }
        await menuItem.destroy()
        return res.status(200).json({
            error: false,
            code: 200,
            message: 'Item Deleted Successfully'
        })
    }
    static async update(req, res) {
        const { id, english_name, arabic_name, arabic_ingredients, english_ingredients, categoryId } = req.body
        let { price, availability } = req.body
        if (availability) {
            availability = JSON.parse(availability)
        }
        if (price) {
            price = JSON.parse(price)
        }
        const menuItem = await MenuItem.findByPk(id)
        if (!menuItem) {
            return res.status(404).json({
                error: true,
                code: 404,
                message: 'Item Not Found'
            })
        }
        // if (
        //     english_name === menuItem.english_name &&
        //     arabic_name === menuItem.arabic_name &&
        //     arabic_ingredients === menuItem.arabic_ingredients &&
        //     english_ingredients === menuItem.english_ingredients &&
        //     price === menuItem.price &&
        //     availability === availability,
        //     categoryId === menuItem.categoryId
        // ) {
        //     return res.status(400).json({
        //         error: true,
        //         code: 400,
        //         message: 'No changes To update'
        //     })
        // }
        await menuItem.update({
            english_name,
            arabic_name,
            arabic_ingredients,
            english_ingredients,
            price,
            availability,
            categoryId,
        })
        menuItem.save()
        return res.status(200).json({
            error: false,
            code: 200,
            message: 'Item Updated Successfully',
            data: menuItem
        })
    }

    static async updateImage(req, res) {
        const { id } = req.body
        const menuItem = await MenuItem.findByPk(id)
        if (!menuItem) {
            return res.status(404).json({
                error: true,
                code: 404,
                message: 'Item Not Found'
            })
        }
        await menuItem.update({
            image: `${req.protocol}://${req.get('host')}/image/${req.file.filename}`
        })
        await menuItem.save()
        return res.status(200).json({
            error: false,
            code: 200,
            message: 'Image Updated Successfully',
            data: menuItem
        })
    }
}

module.exports = MenuController