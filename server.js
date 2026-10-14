
const { randomUUID } = require('crypto');

const storage = []
function isValidDate(date) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return false;
    }

    const parsed = new Date(date);

    return !isNaN(parsed.getTime()) &&
        parsed.toISOString().slice(0, 10) === date;
}


function createTask(req,res) {
  let body = ''
  
  req.on('data',chunk =>{
    body += chunk
  })
  

  req.on('end', ()=>{
  let data 
  try {
    data = JSON.parse(body)
  } catch  {
    res.statusCode = 400
    res.end('Invalid JSON')
    return
}
  if (typeof(data.title) !== 'string') {
        res.statusCode = 400
        res.end('Incorrcet data type require string')
        return
    }  
  if (typeof(data.description) !== 'string') {
        res.statusCode = 400
        res.end('Incorrcet data type require string')
        return

  }
// console.log(data.dueDate);
// console.log(isValidDate(data.dueDate));
  if(!isValidDate(data.dueDate)){
    res.statusCode = 400
    res.end(JSON.stringify({
        error: 'Invalid dueDate'

    }))
    return
  }
  const now = new Date().toISOString()
  const currentTask = {
    id: randomUUID(),
    title: data.title,
    description: data.description,
    status: data.status,
    dueDate: data.dueDate,
    createdAt: now,
    updatedAt :now
  }
  storage.push(currentTask)
  

//   tasks.push(currentTask)
  res.statusCode = 201
  res.setHeader('Content-Type','application/json')
  res.end(JSON.stringify(currentTask))
  })}

function getTaskList(req,res) {
    res.statusCode = 200
    res.setHeader('Content-Type','application/json')
    res.end(JSON.stringify(storage))

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
            res.end('Invalid JSON');
            return;
        }
        const feilds = Object.keys(data)
        for(const feild of feilds){
            if (!allowedFields.includes(feild)) {
                res.statusCode = 400
                res.end(`Invalid field: ${feild}`)            
                return
            }
                
            }

            if (Object.hasOwn(data, 'title') && (typeof data.title !== 'string' || data.title.trim() === '')) {
            res.statusCode = 400;
            res.end('Title must be a string');
            return;
            }

            if (Object.hasOwn(data, 'description') && typeof data.description !== 'string') {
            res.statusCode = 400;
            res.end('Description must be a string');
            return;
            }

            if (Object.hasOwn(data, 'status') && (typeof data.status !== 'string' || !(data.status === 'pending' || data.status === 'in-progress' || data.status === 'completed') )) {
            res.statusCode = 400;
            res.end('Status must be pending, in-progress, or completed');
            return;
            }

            if (Object.hasOwn(data, 'dueDate') && (typeof data.dueDate !== 'string' || !isValidDate(data.dueDate))) {
            res.statusCode = 400;
            res.end('Due date must be a string');
            return
            }
                    
            const taskId = req.params.id;
            const task = storage.find(task => task.id === taskId);

            if (!task) {
                res.statusCode = 404
                res.end('Task Not Found')
                return
            }

        if (Object.hasOwn(data, 'title')) {
        task.title = data.title;
        }

        if (Object.hasOwn(data, 'description')) {
        task.description = data.description;
        }

        if (Object.hasOwn(data, 'status')) {
        task.status = data.status;
        }

        if (Object.hasOwn(data, 'dueDate')) {
        task.dueDate = data.dueDate;
        }

        task.updatedAt = new Date().toISOString()

        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(task))

    })




}
function deleteTask(req,res) {
    const taskId = req.params.id 

    const task = storage.find((task)=>{
        return task.id === taskId
    })

    if (task) {
      const index = storage.indexOf(task)
      storage.splice(index,1)
      res.statusCode = 204
      res.end()
      return
    }
    res.statusCode = 404
    res.end('Task Not Found')
    return


}
function getTask(req,res) {
    
    const taskId = req.params.id
    

    const task = storage.find((task)=>{
        return task.id === taskId
    
        
    })
    // console.log(task)
    
    if (task) {
        res.statusCode = 200
        res.setHeader('Content-Type','application/json')
        res.end(JSON.stringify(task))
        return
    }
    res.statusCode = 404
    res.end('Not Found')
    return
}


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

// const { randomUUID } = require('crypto');
const http = require('http')

const server = http.createServer((req,res)=>{
const url = new URL(req.url, `http://${req.headers.host}`);
const pathname = url.pathname;

for (const route of routes) {
    if (route.method !== req.method) continue;

    const routeParts = route.path.split('/');
    const requestParts = pathname.split('/');

    if (routeParts.length !== requestParts.length) continue;

    const params = {};
    let matched = true;

    for (let i = 0; i < routeParts.length; i++) {
        if (routeParts[i].startsWith(':')) {
            params[routeParts[i].slice(1)] = requestParts[i];
        } else if (routeParts[i] !== requestParts[i]) {
            matched = false;
            break;
        }
    }

    if (matched) {
        req.params = params;
        route.handler(req, res);
        return;
    }  
}

res.statusCode = 404;
res.end('Route not found');
})

server.listen(3000,()=>{
    console.log('server is running on port 3000');
    
})













