import express from "express"
import { signin, signout, signup } from "../controllers/auth.controller.js"

const Route = express.Router()

Route.post('/signin', signin)

Route.post('/signout', signout)

Route.post('/signup', signup)

export default Route