const {
    createTask,
    getTaskList,
    getTask,
    modifyTask,
    deleteTask
} = require('../handlers/taskHandlers');



const routes = [
    {
        method: 'GET',
        path: '/api/v1/tasks',
        handler: getTaskList
    },
    {
        method: 'POST',
        path: '/api/v1/tasks',
        handler: createTask
    },
    {
        method: 'PATCH',
        path: '/api/v1/tasks/:id',
        handler: modifyTask
    },
    {
        method: 'DELETE',
        path: '/api/v1/tasks/:id',
        handler: deleteTask
    },
    {
        method: 'GET',
        path: '/api/v1/tasks/:id',
        handler: getTask
    }
]


module.exports = { routes };