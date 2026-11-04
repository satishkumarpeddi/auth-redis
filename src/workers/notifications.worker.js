import { Worker } from "bullmq";

import 'dotenv/config'

const connection = {
    host : process.env.REDIS_HOST || "127.0.0.1",
    port : Number(process.env.REDIS_PORT || 6379)
}

const worker = new Worker("notifications",
    async(job)=>{
        console.log("Processing job:",job.name);
        console.log("Job data:",job.data);

        if(job.name==="welcome-email"){
            const {username,email} = job.data;
            console.log(`Welcome ${username}`)
            console.log(`Notification recipient: ${email}`)
        }
    },
    {connection}
);

worker.on("completed",(job)=>{
    console.log(`Job ${job.id} completed successfully`);
})

worker.on("failed",(job)=>{
    console.error(`Job ${job?.id} failed:`,error.message);
})

console.log("Notification worker is running...")