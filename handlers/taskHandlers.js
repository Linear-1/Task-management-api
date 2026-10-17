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

    req.on('end', async () => {
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

        try {
            const currentTask = await createTaskService(data);


            res.statusCode = 201;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(currentTask));
        } catch (error) {
            console.error('Failed to create the task :' ,error)


            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
               error: 'Internal server error' 
            }))
            
        }

    });
}


async function getTaskList(req,res) {
    try {
        const tasks = await getAllTasks()
        res.statusCode = 200
        res.setHeader('Content-Type','application/json')
        res.end(JSON.stringify(tasks))
        
    } catch (error) {
            console.error('Failed to retrieve tasks:' ,error)


            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
               error: 'Internal server error' 
            }))
    }
    
}




function modifyTask(req,res) {
    const allowedFields = ['title', 'description', 'status', 'dueDate'];
    let body = ''
    req.on('data',chunk =>{
        body += chunk
    })
    req.on('end' ,async ()=>{
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
        try {
            const task = await updateTask(req.params.id, data);
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
            


        } catch (error) {
            console.error('Failed to update task:' ,error)


            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
               error: 'Internal server error' 
            }))
        }
        



    })




}




async function deleteTask(req,res) {
    try {
        const deleted = await deleteTaskService(req.params.id);
        if (deleted) {
            
            res.statusCode = 204;
            res.end();
            
        } else {
            res.statusCode = 404
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({
                error: 'Task Not Found'
            }))
        }    
    } catch (error) {
            console.error('Failed to delete task:' ,error)


            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({
                error: 'Internal Server Error'
            }))
    
    




}
}




async function getTask(req,res) {
    const taskId = req.params.id
    
    try {
        const task = await getTaskService(taskId)
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

    } catch (error) {
            console.error('Failed to retrive task:' ,error)


            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({
                error: 'Internal Server Error'
            }))      
    }
    
}

module.exports = {
    createTask,
    getTaskList,
    getTask,
    modifyTask,
    deleteTask
}

// module.exports = { createTask };