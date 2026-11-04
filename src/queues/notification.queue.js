import { Queue } from "bullmq";

const connection = {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT || 6379)
}

const notificationQueue = new Queue("notifications",{
    connection
})

export default notificationQueue;