const router = require("express").Router()
const MenuController = require("../../controller/Menu")
const CategoryController = require("../../controller/Menu/Category");
const { uploadImage } = require("../../middleware/uploadImage");
const { MenuCreateRule, CategoryCreateRule, DeleteRule, UpdateMenuRule, UpdateCategoryRule } = require("../../middleware/validation");



router.get("/", MenuController.allMenu)
router.post("/", MenuCreateRule, MenuController.create)
router.put("/", UpdateMenuRule, MenuController.update)
router.put("/image", uploadImage, MenuController.updateImage)
router.delete("/", DeleteRule, MenuController.delete)


router.get("/category", CategoryController.allCategories)
router.post("/category", CategoryCreateRule, CategoryController.create)
router.put("/category", UpdateCategoryRule, CategoryController.update)
router.delete("/category", DeleteRule, CategoryController.delete)

module.exports = router