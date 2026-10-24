const { createClient } = require('redis');
const config = require("./config");




const redisClient = createClient({
    url: config.redisURL,

    
    socket: {
        reconnectStrategy: (retries) => {
            if (retries >= 3) {
                return new Error('Redis reconnect limit reached');
            }

            return 1000;
        }
    }
});

redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});

module.exports = redisClient;
