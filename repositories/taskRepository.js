const pool = require("../db");



async function createTask(data) {
    
    const query = `
    INSERT INTO tasks (title, description, status, due_date)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
`;

    const values = [
    data.title,
    data.description ?? '',
    data.status,
    data.dueDate
];

    const result = await pool.query(query, values);
    const row = result.rows[0]
    const task = {
        id: row.id,
        title: row.title,
        description: row.description,
        status: row.status,
        dueDate: row.due_date,
        createdAt: row.created_at,
        updatedAt: row.updated_at
    }
    return task



}

async function getAllTasksFromDB() {
    const query = `
        SELECT * FROM tasks;
    `

    const result = await pool.query(query)
    // const tasks = result.rows
    const tasks = result.rows.map((row)=>{
        return {
            id: row.id,
            title: row.title,
            description: row.description,
            status: row.status,
            dueDate: row.due_date,
            createdAt: row.created_at,
            updatedAt: row.updated_at
        }
    })
    return tasks
}

async function deleteTaskFromDB(taskID) {
    const query = `
        DELETE FROM tasks
        WHERE id = $1
        RETURNING id;

    `
    const result = await pool.query(query,[taskID])

 
    return result.rowCount === 1



}

async function getTaskFromDB(taskID) {
    const query = `
        SELECT * FROM tasks 
        WHERE id = $1; 

    `
    const result = await pool.query(query,[taskID])

    const row = result.rows[0]
    if (row) {
        const task = {
            id: row.id,
            title: row.title,
            description: row.description,
            status: row.status,
            dueDate: row.due_date,
            createdAt: row.created_at,
            updatedAt: row.updated_at
        }
        return task
    

    } else {
        return null
    }

}





async function upadtingTask(taskId,data) {

    const assignment = []
    const values = []

    if (Object.hasOwn(data, 'title')) {
        values.push(data.title)
        assignment.push(`title = $${values.length}`)

    }
    
    if (Object.hasOwn(data, 'description')) {
        values.push(data.description)
        assignment.push(`description = $${values.length}`)

    }
    if (Object.hasOwn(data, 'status')) {
        values.push(data.status)
        assignment.push(`status = $${values.length}`)

    }
    if (Object.hasOwn(data, 'dueDate')) {
        values.push(data.dueDate)
        assignment.push(`due_date = $${values.length}`)

    }
    values.push(taskId)


    const query = `
        UPDATE tasks
        SET ${assignment.join(', ')},
            updated_at = NOW()
        WHERE id = $${values.length}
        RETURNING *;
`
    const result = await pool.query(query,values)

    const row = result.rows[0]
    if (row) {
        const task = {
            id: row.id,
            title: row.title,
            description: row.description,
            status: row.status,
            dueDate: row.due_date,
            createdAt: row.created_at,
            updatedAt: row.updated_at
        }
        return task
    } else {
        return null
    }


}



module.exports = { createTask,
                getAllTasksFromDB,
                deleteTaskFromDB,
                getTaskFromDB,
                upadtingTask
                                    };