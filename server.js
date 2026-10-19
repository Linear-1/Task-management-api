const { log } = require('console');
const redisClient = require('./redis');
const { routes } = require('./routes/taskRoutes');





const http = require('http')

const server = http.createServer((req,res)=>{
const url = new URL(req.url, `http://${req.headers.host}`);
const pathname = url.pathname;
let pathExists = false;

for (const route of routes) {
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

    if (!matched) continue;

    pathExists = true;

    if (route.method !== req.method) continue;

    req.params = params;
    route.handler(req, res);
    return;
}

if (pathExists) {
    res.statusCode = 405;
    res.setHeader('Allow', 'GET, POST, PATCH, DELETE');
    res.end(JSON.stringify({
        error: 'Method Not Allowed'
    }));
    return;
}

res.statusCode = 404;
res.end(JSON.stringify({
    error: 'Route not found'
}));
})


async function startServer() {
    try {
        await redisClient.connect()
        console.log('Redis connnceted sucessfully');
        
    } catch (err) {
        console.error(
            'Redis unavailable; starting without cache:',err.message)

    }
    server.listen(3000,()=>{
        console.log('server is running on port 3000');
        
    })



}

startServer()














