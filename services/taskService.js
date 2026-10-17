const { createTask: createTaskInDB } = require("../repositories/taskRepository");
const { getAllTasksFromDB } = require("../repositories/taskRepository");
const { deleteTaskFromDB } = require("../repositories/taskRepository");
const { getTaskFromDB } = require("../repositories/taskRepository");
const { upadtingTask } = require("../repositories/taskRepository");




function createTask(data) {
    return  createTaskInDB(data)
}




function getAllTasks() {
        return getAllTasksFromDB()
    }







function updateTask(taskId, data) {
    return upadtingTask(taskId,data)
}
function deleteTask(taskId) {
    return deleteTaskFromDB(taskId)
}
function getTask(taskId) {
    return getTaskFromDB(taskId)
}

module.exports = { 
    createTask,
    getAllTasks,
    updateTask,
    deleteTask,
    getTask

 }
 