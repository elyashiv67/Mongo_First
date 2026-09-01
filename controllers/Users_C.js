import User from '../module/Users.js';

async function getAllUsers(req, res) {
    try {
        const users = await User.find();

        if (users.length === 0)
            return res.status(404).json({message: 'No users found.'});

        return res.status(200).json(users);
    } catch (e) {
        return res.status(500).json({message: `Server error: ${e.message}`});
    }
}

async function getUserById(req, res) {
    try {
        const id = req.id;

        const user = await User.findById(id);

        if (!user)
            return res.status(404).json({message: 'User not found'});

        return res.status(200).json(user);
    } catch (e) {
        return res.status(500).json({message: `Server error: ${e.message}`});
    }
}

async function getUsersByAuthor(req, res) {
    try {
        const authors = await User.find({role: 'author'});

        if (authors.length === 0)
            return res.status(404).json({message: 'No authors found.'});

        return res.status(200).json(authors);
    } catch (e) {
        return res.status(500).json({message: `Server error: ${e.message}`});
    }
}

async function createUser(req, res) {
    try {
        const values = req.valid_val;

        const newUser = await User.create(values);
        if (!newUser)
            return res.status(404).json({message: 'User not added'});

        return res.status(200).json(newUser);

    } catch (e) {
        return res.status(500).json({ message: `Server error: ${e.message}` });
    }
}

async function updateUser(req, res) {
    try {
        const id = req.id;
        const values = req.valid_val;

        const updatedUser = await User.findByIdAndUpdate(id, values);
        if (!updatedUser)
            return res.status(404).json({message: 'User not found'});

        return res.status(200).json(updatedUser);
    } catch (e) {
        return res.status(500).json({ message: `Server error: ${e.message}` });
    }
}

async function deleteUser(req, res) {
    try {
        const id = req.id;

        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser)
            return res.status(404).json({message: 'User not found'});

        return res.status(200).json(deletedUser);
    } catch (e) {
        return res.status(500).json({ message: `Server error: ${e.message}` });
    }
}

export {getAllUsers, getUsersByAuthor, getUserById , createUser , updateUser , deleteUser};