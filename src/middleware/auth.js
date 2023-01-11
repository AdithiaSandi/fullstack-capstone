import JSONtoken from "jsonwebtoken"

export const verifyToken = ((req, res, next) => {
    const jwt = req.headers["authorization"]

    if (!jwt) {
        return res.status(400)
            .json({
                meta: { 
                    code: 400,
                    message: "missing jwt"
                },
                data: {}
            })
    }

    const bearer = jwt.split(" ")
    const token = bearer[1]

    try {
    const decode = JSONtoken.verify(token, process.env.JWT_SECRET)
    } catch (err) {
        return res.status(401)
            .json({
                meta: { 
                    code: 400,
                    message: "Invalid Token"
                },
                data: {}
            })
    }

    return next()

 })