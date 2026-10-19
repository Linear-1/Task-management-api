
const { createClient } = require('redis');

const redisClient = createClient({
    url: 'redis://localhost:6379',
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
