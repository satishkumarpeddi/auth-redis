import {changePassword, signin,signup} from '../controllers/auth.controller.js'

import express from 'express'
import validateSessionTokenJWT from '../middleware/cache.middleware.js';


const router = express();

router.use(express.json())

router.post('/signup',signup)

router.post('/signin',signin)

router.patch('/change-password',validateSessionTokenJWT,changePassword)

export default router

