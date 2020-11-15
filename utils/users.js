const users = [];

// Join user to chat
function userJoin(id, username, email, phone, message) {
    const user = {id, username, email, phone, message};

    users.push(user);

    return user;
}

// get the current user
function getCurrentUser(id) {
    return users.find(user => user.id === id);
}

// check leaving users
function userLeave(id) {
    const index = users.findIndex(user => user.id === id);

    if(index !== -1) {
        return users.splice(index, 1)[0];
    }
}

// get room users
function getRoomUsers(room) {
    return users;
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
}
