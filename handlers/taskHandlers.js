const { isValidDate } = require('../utils/validation');
const { createTask: createTaskService } =  require('../services/taskService')
const { getAllTasks } = require('../services/taskService');
const { updateTask } = require('../services/taskService');
const { deleteTask: deleteTaskService } = require('../services/taskService');
const { getTask: getTaskService } = require('../services/taskService');





function createTask(req, res) {
    let body = '';

    req.on('data', chunk => {
        body += chunk;
    });

    req.on('end', () => {
        let data;

        try {
            data = JSON.parse(body);
        } catch {
            res.statusCode = 400;
            res.end(JSON.stringify({
                error: 'Invalid JSON'
            }));
            return;
        }

        if (
            data === null ||
            typeof data !== 'object' ||
            Array.isArray(data)
        ) {
            res.statusCode = 400;
            res.end(JSON.stringify({
                error: 'Request body must be a JSON object'
            }));
            return;
        }

        if (typeof data.title !== 'string') {
            res.statusCode = 400;
            res.end(JSON.stringify({
                error: 'Title must be a string'
            }));
            return;
        }

        if (data.title.trim() === '') {
            res.statusCode = 400;
            res.end(JSON.stringify({
                error: 'Title cannot be empty'
            }));
            return;
        }

        if (
            Object.hasOwn(data, 'description') &&
            typeof data.description !== 'string'
        ) {
            res.statusCode = 400;
            res.end(JSON.stringify({
                error: 'Description must be a string'
            }));
            return;
        }

        if (
            data.dueDate !== undefined &&
            data.dueDate !== null &&
            (
                typeof data.dueDate !== 'string' ||
                !isValidDate(data.dueDate)
            )
        ) {
            res.statusCode = 400;
            res.end(JSON.stringify({
                error: 'Invalid dueDate'
            }));
            return;
        }

        const allowedStatuses = [
            'pending',
            'in-progress',
            'completed'
        ];

        if (
            Object.hasOwn(data, 'status') &&
            (
                typeof data.status !== 'string' ||
                !allowedStatuses.includes(data.status)
            )
        ) {
            res.statusCode = 400;
            res.end(JSON.stringify({
                error: 'Invalid status'
            }));
            return;
        }

    
        const currentTask = createTaskService(data);

   
        res.statusCode = 201;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(currentTask));
    });
}


function getTaskList(req,res) {
    const tasks = getAllTasks()
    res.statusCode = 200
    res.setHeader('Content-Type','application/json')
    res.end(JSON.stringify(tasks))

}




function modifyTask(req,res) {
    const allowedFields = ['title', 'description', 'status', 'dueDate'];
    let body = ''
    req.on('data',chunk =>{
        body += chunk
    })
    req.on('end' ,()=>{
        let data;
        
        try {
            data = JSON.parse(body);
        } catch {
            res.statusCode = 400;
            res.end(JSON.stringify({
                error: 'Invalid JSON'
            }));
            return;
        }
        if (
            data === null ||
            typeof data !== 'object' ||
            Array.isArray(data) ||
            Object.keys(data).length === 0
        ) {
            res.statusCode = 400;
            res.end(JSON.stringify({
                error: 'Empty or invalid update body'
            }));
            return
        }
        const feilds = Object.keys(data)
        for(const feild of feilds){
            if (!allowedFields.includes(feild)) {
                res.statusCode = 400
                res.end(JSON.stringify({
                    error: `Invalid field: ${feild}`
                }))            
                return
            }
                
            }

            if (Object.hasOwn(data, 'title') && (typeof data.title !== 'string' || data.title.trim() === '')) {
            res.statusCode = 400;
            res.end(JSON.stringify({
                error: 'Title must be a string'
            }));
            return;
            }

            if (Object.hasOwn(data, 'description') && typeof data.description !== 'string') {
            res.statusCode = 400;
            res.end(JSON.stringify({
                error: 'Description must be a string'
            }));
            return;
            }

            if (Object.hasOwn(data, 'status') && (typeof data.status !== 'string' || !(data.status === 'pending' || data.status === 'in-progress' || data.status === 'completed') )) {
            res.statusCode = 400;
            res.end(JSON.stringify({
                error: 'Status must be pending, in-progress, or completed'
            }));
            return;
            }

            if (Object.hasOwn(data, 'dueDate') && data.dueDate !==  null  &&(typeof data.dueDate !== 'string' || !isValidDate(data.dueDate))) {
            res.statusCode = 400;
            res.end(JSON.stringify({
                error: 'Invalid due date'
            }));
            return
            }
                    
        const task = updateTask(req.params.id, data);

        if (!task) {
            res.statusCode = 404;
            res.end(JSON.stringify({
                error: 'Task Not Found'
            }));
            return;
        }

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(task));

    })




}




function deleteTask(req,res) {
    const deleted = deleteTaskService(req.params.id);
    if (!deleted) {
        res.statusCode = 404;
        res.end(JSON.stringify({
            error: 'Task Not Found'
        }));
        return;
    }

    res.statusCode = 204;
    res.end();




}





function getTask(req,res) {
    
    const taskId = req.params.id
    
    const task = getTaskService(taskId)

    if (task) {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(task))
        return
    }

    res.statusCode = 404
    res.end(JSON.stringify({
        error: 'Not Found'
    }))
    return



}

module.exports = {
    createTask,
    getTaskList,
    getTask,
    modifyTask,
    deleteTask
}

// module.exports = { createTask };