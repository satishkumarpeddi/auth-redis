import signup from '../controllers/auth.controller.js'

import express from 'express'

const router = express();

router.use(express.json())

router.post('/signup',signup)

export default router

