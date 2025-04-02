import mysql from 'mysql2/promise'
import { config } from "../config"

const Pool = mysql.createPool({
    host: config.DB_HOST,
    user: config.DB_USERNAME,
    password: config.DB_PASSWORD,
    database: config.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default Pool;