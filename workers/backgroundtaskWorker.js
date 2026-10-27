const redisClient = require('../redis');
const { getDueJobs,ACKforJob } = require('../queues/taskReminderQueue')
const { getTaskFromDB } = require('../repositories/taskRepository');
const pool = require('../db');

async function ProcessJob() {

    try {
        const dueJob = await getDueJobs()
        for(const job of dueJob){
            const taskId = job.split(':')[1]
            const task =  await getTaskFromDB(taskId)

        if (task === null) {
                await ACKforJob(job);
                continue;
            }

            if (task.status != 'pending' && task.status != 'in-progress') {
                await ACKforJob(job)
                continue
            }
            console.log(`${job} is due`);
            await ACKforJob(job)
        }
    } catch (error) {
        console.error('Error processing reminders:', error);
        
    }
}


let stopping = false
let timer
let stopTimer
let currentJob
async function startWorker() {
    if (!redisClient.isOpen) {
        await redisClient.connect();
    }

    console.log('Reminder worker connected to Redis');
while (!stopping) {
    currentJob = ProcessJob();
    await currentJob;
    currentJob = null;

    if (!stopping) {
        await new Promise(resolve => {
            stopTimer = resolve;
            timer = setTimeout(resolve, 10_000);
        });

        stopTimer = null;
        timer = null;
    }
}
}




async function stopWorker() {
    stopping = true;

    clearTimeout(timer);
    stopTimer?.()

    if (currentJob) {
        await currentJob;
    }
    
    console.log('Worker stopped');
}




let shuttingDown = false
async function shutDown() {
    if (shuttingDown) return
    shuttingDown = true

    console.log('Shutting down worker...');
    
    const shutdownTimer = setTimeout(()=>{
        console.error('Worker shutdown timed out. Forcing exit.')
        process.exit(1)

    },10_000)

    try {
        await stopWorker()

        if (redisClient.isOpen) {
            await redisClient.quit()
        }

        await pool.end()
        clearTimeout(shutdownTimer)
        console.log('Worker shutdown complete.');
    } catch (error) {
        console.error('Worker shutdown error:', error);
        process.exitCode = 1;
    }
}
process.on('SIGINT', shutDown);
process.on('SIGTERM', shutDown);

startWorker().catch(error => {
    console.error('Worker failed to start:', error);
    process.exitCode = 1;
});
