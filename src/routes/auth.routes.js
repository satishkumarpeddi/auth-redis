import {changePassword, signin,signup} from '../controllers/auth.controller.js'

import express from 'express'
import validateSessionTokenJWT from '../middleware/cache.middleware.js';
import rateLimit from '../middleware/rateLimit.middleware.js';
const router = express();

router.use(express.json())

router.post('/signup',signup)

router.post('/signin',rateLimit,signin)

router.patch('/change-password',validateSessionTokenJWT,changePassword)

export default router

