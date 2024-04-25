const Datastore = require('nedb-promise')

const db = new Datastore({filename: 'users.db', autoload: true})

const saveUser = (username, password) => {
    db.insert({
        username: username,
        password: password
    })
}
const findUser = (username) => {
    return db.findOne({username: username})
}

module.exports = {saveUser, findUser}
