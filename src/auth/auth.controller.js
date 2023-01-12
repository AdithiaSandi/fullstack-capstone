import jwtController from "jsonwebtoken"
import { getUserbyUsername } from "../users/users.model.js"

export const authLogin = (async (req, res) => {
    const {username, password} = req.body

    if (!username && !password) {
        return res.status(400)
            .json({
                meta: { 
                    code: 400,
                    message: "Some input are required"
                },
                data: {}
            })
    }

    const user = await getUserbyUsername(username)

    if (!user || user.deletedAt !== null) {
        return res.status(404)
            .json({
                meta: { 
                    code: 404,
                    message: "username not found"
                },
                data: {}
            })
    } 

    if (user.password === password) {
        const token = jwtController.sign(
            {   //payload/claim
                role: user.role,
                id: user.id,
            },
            process.env.JWT_SECRET, // secret JWT
            {
                expiresIn : "2d" // expired JWT
            }
        )
        return res.status(200)
                .json({
                    meta: { 
                        code: 200,
                        message: "Success login"
                    },
                    data: {
                        token: token
                    }
            })
    }
    return res.status(400)
            .json({
                meta: { 
                    code: 400,
                    message: "wrong password"
                },
                data: {}
            })
})