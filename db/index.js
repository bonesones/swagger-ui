const sqlite3 = require('sqlite3')
const { open } = require('sqlite')

const openDb = async function() {
    const db = await open({
        filename: "./db/books.db",
        driver: sqlite3.Database
    })

    return db
}

module.exports = { openDb }
