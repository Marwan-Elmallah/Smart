const { Op } = require("sequelize");

const { Category, Menu, MenuItem } = require("../../database").models;

class CategoryController {

    static async allCategories(req, res) {
        const { name, menuId, id, number } = req.query;
        let whereClause = {};
        if (name) {
            whereClause.name = { [Op.like]: `%${name}%` };
        }
        if (menuId) {
            whereClause.menuId = menuId;
        }
        if (id) {
            whereClause.id = id
        }
        let records = await Category.findAll({
            where: { ...whereClause },
            include: [{ model: MenuItem }],
        });
        if (number) {
            records = records.filter(categ => categ.menuItems.length >= number)
        }
        return res.status(200).json({
            error: false,
            code: 200, message: 'Categories Fetched Successfully',
            data: records
        });
    }

    static async create(req, res) {
        try {
            const { name, menuId } = req.body
            const menuExist = await Menu.findOne({ where: { id: menuId } })
            if (!menuExist) {
                return res.status(404).json({
                    error: true,
                    code: 404, message: 'Menu Not Found'
                })
            }
            const categoryExist = await Category.findOne({ where: { name, menuId } })
            if (categoryExist) {
                return res.status(400).json({
                    error: true,
                    code: 400, message: 'Category Already Exist'
                })
            }
            const newCategory = await Category.create({ name, menuId })
            return res.status(201).json({
                error: false,
                code: 201, message: 'Category Added Successfully',
                data: newCategory
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

    static async update(req, res) {
        const { id, name } = req.body
        const category = await Category.findByPk(id)
        if (!category) {
            return res.status(404).json({
                error: true,
                code: 404, message: 'Category Not Found'
            })
        }
        // if (name == category.name) {
        //     return res.status(400).json({
        //         error: true,
        //         code: 400, message: 'No changes To update'
        //     })
        // }
        await category.update({ name })
        await category.save()
        return res.status(200).json({
            error: false,
            code: 200, message: 'Category Updated Successfully',
            data: category
        })
    }

    static async delete(req, res) {
        const { id } = req.query
        if (!id) {
            return res.status(400).json({
                error: true,
                code: 400,
                message: 'Category ID is required'
            })
        }
        const category = await Category.findByPk(id)
        if (!category) {
            return res.status(404).json({
                error: true,
                code: 404, message: 'Category Not Found'
            })
        }
        const menuItemExist = await MenuItem.findAll({ where: { categoryId: category.id } })
        if (menuItemExist.length > 0) {
            return res.status(400).json({
                error: true,
                code: 400,
                message: "There is Items are belonges to this Category, So Please Delete Them First"
            })
        }
        await category.destroy()
        return res.status(200).json({
            error: false,
            code: 200, message: 'Category Deleted Successfully'
        })
    }

}

module.exports = CategoryController