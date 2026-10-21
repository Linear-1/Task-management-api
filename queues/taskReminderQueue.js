const redisClient = require('../redis');

const QUEUE_KEY = 'task-reminder_jobs'


async function scheduleReminder(taskId,scheduleReminderstamp) {
    await redisClient.zAdd(QUEUE_KEY,[
        {
            score: scheduleReminderstamp,
            value: `task:${taskId}`

        }
    ]);
};

async function getDueJobs() {
    const now  = Date.now()

    return await redisClient.zRangeByScore(
        QUEUE_KEY,
        0,
        now,
        {
            LIMIT: {
                offset: 0,
                count: 1
            }
        }
    )
}
async function ACKforJob(job) {
    await redisClient.zRem(QUEUE_KEY,job)
}

module.exports = {
    scheduleReminder,
    getDueJobs,
    ACKforJob
}