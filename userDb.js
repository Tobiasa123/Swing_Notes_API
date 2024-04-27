const Datastore = require('nedb-promise')
const { v4: uuidv4 } = require('uuid');


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
const insertNote = async (userId, title, text) => {

    //definera max längd enligt specifikation
    if (title.length > 50) {
        throw new Error('Title exceeds maximum length of 50 characters');
    }
    if (text.length > 300) {
        throw new Error('Text exceeds maximum length of 300 characters');
    }

    const noteId = uuidv4();
    const currentDate = new Date();
    //formattera date så det blir läsbart
    const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')} ${currentDate.getHours().toString().padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')}`;
    try {
        //hitta user via id
        const user = await db.findOne({ _id: userId });
        if (!user) {
            throw new Error('User not found');
        }
        const newNote = {
            id: noteId,
            title: title,
            text: text,
            createdAt: formattedDate
        };
        //om min user har notes arrayen redan pusha i den annars skapa ny array
        if (!user.note) {
            user.note = [newNote];
        } else { user.note.push(newNote); }

        //updatera användaren
        await db.update({ _id: userId }, user);

        //returnera note
        return newNote;
    } catch (error) {
        console.error('Error inserting note:', error);
        throw error;
    }
};
const modifyNote = async (userId, oldTitle, newTitle, newText) => {

    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')} ${currentDate.getHours().toString().padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')}`;

    try {
        const user = await db.findOne({ _id: userId });

        if (!user) {
            throw new Error('User not found');
        }

        const noteIndex = user.note.findIndex(note => note.title === oldTitle);
        if (noteIndex === -1) {
            throw new Error('Note not found');
        }

        //update the note
        if (newTitle) user.note[noteIndex].title = newTitle;
        if (newText) user.note[noteIndex].text = newText;

        //my modified date
        user.note[noteIndex].modifiedAt = formattedDate;

        await db.update({ _id: userId }, user);

        return user.note[noteIndex];
    } catch (error) {
        console.error('Error modifying note:', error);
        throw error;
    }
};
//get all user notes
const getNotes = async (userId) => {
    const user = await db.findOne({ _id: userId });
    return user.note
}
const deleteNote = async (userId, title) => {
    try {
        const user = await db.findOne({ _id: userId });
        if (!user) {
            throw new Error('User not found');
        }

        const noteIndex = user.note.findIndex(note => note.title === title);
        if (noteIndex === -1) {
            throw new Error('Note not found');
        }

        const deletedNote = user.note.splice(noteIndex, 1)[0];

        await db.update({ _id: userId }, user);

        return deletedNote;
    } catch (error) {
        console.error('Error deleting note:', error);
        throw error;
    }
}
const findNote = async (title) => {
    try {
        const user = await db.findOne({}); 
        if (!user || !user.note) {
            return null;
        }
        const note = user.note.find(note => note.title === title);
        return note || null;
    } catch (error) {
        console.error('Error finding note:', error);
        throw error;
    }
};

module.exports = {saveUser, findUser, insertNote, modifyNote, getNotes, deleteNote, findNote}
