const agentRule = {
    super: ["super"],
}
const restaurantRule = {
    admin: ["admin", ...agentRule.super], // "admin" can access all routes, "manager" can access "admin" and "employee" routes, "employee" can access "admin" and "manager" routes"admin",
    manager: ["manager", "admin", ...agentRule.super],
    employee: ["employee", "admin", "manager", ...agentRule.super],
}



const authorize = (requiredRole) => {
    return (req, res, next) => {
        // Check if user is authenticated and has the required role
        if (req.loginAuth && requiredRole.some(role => role === req.loginAuth.level)) {
            return next(); // User has the required role, proceed to the next middleware/route handler
        } else {
            return res.status(403).json({
                error: 'Unauthorized',
                code: 403,
                message: "You unauthorized to access this route"
            }); // User does not have the required role
        }
    };
};


module.exports = {
    restaurantRule,
    agentRule,
    authorize
}