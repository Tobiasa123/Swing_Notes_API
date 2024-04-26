const {Router} = require('express')
const db = require('./userDb')
const {comparePassword, hashPassword} = require('./bcrypt')
const jwt = require('jsonwebtoken')
const {auth} = require('./middleware/auth')

const router = Router()

//endpoints
router.get('/notes', (req, res) => {
    //get notes
})
router.post('/notes', auth, async (req, res) => {
    try {
        const { title, text } = req.body;

        //insert the new note into the user object
        const newNote = await db.insertNote(req.user.id, title, text);

        res.status(201).json({ message: 'Note created successfully', note: newNote });
    } catch (error) {
        console.error('Error creating note:', error);
        res.status(500).json({ error: 'An error occurred while creating the note' });
    }
});
//ändra en antäckning
router.put('/notes', auth, async (req, res) => {
    try {
        const { oldTitle, newTitle, newText } = req.body;

        //modify note
        const modifiedNote = await db.modifyNote(req.user.id, oldTitle, newTitle, newText);

        res.status(200).json({ message: 'Note updated successfully', note: modifiedNote });
    } catch (error) {
        console.error('Error updating note:', error);
        res.status(500).json({ error: 'An error occurred while updating the note' });
    }

})
router.delete('/notes', (req, res) => {
    //ta bort en antäckning
})
router.post('/user/signup', async (req, res) => {
    //skapa konto
    const {username, password} = req.body;

    const hashedPassword = await hashPassword(password)

    const user = await db.findUser(username)
    if (user){
        res.status(409).json({ error: 'User already exists' });
        return
    }

    db.saveUser(username, hashedPassword)
    res.status(200).json({ message: 'New user saved!'})

})
router.post('/user/login', async (req, res) => {
    //logga in, måste vara inloggad för att göra notes
    const {username, password} = req.body;
    const user = await db.findUser(username)

    if(user == null){
        res.status(404).json({error: 'user not found'})
        return
    }
    const matchingPassword = await comparePassword(password, user.password)
    if(matchingPassword){
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: 300})
        let result = {
            token: token
        }
        res.status(200).json(result)
    }
    else{
        res.status(401).json({error: 'wrong password!'})
    }


})
router.get('/notes/search', (req, res) => {
    //sök bland anteckningar
})

module.exports = router;
