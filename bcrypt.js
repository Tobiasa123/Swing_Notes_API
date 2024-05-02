
const bcrypt = require('bcryptjs')

//hasha lösenord
const hashPassword = async (password) => {
    const hashedPassword = await bcrypt.hash(password, 10)
    return hashedPassword
}
//jämför läsenord
const comparePassword = async (password, hashedPassword) => {
    const matching = await bcrypt.compare(password, hashedPassword)
    return matching //blir true eller false
}

module.exports = {hashPassword, comparePassword}