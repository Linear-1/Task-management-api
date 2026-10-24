require("dotenv").config();

function checkMissing(feild) {
    const value = process.env[feild]

    if (!value || value.trim() === '') {
        throw new Error(
            `Missing required environment variable: ${feild}`
        )
    }

    return value 
}


function positiveInterger(name,value) {
    const number = Number(value)

    if (!Number.isInteger(number) ||  number <= 0) {
        throw new Error(
            `${name} must be positive number`
        )
    }

    return number 
}


const config = {
    port: positiveInterger('PORT', process.env.PORT ?? '3000'),

    database: {
        host: checkMissing("DB_HOST"),
        port: positiveInterger("DB_PORT", checkMissing("DB_PORT")),
        name: checkMissing("DB_NAME"),
        user: checkMissing("DB_USER"),
        password: checkMissing("DB_PASSWORD"),
    },


    redisURL: process.env.REDIS_URL || 'redis://localhost:6379' ,

}

module.exports = config