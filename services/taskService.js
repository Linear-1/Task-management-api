const { randomUUID } = require('crypto');



const storage = []


function createTask(data) {
    const now = new Date().toISOString();

    const task = {
        id: randomUUID(),
        title: data.title,
        description: data.description ?? '',
        status: data.status ?? 'pending',
        dueDate: data.dueDate ?? null,
        createdAt: now,
        updatedAt: now
    };

    storage.push(task)
    return task
}




    function getAllTasks() {
        return storage
    }






function updateTask(taskId, data) {
    const task = storage.find(task => task.id === taskId)

    if (!task) {
        return null
    }

    if (Object.hasOwn(data, 'title')) {
        task.title = data.title
    }

    if (Object.hasOwn(data, 'description')) {
        task.description = data.description
    }

    if (Object.hasOwn(data, 'status')) {
        task.status = data.status
    }

    if (Object.hasOwn(data, 'dueDate')) {
        task.dueDate = data.dueDate
    }

    task.updatedAt = new Date().toISOString();

    return task;
}
function deleteTask(taskId) {
    const task = storage.find(task => task.id === taskId)

    if (task) {
        const index = storage.indexOf(task)
        storage.splice(index, 1)
        return true
    }

    return false
}
function getTask(taskId) {
    const task = storage.find((task) => {
        return task.id === taskId
    });

    if (task) {
        return task
    }

    return null
}

module.exports = { 
    createTask,
    getAllTasks,
    updateTask,
    deleteTask,
    getTask

 }
 