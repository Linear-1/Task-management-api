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


module.exports = {
    scheduleReminder
}