const { createTask: createTaskInDB } = require("../repositories/taskRepository");
const { getAllTasksFromDB } = require("../repositories/taskRepository");
const { deleteTaskFromDB } = require("../repositories/taskRepository");
const { getTaskFromDB } = require("../repositories/taskRepository");
const { upadtingTask } = require("../repositories/taskRepository");
const redisClient = require('../redis');



function createTask(data) {
    return  createTaskInDB(data)
}




function getAllTasks() {
        return getAllTasksFromDB()
    }



async function updateTask(taskId, data) {

    const updateedTask =  upadtingTask(taskId,data)
    if (upadtingTask && redisClient.isReady) {
        try {
            await redisClient.del(`task:${taskId}`)
            console.log(`Cache invalidated: task:${taskId}`);
            
        } catch (error) {
            console.error('Redis cache invalidation failed:', err.message);
        }
    }

    return updateedTask


}
async function deleteTask(taskId) {

    const deletedTask = await deleteTaskFromDB(taskId)

    if (deletedTask && redisClient.isReady) {
        try {
            await redisClient.del(`task:${taskId}`)
            console.log(`Cache invalidated: task:${taskId}`);
            
        } catch (error) {
            console.error('Redis cache invalidation failed:', err.message);

            
        }
    }
    
    return deletedTask




}
async function getTask(taskId) {
    const cacheKey = `task:${taskId}`

    if (redisClient.isReady) {
        try {
            const cachedTask = await redisClient.get(cacheKey)

            if (cachedTask !== null) {
                console.log(`cache hit : ${cacheKey}`);
                return JSON.parse(cachedTask)
            }

        } catch (error) {
            console.log('Redis cache read failed:', error.message);
            
        }
    } 

    const task  = await getTaskFromDB(taskId)

    if (task !== null && redisClient.isReady) {
        try {
            await redisClient.set(
                cacheKey,
                JSON.stringify(task),
                { EX: 60 }
            )

            console.log(`CacheSet: ${cacheKey}`);
            
        } catch (error) {
            console.error('Redis cache write failed:', error.message)
        }
    }

    return task 

}

module.exports = { 
    createTask,
    getAllTasks,
    updateTask,
    deleteTask,
    getTask

 }
 