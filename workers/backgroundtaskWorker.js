const redisClient = require('../redis');
const { getDueJobs,ACKforJob } = require('../queues/taskReminderQueue')
const { getTask } = require('../services/taskService');
const { getTaskFromDB } = require('../repositories/taskRepository');

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
            console.log(`Reminder is due for ${job}`);
            await ACKforJob(job)
        }
    } catch (error) {
        console.error('Error processing reminders:', error);
        
    }
}

async function startWorker() {
    if (!redisClient.isOpen) {
        await redisClient.connect();
    }

    console.log('Reminder worker connected to Redis');

    await ProcessJob();
    setInterval(ProcessJob, 30_000);
}

startWorker().catch(console.error);
