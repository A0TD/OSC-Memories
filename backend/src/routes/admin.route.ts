import {Router} from "express"
import { getAllUsers,makeAdmin,deleteUser } from "../controllers/admin.controller"

const adminRouter = Router()

adminRouter.get("/users",getAllUsers)

adminRouter.patch("/users/:userId/make-admin",makeAdmin)

adminRouter.delete("/users/:userId",deleteUser)