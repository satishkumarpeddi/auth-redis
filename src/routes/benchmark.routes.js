import express from "express";
import UserModel from "../models/user.model.js";
import cacheService from "../services/cache.service.js";

const router = express.Router();

router.get("/benchmark/:email", async (req, res) => {
    try {
        const email = req.params.email.trim().toLowerCase();

        const cacheKey = `auth:user:${email}`;

        const start = performance.now();

        let user = await cacheService.getCache(cacheKey);

        let source = "Redis";

        if (!user) {
            source = "MongoDB";

            user = await UserModel.findOne({ email })
                .select("+password")
                .lean();

            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            await cacheService.setCache(
                cacheKey,
                {
                    id: user._id.toString(),
                    username: user.username,
                    email: user.email,
                    password: user.password
                },
                60
            );
        }

        const end = performance.now();

        return res.status(200).json({
            source,
            latency: `${(end - start).toFixed(3)} ms`,
            user: {
                id: user.id || user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Benchmark failed"
        });
    }
});

export default router;