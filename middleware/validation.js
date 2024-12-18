const Joi = require("joi")
const headers = ["body", "params", "query"]

const Validator = (Schema) => {
    try {
        return (req, res, next) => {
            headers.forEach((key) => {
                if (Schema[key]) {
                    let validateShema = Schema[key].validate(req[key])
                    if (validateShema.error) {
                        console.log(validateShema.error.details[0].type);
                        switch (validateShema.error.details[0].type) {
                            case "any.required":
                                throw new Error(`${validateShema.error.details[0].path[0]} is required`)
                            case "string.empty":
                                throw new Error(`${validateShema.error.details[0].path[0]} cannot be empty`)
                            case "any.only":
                                throw new Error(`${validateShema.error.details[0].message}`)
                            case "string.pattern.base":
                                throw new Error(`Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number and one special character`)
                            default:
                                throw new Error(validateShema.error)
                        }
                    } else {
                        next()
                    }
                }
            })
        }
    } catch (error) {
        return error
    }
}


exports.RestaurantRequestRules = Validator({
    body: Joi.object().required().keys({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        restaurantName: Joi.string().required(),
        email: Joi.string().required().email(),
        phone: Joi.string().required().min(10).max(14),
        // jobTitle: Joi.string().required(),
        address: Joi.number().required()
    })
})

exports.AgentCreateRules = Validator({
    body: Joi.object().required().keys({
        userName: Joi.string().required(),
        password: Joi.string().required().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')),
        email: Joi.string().required().email(),
        phone: Joi.string().required().min(10).max(14),
        jobTitle: Joi.string().required()
    })
})

exports.LoginRules = Validator({
    body: Joi.object().required().keys({
        email: Joi.string().required().email(),
        password: Joi.string().required(),
        isRestaurant: Joi.boolean().required()
    })
})

exports.RestaurantCreateRule = Validator({
    body: Joi.object().required().keys({
        email: Joi.string().required().email(),
        password: Joi.string().required().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')),
        restaurantRequestId: Joi.number().optional(),
        restaurantName: Joi.string().optional(),
        address: Joi.string().optional(),
        phone: Joi.string().optional().min(10).max(14),
    })
})

exports.RestaurantWithoutRequestCreateRule = Validator({
    body: Joi.object()
        .required()
        .keys({
            email: Joi.string().required().email(),
            password: Joi.string()
                .required()
                .pattern(
                    new RegExp(
                        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
                    )
                ),
            name: Joi.string().required(),
            phone: Joi.string().required(),
            address: Joi.string().required(),
            status: Joi.boolean().optional(),
        }),
});

exports.UpdatePasswordRule = Validator({
    body: Joi.object().required().keys({
        id: Joi.number().required(),
        password: Joi.string().required().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')),
        cPassword: Joi.required().valid(Joi.ref('password')).messages({ "any.only": "Password and cPassword do not match" }),
        isRestaurant: Joi.boolean().required()
    })
})

exports.UserCreateRule = Validator({
    body: Joi.object().required().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        phone: Joi.string().required().min(10).max(14),
        restaurantId: Joi.number().required(),
        level: Joi.string().required()
    })
})

exports.updateUserRule = Validator({
    body: Joi.object().required().keys({
        id: Joi.number().required(),
        name: Joi.string().optional(),
        phone: Joi.string().optional(),
        status: Joi.boolean().optional(),
        level: Joi.string().optional(),
        password: Joi.string().optional().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')),
    })
})

exports.CustomerCreateRule = Validator({
    body: Joi.object().required().keys({
        name: Joi.string().required(),
        address: Joi.string().required(),
        phone: Joi.string().required().min(10).max(14),
        mobile: Joi.string().optional().min(10).max(14),
        restaurantId: Joi.number().required()
    })
})

exports.MenuCreateRule = Validator({
    body: Joi.object().required().keys({
        english_name: Joi.string().required(),
        arabic_name: Joi.string().required(),
        arabic_ingredients: Joi.string().required(),
        english_ingredients: Joi.string().required(),
        price: Joi.number().required(),
        menuId: Joi.number().required(),
        categoryId: Joi.number().required(),
        availability: Joi.boolean().optional()
    }),
})

exports.UpdateMenuRule = Validator({
    body: Joi.object().required().keys({
        id: Joi.number().required(),
        availability: Joi.boolean().optional(),
        price: Joi.number().optional(),
        categoryId: Joi.number().optional(),
        english_name: Joi.string().optional(),
        arabic_name: Joi.string().optional(),
        arabic_ingredients: Joi.string().optional(),
        english_ingredients: Joi.string().optional(),
    }),
})

exports.UpdateCategoryRule = Validator({
    body: Joi.object().required().keys({
        id: Joi.number().required(),
        name: Joi.string().required(),
    }),
})

exports.DeleteRule = Validator({
    query: Joi.object().required().keys({
        id: Joi.number().required()
    })
})

exports.CategoryCreateRule = Validator({
    body: Joi.object().required().keys({
        name: Joi.string().required(),
        menuId: Joi.number().required(),
    })
})

exports.CompanyRegisterRule = Validator({
    body: Joi.object().required().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        phone: Joi.string().required(),
        password: Joi.string().required().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')),
        cPassword: Joi.required().valid(Joi.ref('password')).messages({ "any.only": "Password and cPassword do not match" }),
    })
})

exports.CompanyLoginRule = Validator({
    body: Joi.object().required().keys({
        email: Joi.string().required().email(),
        password: Joi.string().required(),
    })
})
